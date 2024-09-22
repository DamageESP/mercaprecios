import fs from 'fs'
import { authenticate, getAuthUrl, getMessages, oauth2Client } from './lib/google'
import express from 'express'
import { initializeDatabase, storeToken } from './db'
import { getProductsFromMessage } from './lib/mercaprecios'


const app = express()

app.get('/', (req, res) => {
  const authUrl = getAuthUrl()
  res.send(`<a href="${authUrl}">Authenticate with Google</a>`)
})

app.get('/oauthcallback', async (req, res) => {
  const code = req.query.code as string
  if (!code) {
    return res.status(400).send('Missing code')
  }
  const { tokens } = await oauth2Client.getToken(code)
  console.log('Received tokens', tokens)
  if (!tokens.access_token || !tokens.refresh_token) {
    return res.status(400).send('Failed to get tokens')
  }
  storeToken(tokens.access_token, tokens.refresh_token)
  oauth2Client.setCredentials(tokens);
  res.redirect('/messages')
})

app.get('/messages', async (req, res) => {
  try {
    const messages = await getMessages()
    const allProducts = []
    let purchaseDate = null
    for (const message of messages) {
      const { date, products } = await getProductsFromMessage(message)
      allProducts.push(...products)
      purchaseDate = date
    }

    res.json({
      date: purchaseDate,
      products: allProducts
    })
  } catch (e) {
    res.status(500).send(e.message)
  }
})

async function initializeApp() {
  initializeDatabase()
  await authenticate()
}

await initializeApp()

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
