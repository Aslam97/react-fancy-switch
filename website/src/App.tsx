import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { cn } from './lib/utils'
import { FancySwitch } from '@omit/react-fancy-switch'
import { useEffect } from 'react'

const orderTypes = ['Delivery', 'Pickup', 'Shipping']
const options = [
  { label: 'Publish', value: 1, test: 'H' },
  { label: 'Draft', value: 0, test: 'U' }
]
const pets = [
  { text: 'Car, (AKA Cat)', id: 1 },
  { text: 'Dog', id: 2 }
]

const FormSchema = z.object({
  isPublished: z.coerce.number(),
  orderType: z.string().min(1, {
    message: 'Order type is required'
  }),
  option: z.string().min(1, {
    message: 'Option is required'
  }),
  pet: z.coerce.number()
})

function App() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      orderType: 'Pickup',
      isPublished: 0,
      pet: 1
    }
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        console.log('ArrowUp/ArrowDown')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex min-h-screen place-items-center justify-center p-4">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight sm:text-3xl">
            Fancy Switch
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              <a
                href="https://github.com/Aslam97/shadcn-fancy-switch"
                className="font-semibold text-primary"
              >
                View on Github <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-6"
          >
            <FormField
              control={form.control}
              name="orderType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Order type: {form.getValues('orderType')}
                  </FormLabel>
                  <FormControl>
                    <FancySwitch
                      value={field.value}
                      onChange={(value) => form.setValue('orderType', value)}
                      options={orderTypes}
                      data-testid="orderType"
                      className="flex rounded-full bg-muted p-2"
                      highlighterClassName="bg-primary rounded-full"
                      aria-label="Order type"
                      radioClassName={cn(
                        'relative mx-2 flex h-9 cursor-pointer items-center justify-center',
                        'rounded-full px-3.5 text-sm font-medium transition-colors focus:outline-none data-[checked]:text-primary-foreground',
                        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
                      )}
                      highlighterIncludeMargin={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Is published: {form.getValues('isPublished')}
                  </FormLabel>
                  <FormControl>
                    <FancySwitch
                      value={field.value}
                      onChange={field.onChange}
                      options={options}
                      className="rounded-xl bg-muted p-2"
                      highlighterClassName="bg-primary rounded-xl"
                      radioClassName={cn(
                        'relative flex h-9 cursor-pointer items-center justify-center',
                        'rounded-full px-3.5 text-sm font-medium transition-colors data-[checked]:text-primary-foreground',
                        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pet:{' '}
                    {pets.find((p) => p.id === form.getValues('pet'))?.text}
                  </FormLabel>
                  <FormControl>
                    <FancySwitch
                      value={field.value}
                      onChange={field.onChange}
                      options={pets}
                      valueKey="id"
                      labelKey="text"
                      className="rounded-3xl bg-muted p-2"
                      highlighterClassName="bg-primary rounded-full"
                      renderOption={({ option, getOptionProps }) => (
                        <div
                          {...getOptionProps()}
                          className={cn(
                            'relative mx-2 flex h-9 cursor-pointer items-center justify-center',
                            'rounded-full px-3.5 text-sm font-medium transition-colors data-[checked]:text-primary-foreground',
                            'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                            'gap-1'
                          )}
                        >
                          {option.value === 2 && '🐶'}
                          {option.value === 1 && '🐈'}
                          <span>{option.label}</span>
                        </div>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default App
