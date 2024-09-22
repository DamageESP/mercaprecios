import sqlite3 from 'sqlite3'
import { TokenData } from './types';


const db = new sqlite3.Database('database.db');

export function initializeDatabase() {
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS tokens (accessToken TEXT, refreshToken TEXT)')
    db.run('CREATE TABLE IF NOT EXISTS products (name TEXT, quantity INT, pricePerUnit REAL, priceTotal REAL)')
  })
}

export function storeToken(accessToken: string, refreshToken: string) {
  db.serialize(() => {
    db.run('DELETE FROM tokens')
    const stmt = db.prepare('INSERT INTO tokens (accessToken, refreshToken) VALUES (?, ?)')
    stmt.run(accessToken, refreshToken)
    stmt.finalize()
  })
}

export async function getToken(): Promise<TokenData> {
  try {
    const row = await new Promise<TokenData>((resolve, reject) => {
      db.get('SELECT * FROM tokens', (err, row: TokenData) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
    return row
  } catch (err) {
    throw new Error(`Failed to get token: ${err.message}`)
  }
}