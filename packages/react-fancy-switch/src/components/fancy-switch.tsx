import * as React from 'react'
import {
  FancySwitchProps,
  OptionObject,
  OptionType,
  OptionValue
} from '../types'

export const FancySwitch = React.forwardRef<HTMLDivElement, FancySwitchProps>(
  (
    {
      options,
      valueKey = 'value',
      labelKey = 'label',
      value,
      onChange,
      radioClassName,
      highlighterClassName,
      highlighterIncludeMargin = false,
      highlighterStyle: customHighlighterStyle,
      ...props
    },
    ref
  ) => {
    const getOptionValue = React.useCallback(
      (option: OptionType): OptionValue => {
        if (typeof option === 'string' || typeof option === 'number') {
          return option
        }
        return (option as OptionObject)[valueKey] as OptionValue
      },
      [valueKey]
    )

    const getOptionLabel = React.useCallback(
      (option: OptionType): string => {
        if (typeof option === 'string' || typeof option === 'number') {
          return String(option)
        }
        return String((option as OptionObject)[labelKey])
      },
      [labelKey]
    )

    const memoizedOptions = React.useMemo(
      () =>
        options.map((option) => ({
          label: getOptionLabel(option),
          value: getOptionValue(option)
        })),
      [options, getOptionValue, getOptionLabel]
    )

    const [activeIndex, setActiveIndex] = React.useState(() => {
      const index = memoizedOptions.findIndex(
        (option) => option.value === value
      )
      if (index === -1) {
        console.warn(
          `FancySwitch: No option found for value "${value}". Defaulting to first option.`
        )
        return 0
      }
      return index
    })

    React.useEffect(() => {
      const newIndex = memoizedOptions.findIndex(
        (option) => option.value === value
      )
      if (newIndex !== -1 && newIndex !== activeIndex) {
        setActiveIndex(newIndex)
      }
    }, [value, memoizedOptions, activeIndex])

    const [highlighterStyle, setHighlighterStyle] = React.useState({
      height: 0,
      width: 0,
      transform: 'translate(0, 0)'
    })

    const containerRef = React.useRef<HTMLDivElement>(null)
    const radioRefs = React.useRef<(HTMLDivElement | null)[]>([])

    const updateToggle = React.useCallback(() => {
      const selectedElement = radioRefs.current[activeIndex]
      const container = containerRef.current

      if (selectedElement && container) {
        const containerRect = container.getBoundingClientRect()
        const selectedRect = selectedElement.getBoundingClientRect()

        const containerStyle = window.getComputedStyle(container)
        const selectedStyle = window.getComputedStyle(selectedElement)

        const containerPadding = {
          left: parseFloat(containerStyle.paddingLeft),
          top: parseFloat(containerStyle.paddingTop)
        }
        const containerBorder = {
          left: parseFloat(containerStyle.borderLeftWidth),
          top: parseFloat(containerStyle.borderTopWidth)
        }
        const selectedMargin = {
          left: parseFloat(selectedStyle.marginLeft),
          right: parseFloat(selectedStyle.marginRight),
          top: parseFloat(selectedStyle.marginTop),
          bottom: parseFloat(selectedStyle.marginBottom)
        }

        const translateX =
          selectedRect.left -
          containerRect.left -
          containerPadding.left -
          containerBorder.left -
          (highlighterIncludeMargin ? selectedMargin.left : 0)

        const translateY =
          selectedRect.top -
          containerRect.top -
          containerPadding.top -
          containerBorder.top -
          selectedMargin.top

        setHighlighterStyle({
          height: selectedRect.height,
          width:
            selectedRect.width +
            (highlighterIncludeMargin
              ? selectedMargin.left + selectedMargin.right
              : 0),
          transform: `translate(${translateX}px, ${translateY}px)`
        })
      }
    }, [activeIndex, highlighterIncludeMargin])

    const getNextOption = React.useCallback(
      (currentIndex: number) => {
        return (currentIndex + 1) % options.length
      },
      [options.length]
    )

    const getPreviousOption = React.useCallback(
      (currentIndex: number) => {
        return (currentIndex - 1 + options.length) % options.length
      },
      [options.length]
    )

    const handleChange = React.useCallback(
      (index: number) => {
        radioRefs.current[index]?.focus()
        setActiveIndex(index)
        onChange?.(memoizedOptions[index].value)
      },
      [memoizedOptions, onChange]
    )

    const goToNext = React.useCallback(() => {
      const nextIndex = getNextOption(activeIndex)
      handleChange(nextIndex)
    }, [activeIndex, getNextOption, handleChange])

    const goToPrevious = React.useCallback(() => {
      const prevIndex = getPreviousOption(activeIndex)
      handleChange(prevIndex)
    }, [activeIndex, getPreviousOption, handleChange])

    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
      []
    )

    React.useEffect(() => {
      updateToggle()
    }, [updateToggle])

    return (
      <div
        role="radiogroup"
        aria-label="Fancy switch options"
        {...props}
        ref={containerRef}
        onKeyDown={(e) => {
          props.onKeyDown?.(e)

          const currentIndex = radioRefs.current.findIndex(
            (ref) => ref === document.activeElement
          )
          if (currentIndex === -1) return

          if (!e.defaultPrevented) {
            switch (e.key) {
              case 'ArrowDown':
              case 'ArrowRight':
                e.preventDefault()
                goToNext()
                break
              case 'ArrowUp':
              case 'ArrowLeft':
                e.preventDefault()
                goToPrevious()
                break
              default:
                break
            }
          }
        }}
      >
        <div
          className={highlighterClassName}
          style={{
            position: 'absolute',
            transitionProperty: 'all',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '300ms',
            ...highlighterStyle,
            ...customHighlighterStyle
          }}
          aria-hidden="true"
          data-highlighter
        />

        {memoizedOptions.map((option, index) => (
          <div
            key={index}
            ref={(el) => (radioRefs.current[index] = el)}
            role="radio"
            aria-checked={index === activeIndex}
            tabIndex={index === activeIndex ? 0 : -1}
            onClick={() => handleChange(index)}
            className={radioClassName}
            {...(index === activeIndex ? { 'data-checked': true } : {})}
            aria-label={`${option.label} option`}
          >
            {option.label}
          </div>
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
          {memoizedOptions[activeIndex]?.label} selected
        </div>
      </div>
    )
  }
)

FancySwitch.displayName = 'FancySwitch'

export default FancySwitch
