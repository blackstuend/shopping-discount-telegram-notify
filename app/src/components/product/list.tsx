import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useProductStore } from '@/store/productStore'
import { Loader2, PencilIcon, RadioTower, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import ProductForm from './ProductForm'

interface ProductListProps {
  refreshTrigger?: number
}

export default function ProductList({ refreshTrigger = 0 }: ProductListProps) {
  const {
    products,
    editingProduct,
    fetchProducts,
    removeProduct,
    setEditingProduct,
    testProductNotification,
  } = useProductStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts, refreshTrigger])

  const handleRemoveProduct = async (productId: string) => {
    setDeletingId(productId)
    try {
      await removeProduct(productId)
    }
    finally {
      setDeletingId(null)
    }
  }

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
            <TableRow key={product.id} className={deletingId === product.id ? 'opacity-50 pointer-events-none' : ''}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.platforms?.join(', ') || 'N/A'}</TableCell>
              <TableCell className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => testProductNotification(product.name)}
                      title="Test notification"
                    >
                      <RadioTower className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs break-all whitespace-normal">
                      Test notification: Sends price alert to Telegram chat.
                      <br />
                      Process may take up to a minute to complete.
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingProduct(product)}
                  title="Edit product"
                  disabled={deletingId === product.id}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveProduct(product.id)}
                  title="Delete product"
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id
                    ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )
                    : (
                        <Trash2 className="h-4 w-4" />
                      )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingProduct} onOpenChange={open => !open && setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              mode="edit"
              product={editingProduct}
              onSuccess={() => setEditingProduct(null)}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
