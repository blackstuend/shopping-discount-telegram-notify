import type { Product } from '@/apis/product'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useProductStore } from '@/store/productStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const platforms = ['pchome', 'momo']

export interface ProductFormProps {
  mode: 'add' | 'edit'
  product?: Product
  onSuccess: () => void
  onCancel?: () => void
}

export default function ProductForm({ mode, product, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const { addProduct, editProduct } = useProductStore()

  const formSchema = z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    platforms: z.array(z.enum(platforms as [string, ...string[]])).min(1),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mode === 'edit' && product
      ? {
          name: product.name,
          price: product.price,
          platforms: product.platforms || [],
        }
      : {
          name: '',
          price: 0,
          platforms: [],
        },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    let success = false
    setLoading(true)
    if (mode === 'edit' && product) {
      success = await editProduct(product.id, {
        name: data.name,
        price: data.price,
        platforms: data.platforms,
      })
    }
    else {
      success = await addProduct({
        name: data.name,
        price: data.price,
        platforms: data.platforms,
      })
    }
    setLoading(false)

    if (success) {
      onSuccess()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md z-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Please enter the more specific name, AI will use this name to search
                product on certain platforms.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="input"
                  onChange={e => field.onChange(Number.parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="platforms"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Platforms</FormLabel>
              {
                platforms.map(platform => (
                  <div className="flex items-center gap-2" key={platform}>
                    <Checkbox
                      id={`${mode}-${platform}`}
                      key={platform}
                      checked={field.value.includes(platform)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, platform])
                        }
                        else {
                          field.onChange(field.value.filter(p => p !== platform))
                        }
                      }}
                    />
                    <FormLabel htmlFor={`${mode}-${platform}`}>{platform}</FormLabel>
                  </div>
                ))
              }
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={`${onCancel ? 'flex justify-end gap-2 mt-4' : ''}`}>
          {onCancel && (
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {mode === 'edit' ? 'Save Changes' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
