import type { Product } from '@/apis/product'
import { deleteProduct, getProducts } from '@/apis/product'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { TestTube2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ProductListProps {
  refreshTrigger?: number
}

export default function ProductList({ refreshTrigger = 0 }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])

  const fetchProducts = async () => {
    try {
      const { data } = await getProducts()

      setProducts(data.data)
    }
    catch (error: any) {
      console.error('Fetch products failed', error)
      toast.error('Fetch products failed')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId)
      toast.success('Delete product successfully')
      fetchProducts()
    }
    catch (error: any) {
      console.error('Delete product failed', error)
      toast.error('Delete product failed')
    }

    fetchProducts()
  }

  const handleTestButtonClick = (productName: string) => {
    toast.info(
      `Test notification for "${productName}". This button helps you verify that discount notifications for this product will be properly sent to your Telegram.`,
      {
        duration: 6000,
      },
    )
  }

  useEffect(() => {
    fetchProducts()
  }, [refreshTrigger])

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Product List</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead>Operations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.platforms?.join(', ') || 'N/A'}</TableCell>
              <TableCell className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTestButtonClick(product.name)}
                      title="Test notification"
                    >
                      <TestTube2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Test button: Sends AI search price to chatroom. May take around a minute to execute.</p>
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteProduct(product.id)}
                  title="Delete product"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
