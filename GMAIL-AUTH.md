# Authenticating with Gmail to crawl the latest tickets

1. `bun email/authenticate.ts` and open URL in browser
2. After successful authorization, copy the value of the `code` query param
3. `bun email/oauthcallback.ts <YOUR_AUTHORIZATION_CODE>`, copy auth and refresh tokens
4. Paste values in the database, table `AccessToken`
5. Edit `email/index.ts` to call the `crawlEmail` method.
6. `bun email/index.ts` and wait
7. Done.
