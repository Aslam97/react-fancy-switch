## React Fancy Switch

<a href='https://react-fancy-radio.vercel.app/' target='_blank'>
  <img src='https://i.postimg.cc/LJKS06Pr/Screenshot-2024-08-13-at-16-18-48.png' border='0' alt="React Fancy Switch" />
</a>

Simple Fancy Switch Component without framer-motion.

### Installation

To install the package using npm, run the following command:

```bash
npm install @omit/react-fancy-switch
```

### shadcn/ui

If you use shadcn/ui, There an example of how to use the
`FancySwitch` component. The component is located at `website/src/components/custom/fancy-switch.tsx.tsx`.

## Usage

### Basic Usage

```tsx
import React, { useState } from 'react'
import { FancySwitch } from '@/components/fancy-switch'

const orderTypes: string[] = ['Delivery', 'Pickup', 'Shipping']

export const App = () => {
  const [orderType, setOrderType] = useState<string>()

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
  )
}
```

### react-hook-form

If you are using `react-hook-form` you can see the example in the `website/src/App.tsx` file.

## Props

```ts
interface FancySwitchProps {
  // optional
  value: string | number | undefined

  // optional
  onChange: (value: string | number) => void

  options: (string | number | object)[]

  // optional
  valueKey?: string // default: 'value'
  labelKey?: string // default: 'label'

  // optional
  radioClassName?: string
  highlighterClassName?: string
  highlighterIncludeMargin?: boolean
}
```

## License

This project is open source and available under the [MIT License](LICENSE).
