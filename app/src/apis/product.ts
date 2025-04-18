import { getTelegramInitData } from '@/global/telegram'
import axios from 'axios'

const service = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/products`,

})

service.interceptors.request.use((config) => {
  const initData = getTelegramInitData()

  if (!initData) {
    throw new Error('Telegram init data is not set')
  }

  config.headers['X-Telegram-InitData'] = initData
  config.headers.Authorization = `Bearer ${import.meta.env.VITE_API_TOKEN}`

  return config
})

export interface Product {
  id: string
  name: string
  price: number
  platforms: string[]
}

export async function getProducts() {
  return service.get<{
    data: Product[]
  }>('/')
}

export async function createProduct(product: Omit<Product, 'id'>) {
  return service.post('/', product)
}

export async function deleteProduct(id: string) {
  return service.delete(`/${id}`)
}
