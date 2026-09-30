import * as React from 'react'
import type {
  FancySwitchProps,
  OptionObject,
  OptionProps,
  OptionType,
  OptionValue,
  OptionValueOf,
  ResolvedOption
} from '../types'

const EMPTY_DISABLED_OPTIONS: never[] = []

const DEFAULT_GROUP_LABEL = 'Fancy switch options'

// Layout measurements must run before paint so the highlighter never
// animates from its initial (empty) size. `useLayoutEffect` is a no-op on
// the server, so fall back to `useEffect` there.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

interface HighlighterStyle {
  height: number
  width: number
  transform: string
}

const INITIAL_HIGHLIGHTER_STYLE: HighlighterStyle = {
  height: 0,
  width: 0,
  transform: 'translate(0px, 0px)'
}

function parsePx(value: string): number {
  const parsed = parseFloat(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

/**
 * Returns the index of the first enabled option reached by stepping
 * `direction` from `fromIndex` (wrapping around), or -1 when no enabled
 * option exists.
 */
function findEnabledIndex(
  options: ReadonlyArray<{ disabled: boolean }>,
  fromIndex: number,
  direction: 1 | -1
): number {
  const count = options.length
  for (let step = 1; step <= count; step++) {
    const index = (fromIndex + direction * step + count * step) % count
    if (!options[index].disabled) return index
  }
  return -1
}

export function FancySwitch<T extends OptionType>({
  options,
  valueKey = 'value' as keyof T & string,
  labelKey = 'label' as keyof T & string,
  disabledKey = 'disabled' as keyof T & string,
  value,
  onChange,
  radioClassName,
  highlighterClassName,
  highlighterIncludeMargin = false,
  highlighterStyle: customHighlighterStyle,
  disabledOptions = EMPTY_DISABLED_OPTIONS,
  renderOption,
  onKeyDown,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: FancySwitchProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const highlighterRef = React.useRef<HTMLDivElement>(null)
  const radioRefs = React.useRef<(HTMLDivElement | null)[]>([])

  const getOptionValue = React.useCallback(
    (option: T): OptionValue | undefined => {
      if (typeof option !== 'object') {
        return option
      }
      return (option as OptionObject)[valueKey]
    },
    [valueKey]
  )

  const getOptionLabel = React.useCallback(
    (option: T): string => {
      if (typeof option !== 'object') {
        return String(option)
      }
      return String(
        (option as OptionObject)[labelKey] ?? getOptionValue(option) ?? ''
      )
    },
    [labelKey, getOptionValue]
  )

  const isOptionDisabled = React.useCallback(
    (option: T): boolean => {
      const optionValue = getOptionValue(option)
      if (
        optionValue !== undefined &&
        (disabledOptions as ReadonlyArray<OptionValue | undefined>).includes(
          optionValue
        )
      ) {
        return true
      }
      if (typeof option === 'object' && disabledKey in option) {
        return Boolean((option as OptionObject)[disabledKey])
      }
      return false
    },
    [disabledOptions, getOptionValue, disabledKey]
  )

  const resolvedOptions = React.useMemo(
    () =>
      options.map((option) => ({
        ...(typeof option === 'object' ? option : {}),
        label: getOptionLabel(option),
        value: getOptionValue(option),
        disabled: isOptionDisabled(option)
      })) as Array<ResolvedOption<T>>,
    [options, getOptionValue, getOptionLabel, isOptionDisabled]
  )

  const isControlled = value !== undefined

  // Index of the option matching the controlled `value`, or -1.
  const controlledIndex = React.useMemo(
    () =>
      isControlled
        ? resolvedOptions.findIndex((option) => option.value === value)
        : -1,
    [isControlled, resolvedOptions, value]
  )

  const [internalIndex, setInternalIndex] = React.useState(() =>
    controlledIndex === -1 ? 0 : controlledIndex
  )

  React.useEffect(() => {
    if (isControlled && controlledIndex === -1) {
      console.warn(
        `FancySwitch: No option found for value "${String(value)}". Defaulting to first option.`
      )
    }
  }, [isControlled, controlledIndex, value])

  // Unknown controlled values and internal indexes that no longer exist
  // (options were removed) both fall back to the first option.
  const optionCount = resolvedOptions.length
  const activeIndex =
    optionCount === 0
      ? -1
      : isControlled
        ? Math.max(controlledIndex, 0)
        : internalIndex < optionCount
          ? internalIndex
          : 0

  // Roving tabindex: exactly one option is reachable with Tab. That is the
  // selected option, unless it is disabled, in which case the first enabled
  // option becomes the tab stop (matching native radio groups).
  const tabStopIndex =
    activeIndex !== -1 && !resolvedOptions[activeIndex].disabled
      ? activeIndex
      : resolvedOptions.findIndex((option) => !option.disabled)

  const [highlighterStyle, setHighlighterStyle] =
    React.useState<HighlighterStyle>(INITIAL_HIGHLIGHTER_STYLE)

  const updateHighlighter = React.useCallback(() => {
    const container = containerRef.current
    const selectedElement =
      activeIndex === -1 ? null : radioRefs.current[activeIndex]

    if (!container || !selectedElement) {
      setHighlighterStyle(INITIAL_HIGHLIGHTER_STYLE)
      return
    }

    const containerRect = container.getBoundingClientRect()
    const selectedRect = selectedElement.getBoundingClientRect()
    const containerStyle = window.getComputedStyle(container)
    const selectedStyle = window.getComputedStyle(selectedElement)

    // The highlighter is absolutely positioned at the top-left corner of the
    // container's padding box, so only the container border has to be
    // subtracted from the viewport-relative coordinates.
    const containerBorder = {
      left: parsePx(containerStyle.borderLeftWidth),
      top: parsePx(containerStyle.borderTopWidth)
    }
    const margin = highlighterIncludeMargin
      ? {
          left: parsePx(selectedStyle.marginLeft),
          right: parsePx(selectedStyle.marginRight),
          top: parsePx(selectedStyle.marginTop),
          bottom: parsePx(selectedStyle.marginBottom)
        }
      : { left: 0, right: 0, top: 0, bottom: 0 }

    const translateX =
      selectedRect.left -
      containerRect.left -
      containerBorder.left -
      margin.left
    const translateY =
      selectedRect.top - containerRect.top - containerBorder.top - margin.top

    setHighlighterStyle({
      height: selectedRect.height + margin.top + margin.bottom,
      width: selectedRect.width + margin.left + margin.right,
      transform: `translate(${translateX}px, ${translateY}px)`
    })
  }, [activeIndex, highlighterIncludeMargin])

  // Re-measure whenever the selection or the options change.
  useIsomorphicLayoutEffect(() => {
    updateHighlighter()
  }, [updateHighlighter, resolvedOptions])

  // Re-measure whenever the container or any option changes size (fonts
  // loading, responsive layouts, label changes, ...).
  React.useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return

    const resizeObserver = new ResizeObserver(updateHighlighter)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    for (const element of radioRefs.current) {
      if (element) resizeObserver.observe(element)
    }
    return () => resizeObserver.disconnect()
  }, [updateHighlighter, resolvedOptions])

  const handleChange = React.useCallback(
    (index: number) => {
      const option = resolvedOptions[index]
      if (!option || option.disabled) return

      radioRefs.current[index]?.focus()
      setInternalIndex(index)
      onChange?.(option.value as OptionValueOf<T>)
    },
    [resolvedOptions, onChange]
  )

  const getNextIndex = (
    key: string,
    currentIndex: number
  ): number | undefined => {
    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        return findEnabledIndex(resolvedOptions, currentIndex, 1)
      case 'ArrowUp':
      case 'ArrowLeft':
        return findEnabledIndex(resolvedOptions, currentIndex, -1)
      case 'Home':
        return findEnabledIndex(resolvedOptions, -1, 1)
      case 'End':
        return findEnabledIndex(resolvedOptions, optionCount, -1)
      case ' ':
        return currentIndex
      default:
        return undefined
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || optionCount === 0) return

    // Navigate relative to the focused option (which may differ from the
    // selected one when the selected option is disabled).
    const target = event.target instanceof Node ? event.target : null
    const focusedIndex = radioRefs.current.findIndex(
      (element) => element != null && element.contains(target)
    )
    const currentIndex = focusedIndex === -1 ? activeIndex : focusedIndex

    const nextIndex = getNextIndex(event.key, currentIndex)
    if (nextIndex === undefined) return

    event.preventDefault()
    if (nextIndex !== -1) {
      handleChange(nextIndex)
    }
  }

  const getOptionProps = (
    option: ResolvedOption<T>,
    index: number,
    isSelected: boolean
  ): OptionProps => ({
    ref: (element) => {
      radioRefs.current[index] = element
    },
    role: 'radio',
    'aria-checked': isSelected,
    tabIndex: index === tabStopIndex ? 0 : -1,
    onClick: () => handleChange(index),
    className: radioClassName,
    ...(isSelected ? { 'data-checked': true as const } : {}),
    ...(option.disabled
      ? { 'aria-disabled': true as const, 'data-disabled': true as const }
      : {}),
    'aria-label': `${option.label} option`
  })

  const renderOptionContent = (option: ResolvedOption<T>, index: number) => {
    const isSelected = index === activeIndex

    if (renderOption) {
      return renderOption({
        option,
        isSelected,
        getOptionProps: () => getOptionProps(option, index, isSelected)
      })
    }

    return (
      <div {...getOptionProps(option, index, isSelected)}>{option.label}</div>
    )
  }

  return (
    <div
      role="radiogroup"
      aria-label={
        ariaLabel ?? (ariaLabelledBy ? undefined : DEFAULT_GROUP_LABEL)
      }
      aria-labelledby={ariaLabelledBy}
      {...props}
      ref={containerRef}
      style={{ position: 'relative', ...style }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={highlighterRef}
        className={highlighterClassName}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transitionProperty: 'all',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '300ms',
          ...highlighterStyle,
          ...customHighlighterStyle
        }}
        aria-hidden="true"
        data-highlighter
      />

      {resolvedOptions.map((option, index) => (
        <React.Fragment key={index}>
          {renderOptionContent(option, index)}
        </React.Fragment>
      ))}

      <div
        aria-live="polite"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0
        }}
      >
        {activeIndex === -1
          ? null
          : `${resolvedOptions[activeIndex].label} selected`}
      </div>
    </div>
  )
}

FancySwitch.displayName = 'FancySwitch'

export default FancySwitch
