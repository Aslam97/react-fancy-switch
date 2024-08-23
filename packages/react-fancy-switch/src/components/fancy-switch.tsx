import * as React from 'react'
import { FancySwitchProps, OptionObject, OptionType } from '../types'

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
      ...props
    },
    ref
  ) => {
    const getOptionValue = React.useCallback(
      (option: OptionType) =>
        typeof option === 'string'
          ? option
          : (option as OptionObject)[valueKey],
      [valueKey]
    )

    const getOptionLabel = React.useCallback(
      (option: OptionType) =>
        typeof option === 'string'
          ? option
          : (option as OptionObject)[labelKey],
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

    const [activeIndex, setActiveIndex] = React.useState(() =>
      memoizedOptions.findIndex((option) => option.value === value)
    )

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

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            event.preventDefault()
            handleChange(getNextOption(index))
            break
          case 'ArrowUp':
          case 'ArrowLeft':
            event.preventDefault()
            handleChange(getPreviousOption(index))
            break
          default:
            break
        }
      },
      [handleChange, getNextOption, getPreviousOption]
    )

    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    React.useEffect(() => {
      updateToggle()
    }, [updateToggle])

    return (
      <div
        role="radiogroup"
        aria-labelledby="fancy-switch-label"
        {...props}
        ref={containerRef}
      >
        <div
          className={highlighterClassName}
          style={{
            position: 'absolute',
            transitionProperty: 'all',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '300ms',
            ...highlighterStyle
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
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={radioClassName}
            {...(index === activeIndex ? { 'data-checked': true } : {})}
          >
            {option.label}
          </div>
        ))}
      </div>
    )
  }
)

FancySwitch.displayName = 'FancySwitch'

export default FancySwitch
