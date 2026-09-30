import { zodResolver } from '@hookform/resolvers/zod'
import { FancySwitch } from '@omit/react-fancy-switch'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

const orderTypes = ['Delivery', 'Pickup', 'Shipping']
const publishOptions = [
  { label: 'Publish', value: 1, test: 'H' },
  { label: 'Draft', value: 0, test: 'U' }
]
const pets = [
  { text: 'Car, (AKA Cat)', id: 1 },
  { text: 'Dog', id: 2 }
]

const formSchema = z.object({
  isPublished: z.number(),
  orderType: z.string().min(1, { error: 'Order type is required' }),
  pet: z.number()
})

type FormValues = z.infer<typeof formSchema>

const radioClassName = cn(
  'relative flex h-9 cursor-pointer items-center justify-center rounded-full px-3.5',
  'text-sm font-medium transition-colors focus:outline-hidden',
  'data-checked:text-primary-foreground',
  'data-disabled:cursor-not-allowed data-disabled:opacity-50'
)

function App() {
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(
    null
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderType: 'Pickup',
      isPublished: 0,
      pet: 1
    }
  })

  return (
    <main className="flex min-h-screen place-items-center justify-center p-4">
      <div className="mx-auto w-full max-w-4xl">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight sm:text-3xl">
            Fancy Switch
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 ring-1 ring-foreground/10 hover:ring-foreground/20">
              <a
                href="https://github.com/Aslam97/react-fancy-switch"
                className="font-semibold text-primary"
              >
                View on GitHub <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(setSubmittedValues)}
            className="mt-6 space-y-6"
          >
            <FormField
              control={form.control}
              name="orderType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order type: {field.value}</FormLabel>
                  <FormControl>
                    <FancySwitch
                      value={field.value}
                      onChange={field.onChange}
                      options={orderTypes}
                      aria-label="Order type"
                      className="flex rounded-full bg-muted p-2"
                      highlighterClassName="bg-primary rounded-full"
                      radioClassName={cn(radioClassName, 'mx-2')}
                      highlighterIncludeMargin
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
                  <FormLabel>Is published: {field.value}</FormLabel>
                  <FormControl>
                    <FancySwitch
                      value={field.value}
                      onChange={field.onChange}
                      options={publishOptions}
                      aria-label="Is published"
                      className="rounded-xl bg-muted p-2"
                      highlighterClassName="bg-primary rounded-xl"
                      radioClassName={radioClassName}
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
                    Pet: {pets.find((pet) => pet.id === field.value)?.text}
                  </FormLabel>
                  <FormControl>
                    <FancySwitch
                      value={field.value}
                      onChange={field.onChange}
                      options={pets}
                      valueKey="id"
                      labelKey="text"
                      aria-label="Pet"
                      className="rounded-3xl bg-muted p-2"
                      highlighterClassName="bg-primary rounded-full"
                      renderOption={({ option, getOptionProps }) => (
                        <div
                          {...getOptionProps()}
                          className={cn(radioClassName, 'mx-2 gap-1')}
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

            <Button type="submit">Submit</Button>
          </form>
        </Form>

        {submittedValues && (
          <section
            aria-live="polite"
            className="mt-6 rounded-xl bg-muted p-4 text-left"
          >
            <h2 className="text-sm font-medium">Submitted values</h2>
            <pre
              className="mt-2 overflow-x-auto text-sm"
              data-testid="submitted-values"
            >
              {JSON.stringify(submittedValues, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </main>
  )
}

export default App
