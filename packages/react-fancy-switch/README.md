# @omit/react-fancy-switch

<p>
  <a href="https://github.com/Aslam97/react-fancy-switch/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/%40omit%2Freact-fancy-switch" alt="License" /></a>
  <a href="https://www.npmjs.com/package/@omit/react-fancy-switch"><img src="https://img.shields.io/npm/v/%40omit%2Freact-fancy-switch" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@omit/react-fancy-switch"><img src="https://img.shields.io/npm/dw/%40omit%2Freact-fancy-switch" alt="npm downloads" /></a>
</p>

React Fancy Switch is a customizable React component that provides an elegant and interactive way to switch between multiple options. It behaves like a radio group, animates a highlighter between the options, and is designed to be flexible, accessible and easy to integrate into your React applications, all without requiring framer-motion.

## Features

- Supports both primitive (string/number/boolean) and object-based options
- Controlled (`value` + `onChange`) or uncontrolled usage
- Customizable styling for the container, the options and the highlighter
- Smooth transition effects
- Custom option rendering support
- Accessible: `radiogroup`/`radio` roles, roving tabindex, keyboard navigation and a live region
- No runtime dependencies besides React 18 or 19

## Installation

```bash
npm install @omit/react-fancy-switch
```

## Usage

### 1. Array of primitives (strings, numbers, or booleans)

```jsx
import React, { useState } from 'react'
import { FancySwitch } from '@omit/react-fancy-switch'

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

### 2. Array of objects (default keys)

```jsx
import React, { useState } from 'react'
import { FancySwitch } from '@omit/react-fancy-switch'

const DefaultObjectExample = () => {
  const [selectedOption, setSelectedOption] = useState('option1')

  const options = [
    { value: 'option1', label: 'Option 1', disabled: false },
    { value: 'option2', label: 'Option 2', disabled: true },
    { value: 'option3', label: 'Option 3', disabled: false }
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

### 3. Array of objects (custom keys)

```jsx
import React, { useState } from 'react'
import { FancySwitch } from '@omit/react-fancy-switch'

const CustomObjectExample = () => {
  const [selectedOption, setSelectedOption] = useState(1)

  const options = [
    { id: 1, name: 'First Choice', isDisabled: false },
    { id: 2, name: 'Second Choice', isDisabled: true },
    { id: 3, name: 'Third Choice', isDisabled: false }
  ]

  return (
    <FancySwitch
      options={options}
      value={selectedOption}
      onChange={setSelectedOption}
      valueKey="id"
      labelKey="name"
      disabledKey="isDisabled"
      radioClassName="radio-button"
      highlighterClassName="highlighter"
    />
  )
}
```

### 4. Custom option rendering

```jsx
import React, { useState } from 'react'
import { FancySwitch } from '@omit/react-fancy-switch'

const CustomRenderExample = () => {
  const [selectedOption, setSelectedOption] = useState('option1')

  const options = [
    { value: 'option1', label: 'Option 1', icon: '🎉' },
    { value: 'option2', label: 'Option 2', icon: '⭐' },
    { value: 'option3', label: 'Option 3', icon: '🎨' }
  ]

  return (
    <FancySwitch
      options={options}
      value={selectedOption}
      onChange={setSelectedOption}
      renderOption={({ option, isSelected, getOptionProps }) => (
        <div {...getOptionProps()} className="flex items-center gap-2">
          <span>{option.icon}</span>
          <span>{option.label}</span>
        </div>
      )}
    />
  )
}
```

`getOptionProps()` returns the props that make the element behave as an option (`ref`, `role="radio"`, `aria-checked`, `aria-label`, `tabIndex`, `onClick`, `className` and the `data-checked` / `data-disabled` / `aria-disabled` attributes). Spread them onto the root element of your option; anything you add afterwards (such as `className`) overrides them.

The component is also available as the default export.

## API

### Props

| Prop                       | Type                                            | Default                  | Description                                                                                                       |
| -------------------------- | ----------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `options`                  | `OptionType[]`                                  | Required                 | An array of options to display. Can be primitives or objects.                                                     |
| `value`                    | `OptionValue`                                   | -                        | The currently selected value. When omitted the component manages the selection itself (first option selected).    |
| `onChange`                 | `(value: OptionValue) => void`                  | -                        | Callback called when the user selects an option.                                                                  |
| `valueKey`                 | `string`                                        | `'value'`                | The key to use for the option's value when using object options.                                                  |
| `labelKey`                 | `string`                                        | `'label'`                | The key to use for the option's label when using object options. Falls back to the value when the key is missing. |
| `disabledKey`              | `string`                                        | `'disabled'`             | The key to use for the option's disabled state (object options).                                                  |
| `radioClassName`           | `string`                                        | -                        | CSS class name for the option elements.                                                                           |
| `highlighterClassName`     | `string`                                        | -                        | CSS class name for the highlighter element.                                                                       |
| `highlighterIncludeMargin` | `boolean`                                       | `false`                  | Whether the highlighter covers the option's margin box instead of its border box.                                 |
| `highlighterStyle`         | `React.CSSProperties`                           | -                        | Custom inline styles for the highlighter element.                                                                 |
| `disabledOptions`          | `OptionValue[]`                                 | `[]`                     | Values of options that should be disabled.                                                                        |
| `renderOption`             | `(props: RenderOptionProps) => React.ReactNode` | -                        | Custom render function for options.                                                                               |
| `aria-label`               | `string`                                        | `'Fancy switch options'` | Accessible name of the group. Not applied when `aria-labelledby` is passed.                                       |

Additional HTML attributes for the container `div` (`className`, `style`, `id`, `onKeyDown`, `aria-*`, `data-*`, ...) are spread onto the root element. `onKeyDown` runs before the built-in keyboard handling and can cancel it with `event.preventDefault()`.

### Types

```ts
import type {
  FancySwitchProps,
  OptionObject,
  OptionProps,
  OptionType,
  OptionValue,
  RenderOptionProps,
  ResolvedOption
} from '@omit/react-fancy-switch'
```

## Styling

The FancySwitch component provides several ways to customize its appearance:

1. Use the `className` prop to style the container `div`
2. Use the `radioClassName` prop to style individual options
3. Use the `highlighterClassName` prop to style the highlighter element
4. Use the `highlighterStyle` prop to apply custom inline styles to the highlighter
5. Use the `renderOption` prop for complete control over option rendering

The root element is `position: relative` (pass a `style` prop to change it) and the highlighter is an absolutely positioned child that is moved with a CSS transform. Give the options `position: relative` (or any other positioning) so their content is painted above the highlighter. The selected option gets a `data-checked` attribute and disabled options get `data-disabled`, which is handy for Tailwind CSS variants.

Example:

```jsx
<FancySwitch
  className="flex rounded-full bg-muted p-2"
  highlighterClassName="bg-primary rounded-full"
  radioClassName="relative mx-2 flex h-9 cursor-pointer items-center justify-center rounded-full px-3.5 text-sm font-medium transition-colors focus:outline-hidden data-checked:text-primary-foreground data-disabled:opacity-50"
  highlighterIncludeMargin
  highlighterStyle={{ backgroundColor: 'blue', borderRadius: '8px' }}
/>
```

## Accessibility

FancySwitch is built with accessibility in mind:

- Uses semantic roles (`radiogroup` / `radio`) with proper ARIA attributes
- Roving tabindex: only the selected option (or the first enabled one when the selected option is disabled) is in the tab order
- Keyboard navigation: `ArrowRight` / `ArrowDown` and `ArrowLeft` / `ArrowUp` move the selection (skipping disabled options and wrapping around), `Home` / `End` jump to the first / last enabled option and `Space` selects the focused option
- Manages focus automatically
- Includes a live region for screen reader announcements
- Properly handles disabled states (`aria-disabled`)
- Supports custom `aria-label` / `aria-labelledby` for the group

## License

[MIT](https://github.com/Aslam97/react-fancy-switch/blob/main/LICENSE)
