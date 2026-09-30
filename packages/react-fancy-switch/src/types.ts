import type * as React from 'react'

export type OptionValue = string | number | boolean

export interface OptionObject {
  [key: string]: OptionValue | undefined
}

export type OptionType = OptionValue | OptionObject

/** The value type produced by an option of type `T`. */
export type OptionValueOf<T extends OptionType> = T extends OptionObject
  ? T[keyof T]
  : T

/** An option after its label, value and disabled state have been resolved. */
export type ResolvedOption<T extends OptionType> = T extends OptionObject
  ? T & { label: string; value: OptionValue; disabled: boolean }
  : { label: string; value: T; disabled: boolean }

/** Props returned by `getOptionProps()` that must be spread onto the option element. */
export interface OptionProps {
  ref: React.RefCallback<HTMLDivElement>
  role: 'radio'
  'aria-checked': boolean
  'aria-disabled'?: true
  'aria-label': string
  tabIndex: number
  onClick: () => void
  className: string | undefined
  'data-checked'?: true
  'data-disabled'?: true
}

export interface RenderOptionProps<T extends OptionType> {
  option: ResolvedOption<T>
  isSelected: boolean
  getOptionProps: () => OptionProps
}

export interface FancySwitchProps<T extends OptionType> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  value?: OptionValueOf<T>
  onChange?: (value: OptionValueOf<T>) => void
  options: T[]
  valueKey?: keyof T & string
  labelKey?: keyof T & string
  disabledKey?: keyof T & string
  radioClassName?: string
  highlighterClassName?: string
  highlighterIncludeMargin?: boolean
  highlighterStyle?: React.CSSProperties
  disabledOptions?: Array<OptionValueOf<T>>
  renderOption?: (props: RenderOptionProps<T>) => React.ReactNode
}
