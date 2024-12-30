import { google, gmail_v1 } from "googleapis";
import { getTokens } from "../db";
import { PROCESSED_MESSAGES_LABEL } from "./constants";

// Initialize OAuth2 client - replace placeholders with your credentials
export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NUXT_PUBLIC_URL}/oauthcallback`
);

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://mail.google.com/"],
  });
}

export async function authenticate() {
  // Check if we have previously stored a token
  const tokenData = await getTokens();
  if (!tokenData) {
    console.log("No token data found");
    return;
  }
  const accessToken = tokenData.find(
    (token) => token.name === "accessToken"
  )?.token;
  const refreshToken = tokenData.find(
    (token) => token.name === "refreshToken"
  )?.token;
  // Set credentials for the OAuth2 client
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
}

export const gmail = google.gmail({ version: "v1", auth: oauth2Client });

export async function getMessages() {
  // Get all messages in the user's mailbox
  // Only get messages from the inbox, exclude ones with the PROCESSED label
  const messageList = await gmail.users.messages.list({
    userId: "me",
    q: "in:inbox -label:" + PROCESSED_MESSAGES_LABEL,
  });

  if (!messageList.data.messages?.length) {
    throw new Error("No messages found");
  }

  const messages = await Promise.all(
    messageList.data.messages.map(async (message) => {
      const fullMessage = await gmail.users.messages.get({
        userId: "me",
        id: message.id as string,
      });
      return fullMessage.data;
    })
  );
  return messages;
}

export async function getOrCreateProcessedInboxLabelId(): Promise<string> {
  const labels = await gmail.users.labels.list({
    userId: "me",
  });
  const inboxLabel = labels.data.labels?.find(
    (label) => label.name === PROCESSED_MESSAGES_LABEL
  );
  if (!inboxLabel) {
    const creationResponse = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: PROCESSED_MESSAGES_LABEL,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });
    console.log("Created label", creationResponse.data);
    return creationResponse.data.id || "";
  }
  return inboxLabel.id || "";
}

export async function moveMessageToProcessedInbox(messageId: string) {
  const labelId = await getOrCreateProcessedInboxLabelId();
  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: {
      addLabelIds: [labelId],
    },
  });
}

export async function getAttachmentsForMessage(
  message: gmail_v1.Schema$Message
): Promise<{ filename: string; body: string }[]> {
  if (!message.id) {
    throw new Error(`Message ID is required`);
  }
  const attachmentNames =
    message.payload?.parts?.filter((part) => part.filename) || [];
  const attachments = [];
  for (const attachmentName of attachmentNames) {
    const attachmentId = attachmentName.body?.attachmentId;
    if (!attachmentId) {
      continue;
    }
    const attachmentData = await gmail.users.messages.attachments.get({
      userId: "me",
      messageId: message.id,
      id: attachmentId,
    });
    const data = attachmentData.data.data;
    const filename = attachmentName.filename;
    if (!data || !filename) {
      console.warn(`Attachment ${filename} is missing data`);
      continue;
    }

    attachments.push({
      filename,
      body: data,
    });
  }
  return attachments;
}
