<a href="https://shadcn-fancy-switch.vercel.app" target="_blank">
  <img src="https://i.imghippo.com/files/AS1uu1720799823.png" alt="React Fancy Switch" />
</a>

Simple Fancy Switch Component without framer-motion.

## Installation

Copy the `src/components/fancy-switch` directory and paste into your project and customize to your needs. The code is yours.

## Usage

```tsx
import React, { useState } from 'react'
import { FancySwitch } from '@/components/fancy-switch'

const orderTypes: string[] = ['Delivery', 'Pickup', 'Shipping']
const pets: { text: string; id: number }[] = [
  { text: 'Car, (AKA Cat)', id: 1 },
  { text: 'Dog', id: 2 }
]

export const App = () => {
  const [orderType, setOrderType] = useState<string>()
  const [pet, setPet] = useState<string>()

  return (
    <FancySwitch
      value={orderType}
      onChange={(value) => setOrderType(value)}
      options={orderTypes}
      className="flex rounded-full bg-muted p-2"
      highlighterClassName="bg-primary rounded-full"
      radioClassName={cn(
        'relative mx-2 flex focus:outline-none h-9 cursor-pointer items-center justify-center rounded-full px-3.5 text-sm font-medium transition-colors data-[checked]:text-primary-foreground'
      )}
      highlighterIncludeMargin={true}
    />

    <FancySwitch
      value={pet}
      onChange={(value) => setPet(value)}
      options={pets}
      valueKey="id"
      labelKey="text"
      className="rounded-3xl bg-muted p-2"
      highlighterClassName="bg-primary rounded-full"
      radioClassName={cn(
        'relative mx-2 flex h-9 cursor-pointer items-center justify-center rounded-full px-3.5 text-sm font-medium transition-colors data-[checked]:text-primary-foreground'
      )}
    />
  )
}
```

## Props

```ts
interface FancySwitchProps {
  // optional
  value: string | number | undefined

  // optional
  onChange: value: string | number

  options: (string | number | object)[]

  // optional
  valueKey: string // default: 'value'
  labelKey: string // default: 'label'

  // optional
  radioClassName: string
  highlighterClassName: string
  highlighterIncludeMargin: boolean
}
```
