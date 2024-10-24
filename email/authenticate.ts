import { getAuthUrl } from "./lib/google";

const url = getAuthUrl();

console.log(`Visit this URL to authenticate: ${url}`);