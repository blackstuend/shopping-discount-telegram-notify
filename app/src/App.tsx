import AddProductBtn from '@/components/product/addProductBtn'
import ProductList from '@/components/product/list'
import { Toaster } from '@/components/ui/sonner'
import { getTelegramInitData } from '@/global/telegram'
import { useState } from 'react'
import './App.css'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const initData = getTelegramInitData()

  if (!initData) {
    return <div>Loading...</div>
  }
  else {
    return (
      <>
        <Toaster />
        <div className="min-h-screen w-full bg-background text-white">
          <div className="p-4">
            <AddProductBtn onSuccess={() => {
              setRefreshTrigger(prev => prev + 1)
            }}
            >
            </AddProductBtn>
            <div className="mt-4">
              <ProductList refreshTrigger={refreshTrigger}></ProductList>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default App
