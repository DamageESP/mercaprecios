import { oauth2Client } from "./lib/google";


const code = process.argv[2];
if (!code) {
  console.error('Please provide the authorization code as a command-line argument.');
  process.exit(1);
}

(async () => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Tokens:', tokens);
  } catch (error) {
    console.error('Error retrieving tokens:', error);
  }
})();