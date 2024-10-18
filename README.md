<a href='https://react-fancy-radio.vercel.app/' target='_blank'>
  <img src='https://i.postimg.cc/59Bc5bR5/Screenshot-2024-08-13-at-16-33-21.png' border='0' alt="React Fancy Switch" />
</a>

<p style={{ textAlign: 'center' }}>
<a href="https://github.com/umodoc/editor/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/%40omit%2Freact-fancy-switch" /></a>
<a href="https://www.npmjs.com/package/@omit/react-fancy-switch" target="_blank"><img src="https://img.shields.io/npm/v/%40omit%2Freact-fancy-switch" /></a>
<a href="https://www.npmjs.com/package/@omit/react-fancy-switch" target="_blank"><img src="https://img.shields.io/npm/dw/%40omit%2Freact-fancy-switch" /></a>
<a href="https://github.com/umodoc/editor/commits" target="_blank"><img src="https://img.shields.io/npm/unpacked-size/%40omit%2Freact-fancy-switch" /></a>
</p>

# React Fancy Switch

React Fancy Switch is a customizable React component that provides an elegant and interactive way to switch between multiple options. It's designed to be flexible, accessible, and easy to integrate into your React applications, all without requiring framer-motion.

## Features

- Supports both primitive (string/number) and object-based options
- Customizable styling for radio buttons and highlighter
- Keyboard navigation support
- Accessible design with proper ARIA attributes
- Smooth transition effects

## Installation

To use FancySwitch in your project, you can install it via npm:

```bash
npm install @omit/react-fancy-switch
```

## Usage

Here are examples of how to use the FancySwitch component with different types of option arrays:

### 1. Array of Primitives (Strings or Numbers)

```jsx
import React, { useState } from 'react'
import FancySwitch from '@omit/react-fancy-switch'

const StringExample = () => {
  const [selectedOption, setSelectedOption] = useState('apple')

  const options = ['apple', 'banana', 'cherry']

  return (
    <FancySwitch
      options={options}
      value={selectedOption}
      onChange={setSelectedOption}
      className="some-class"
      radioClassName="radio-button"
      highlighterClassName="highlighter"
    />
  )
}
```

### 2. Array of Objects (Default Keys)

```jsx
import React, { useState } from 'react'
import FancySwitch from '@omit/react-fancy-switch'

const DefaultObjectExample = () => {
  const [selectedOption, setSelectedOption] = useState('option1')

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]

  return (
    <FancySwitch
      options={options}
      value={selectedOption}
      onChange={setSelectedOption}
      radioClassName="radio-button"
      highlighterClassName="highlighter"
    />
  )
}
```

### 3. Array of Objects (Custom Keys)

```jsx
import React, { useState } from 'react'
import FancySwitch from '@omit/react-fancy-switch'

const CustomObjectExample = () => {
  const [selectedOption, setSelectedOption] = useState(1)

  const options = [
    { id: 1, name: 'First Choice' },
    { id: 2, name: 'Second Choice' },
    { id: 3, name: 'Third Choice' }
  ]

  return (
    <FancySwitch
      options={options}
      value={selectedOption}
      onChange={setSelectedOption}
      valueKey="id"
      labelKey="name"
      radioClassName="radio-button"
      highlighterClassName="highlighter"
    />
  )
}
```

## API

### Props

| Prop                       | Type                           | Default      | Description                                                      |
| -------------------------- | ------------------------------ | ------------ | ---------------------------------------------------------------- |
| `options`                  | `OptionType[]`                 | Required     | An array of options to display. Can be primitives or objects.    |
| `value`                    | `OptionValue`                  | -            | The currently selected value.                                    |
| `onChange`                 | `(value: OptionValue) => void` | -            | Callback function called when the selection changes.             |
| `valueKey`                 | `string`                       | `'value'`    | The key to use for the option's value when using object options. |
| `labelKey`                 | `string`                       | `'label'`    | The key to use for the option's label when using object options. |
| `disabledKey`              | `string`                       | `'disabled'` | The key to use for the option's disabled state (object options). |
| `radioClassName`           | `string`                       | -            | CSS class name for the radio button elements.                    |
| `highlighterClassName`     | `string`                       | -            | CSS class name for the highlighter element.                      |
| `highlighterIncludeMargin` | `boolean`                      | `false`      | Whether to include margins in highlighter size calculations.     |
| `highlighterStyle`         | `React.CSSProperties`          | -            | Custom styles for the highlighter element.                       |
| `disabledOptions`          | `OptionValue[]`                | `[]`         | An array of values for options that should be disabled.          |

Additional HTML attributes for the container div can be passed as props and will be spread onto the root element.

### Types

```typescript
type OptionValue = string | number | boolean
interface OptionObject {
  [key: string]: OptionValue
}
type OptionType = OptionValue | OptionObject
```

## Styling

The FancySwitch component provides several ways to customize its appearance:

1. Use the `className` prop to style the container div.
2. Use the `radioClassName` prop to style individual radio buttons.
3. Use the `highlighterClassName` prop to style the highlighter element.
4. Use the `highlighterStyle` prop to apply custom inline styles to the highlighter.

Example:

```jsx
<FancySwitch
  className="flex rounded-full bg-muted p-2"
  highlighterClassName="bg-primary rounded-full"
  radioClassName="relative mx-2 flex h-9 cursor-pointer items-center justify-center rounded-full px-3.5 text-sm font-medium transition-colors focus:outline-none data-[checked]:text-primary-foreground"
  highlighterIncludeMargin={true}
  highlighterStyle={{ backgroundColor: 'blue', borderRadius: '8px' }}
/>
```

## Accessibility

FancySwitch is built with accessibility in mind:

- It uses proper ARIA attributes for screen readers.
- Keyboard navigation is supported (arrow keys to move between options).
- Focus management is handled automatically.
- There's a visually hidden live region that announces the selected option.

## Advanced Usage

### Disabling Options

You can disable specific options using the `disabledOptions` prop:

```jsx
<FancySwitch
  options={options}
  value={selectedOption}
  onChange={setSelectedOption}
  disabledOptions={['option2']}
/>
```

## TypeScript Support

FancySwitch is written in TypeScript and provides type definitions. The component is generic, allowing you to specify the type of your options:

```typescript
import FancySwitch from '@omit/react-fancy-switch'

type MyOptionType = {
  id: number
  name: string
  isDisabled: boolean
}

const options: MyOptionType[] = [
  { id: 1, name: 'Option 1', isDisabled: false },
  { id: 2, name: 'Option 2', isDisabled: true },
  { id: 3, name: 'Option 3', isDisabled: false }
]

;<FancySwitch<MyOptionType>
  options={options}
  valueKey="id"
  labelKey="name"
  disabledKey="isDisabled"
  value={selectedOption}
  onChange={setSelectedOption}
/>
```

This ensures type safety when working with custom option types.

## Other Projects

- [Minimal Tiptap Editor](https://github.com/Aslam97/shadcn-minimal-tiptap)
- [React Confirm Dialog](https://github.com/Aslam97/react-confirm-dialog)

## License

This project is open source and available under the [MIT License](LICENSE).
