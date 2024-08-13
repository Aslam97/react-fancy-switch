import * as React from 'react'
import {
  FancySwitch as BaseFancySwitch,
  FancySwitchProps
} from '@omit/react-fancy-switch'
import { cn } from '@/lib/utils'

const FancySwitch = React.forwardRef<HTMLDivElement, FancySwitchProps>(
  ({ highlighterClassName, ...props }, ref) => {
    return (
      <BaseFancySwitch
        ref={ref}
        highlighterClassName={cn(
          'bg-primary rounded-full',
          highlighterClassName
        )}
        {...props}
      />
    )
  }
)

FancySwitch.displayName = 'FancySwitch'

export { FancySwitch }
