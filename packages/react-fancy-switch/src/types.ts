import * as React from 'react'

export type OptionValue = string | number | boolean

export interface OptionObject {
  [key: string]: OptionValue | undefined
}

export type OptionType = OptionValue | OptionObject

export interface FancySwitchProps<T extends OptionType>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: T extends OptionObject ? T[keyof T] : T
  onChange?: (value: T extends OptionObject ? T[keyof T] : T) => void
  options: T[]
  valueKey?: keyof T & string
  labelKey?: keyof T & string
  disabledKey?: keyof T & string
  radioClassName?: string
  highlighterClassName?: string
  highlighterIncludeMargin?: boolean
  highlighterStyle?: React.CSSProperties
  disabledOptions?: Array<T extends OptionObject ? T[keyof T] : T>
  renderOption?: (props: {
    option: T extends OptionObject
      ? T & { label: string; value: OptionValue; disabled: boolean }
      : { label: string; value: T; disabled: boolean }
    isSelected: boolean
    getOptionProps: () => Record<string, any>
  }) => React.ReactNode
}
