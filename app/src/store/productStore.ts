import type { Product } from '@/apis/product'
import { createProduct, deleteProduct, getProducts, updateProduct } from '@/apis/product'
import { toast } from 'sonner'
import { create } from 'zustand'

interface ProductState {
  products: Product[]
  isLoading: boolean
  editingProduct: Product | null

  // Actions
  fetchProducts: () => Promise<boolean>
  addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>
  editProduct: (id: string, product: Omit<Product, 'id'>) => Promise<boolean>
  removeProduct: (id: string) => Promise<boolean>
  setEditingProduct: (product: Product | null) => void
  testProductNotification: (productName: string) => void
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  editingProduct: null,

  fetchProducts: async () => {
    set({ isLoading: true })
    try {
      const { data } = await getProducts()
      set({ products: data.data, isLoading: false })
      return true
    }
    catch (error: any) {
      console.error('Fetch products failed', error)
      toast.error('Fetch products failed')
      set({ isLoading: false })
      return false
    }
  },

  addProduct: async (product) => {
    set({ isLoading: true })
    try {
      await createProduct(product)
      toast.success('Product added successfully!')
      await get().fetchProducts()
      return true
    }
    catch (error: any) {
      console.error('Add product failed', error)
      toast.error('Add product failed')
      set({ isLoading: false })
      return false
    }
  },

  editProduct: async (id, product) => {
    set({ isLoading: true })
    try {
      await updateProduct(id, product)
      toast.success('Product updated successfully')
      await get().fetchProducts()
      return true
    }
    catch (error: any) {
      console.error('Update product failed', error)
      toast.error('Update product failed')
      set({ isLoading: false })
      return false
    }
  },

  removeProduct: async (id) => {
    set({ isLoading: true })
    try {
      await deleteProduct(id)
      toast.success('Delete product successfully')
      await get().fetchProducts()
      return true
    }
    catch (error: any) {
      console.error('Delete product failed', error)
      toast.error('Delete product failed')
      set({ isLoading: false })
      return false
    }
  },

  setEditingProduct: (product) => {
    set({ editingProduct: product })
  },

  testProductNotification: (productName) => {
    toast.info(
      `Test notification for "${productName}". This button helps you verify that discount notifications for this product will be properly sent to your Telegram.`,
      { duration: 6000 },
    )
  },
}))
