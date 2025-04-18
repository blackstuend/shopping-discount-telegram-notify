import { createProduct } from '@/apis/product'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const platforms = ['pchome', 'momo']

interface AddProductBtnProps {
  onSuccess: () => void
}

export default function AddProductBtn({ onSuccess }: AddProductBtnProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <AddProductForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}

interface AddProductFormProps {
  onSuccess: () => void
}

function AddProductForm({ onSuccess }: AddProductFormProps) {
  const formSchema = z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    platforms: z.array(z.enum(platforms as [string, ...string[]])).min(1),
    // shopeeLink: z.string().optional().refine(
    //   (val) => {
    //     // If platform includes 'shopee', then shopeeLink is required
    //     // eslint-disable-next-line ts/no-use-before-define
    //     const platforms = form.getValues('platforms')
    //     if (platforms.includes('shopee')) {
    //       // Check if value exists and starts with https
    //       return !!val && val.startsWith('https://') // Must have a value and be https
    //     }
    //     return true // Otherwise optional
    //   },
    //   {
    //     message: 'Shopee link not valid',
    //   },
    // ),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: 0,
      platforms: [],
      // shopeeLink: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await createProduct({
        name: data.name,
        price: data.price,
        platforms: data.platforms,
        // shopeeLink: data.shopeeLink,
      })

      toast.success('Product added successfully!', {
        position: 'top-center',
      })
      onSuccess()
    }
    catch (error: any) {
      console.error('Add product failed', error)

      toast.error('Add product Failed, Please connect to the developer', {
        position: 'top-center',
      })

      return
    }

    toast.success('Product added successfully!', {
      position: 'top-center',
    })
    onSuccess()
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        id={platform}
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
                      <FormLabel htmlFor={platform}>{platform}</FormLabel>

                    </div>
                  ))
                }
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {
            form.watch('platforms').includes('shopee') && (
              <FormField
                control={form.control}
                name="shopeeLink"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Shopee Link</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Shopee search can only use links and cannot perform fuzzy searches
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          } */}
          <Button type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  )
}
