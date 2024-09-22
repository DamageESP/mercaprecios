export interface MercaProduct {
  name: string
  quantity: number
  pricePerUnit?: number
  priceTotal: number
}

export interface TokenData { accessToken: string, refreshToken: string }
