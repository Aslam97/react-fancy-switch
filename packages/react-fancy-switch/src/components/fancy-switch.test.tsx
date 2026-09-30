import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { MockResizeObserver } from '../test/resize-observer'
import type { OptionProps, RenderOptionProps } from '../types'
import { FancySwitch } from './fancy-switch'

const fruits = ['apple', 'banana', 'cherry']

function getRadios() {
  return screen.getAllByRole('radio')
}

function getCheckedRadio() {
  return screen.getByRole('radio', { checked: true })
}

function getHighlighter(group: HTMLElement) {
  const highlighter = group.querySelector<HTMLElement>('[data-highlighter]')
  if (!highlighter) throw new Error('highlighter not rendered')
  return highlighter
}

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

function mockRect(element: Element, rect: Rect) {
  vi.spyOn(element, 'getBoundingClientRect').mockImplementation(
    () =>
      ({
        ...rect,
        x: rect.left,
        y: rect.top,
        right: rect.left + rect.width,
        bottom: rect.top + rect.height,
        toJSON: () => rect
      }) as DOMRect
  )
}

function ControlledFruits({
  onChange,
  initialValue = 'apple'
}: {
  onChange?: (value: string) => void
  initialValue?: string
}) {
  const [value, setValue] = React.useState(initialValue)
  return (
    <FancySwitch
      options={fruits}
      value={value}
      onChange={(next) => {
        onChange?.(next)
        setValue(next)
      }}
    />
  )
}

describe('rendering', () => {
  it('renders a radio group with one radio per primitive option', () => {
    render(<FancySwitch options={fruits} />)

    const group = screen.getByRole('radiogroup', {
      name: 'Fancy switch options'
    })
    expect(group).toBeInTheDocument()

    const radios = getRadios()
    expect(radios).toHaveLength(3)
    expect(radios.map((radio) => radio.textContent)).toEqual(fruits)
    expect(radios.map((radio) => radio.getAttribute('aria-label'))).toEqual([
      'apple option',
      'banana option',
      'cherry option'
    ])
  })

  it('selects the first option by default and uses a roving tabindex', () => {
    render(<FancySwitch options={fruits} />)

    const [apple, banana, cherry] = getRadios()
    expect(apple).toBeChecked()
    expect(apple).toHaveAttribute('data-checked', 'true')
    expect(apple).toHaveAttribute('tabindex', '0')
    expect(banana).not.toBeChecked()
    expect(banana).not.toHaveAttribute('data-checked')
    expect(banana).toHaveAttribute('tabindex', '-1')
    expect(cherry).toHaveAttribute('tabindex', '-1')
  })

  it('supports number and boolean options', () => {
    const onChange = vi.fn()
    render(<FancySwitch options={[1, 2, true]} value={2} onChange={onChange} />)

    expect(getCheckedRadio()).toHaveTextContent('2')
    fireEvent.click(screen.getByRole('radio', { name: 'true option' }))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('reads label, value and disabled state from object options using the default keys', () => {
    render(
      <FancySwitch
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published', disabled: true }
        ]}
        value="published"
      />
    )

    const draft = screen.getByRole('radio', { name: 'Draft option' })
    const published = screen.getByRole('radio', { name: 'Published option' })
    expect(published).toBeChecked()
    expect(published).toHaveAttribute('aria-disabled', 'true')
    expect(published).toHaveAttribute('data-disabled', 'true')
    expect(draft).not.toHaveAttribute('aria-disabled')
    expect(draft).not.toHaveAttribute('data-disabled')
  })

  it('supports custom value, label and disabled keys', () => {
    const onChange = vi.fn()
    render(
      <FancySwitch
        options={[
          { id: 1, name: 'First', isDisabled: false },
          { id: 2, name: 'Second', isDisabled: true },
          { id: 3, name: 'Third', isDisabled: false }
        ]}
        valueKey="id"
        labelKey="name"
        disabledKey="isDisabled"
        value={3}
        onChange={onChange}
      />
    )

    expect(getCheckedRadio()).toHaveTextContent('Third')
    expect(
      screen.getByRole('radio', { name: 'Second option' })
    ).toHaveAttribute('aria-disabled', 'true')

    fireEvent.click(screen.getByRole('radio', { name: 'First option' }))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('falls back to the value when an object option has no label', () => {
    render(<FancySwitch options={[{ id: 1 }, { id: 2 }]} valueKey="id" />)

    expect(getRadios().map((radio) => radio.textContent)).toEqual(['1', '2'])
  })

  it('applies radioClassName, highlighterClassName and highlighterStyle', () => {
    render(
      <FancySwitch
        options={fruits}
        radioClassName="radio"
        highlighterClassName="highlighter"
        highlighterStyle={{ backgroundColor: 'rgb(255, 0, 0)' }}
      />
    )

    for (const radio of getRadios()) {
      expect(radio).toHaveClass('radio')
    }

    const highlighter = getHighlighter(screen.getByRole('radiogroup'))
    expect(highlighter).toHaveClass('highlighter')
    expect(highlighter).toHaveAttribute('aria-hidden', 'true')
    expect(highlighter).toHaveStyle({
      position: 'absolute',
      top: '0px',
      left: '0px',
      backgroundColor: 'rgb(255, 0, 0)'
    })
  })

  it('spreads extra props onto the root element and positions it relatively by default', () => {
    render(
      <FancySwitch
        options={fruits}
        id="switch"
        className="root"
        data-testid="root"
      />
    )

    const group = screen.getByTestId('root')
    expect(group).toHaveAttribute('role', 'radiogroup')
    expect(group).toHaveAttribute('id', 'switch')
    expect(group).toHaveClass('root')
    expect(group).toHaveStyle({ position: 'relative' })
  })

  it('lets the style prop override the default root position', () => {
    render(<FancySwitch options={fruits} style={{ position: 'absolute' }} />)

    expect(screen.getByRole('radiogroup')).toHaveStyle({ position: 'absolute' })
  })

  it('uses a custom aria-label and drops the default label when aria-labelledby is given', () => {
    const { rerender } = render(
      <FancySwitch options={fruits} aria-label="Fruit" />
    )
    expect(
      screen.getByRole('radiogroup', { name: 'Fruit' })
    ).toBeInTheDocument()

    rerender(
      <>
        <span id="fruit-label">Pick a fruit</span>
        <FancySwitch options={fruits} aria-labelledby="fruit-label" />
      </>
    )
    const group = screen.getByRole('radiogroup', { name: 'Pick a fruit' })
    expect(group).not.toHaveAttribute('aria-label')
  })

  it('announces the selected option in a live region', () => {
    render(<FancySwitch options={fruits} value="banana" />)

    expect(screen.getByText('banana selected')).toHaveAttribute(
      'aria-live',
      'polite'
    )
  })

  it('renders nothing selectable for an empty option list without crashing', () => {
    render(<FancySwitch options={[]} />)

    const group = screen.getByRole('radiogroup')
    expect(screen.queryAllByRole('radio')).toHaveLength(0)
    expect(() => fireEvent.keyDown(group, { key: 'ArrowRight' })).not.toThrow()
    expect(group.querySelector('[aria-live]')).toBeEmptyDOMElement()
  })

  it('does not warn about duplicate keys for duplicate or missing values', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<FancySwitch options={['a', 'a', { label: 'no value' }]} />)

    expect(getRadios()).toHaveLength(3)
    expect(consoleError).not.toHaveBeenCalled()
  })
})

describe('selection', () => {
  it('selects an option on click and reports its value', () => {
    const onChange = vi.fn()
    render(<FancySwitch options={fruits} onChange={onChange} />)

    const banana = screen.getByRole('radio', { name: 'banana option' })
    fireEvent.click(banana)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('banana')
    expect(banana).toBeChecked()
    expect(banana).toHaveFocus()
    expect(banana).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('radio', { name: 'apple option' })).toHaveAttribute(
      'tabindex',
      '-1'
    )
    expect(screen.getByText('banana selected')).toBeInTheDocument()
  })

  it('ignores clicks on disabled options', () => {
    const onChange = vi.fn()
    render(
      <FancySwitch
        options={fruits}
        disabledOptions={['banana']}
        onChange={onChange}
      />
    )

    const banana = screen.getByRole('radio', { name: 'banana option' })
    expect(banana).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(banana)

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('radio', { name: 'apple option' })).toBeChecked()
  })

  it('follows the controlled value prop', () => {
    const onChange = vi.fn()
    render(<ControlledFruits onChange={onChange} />)

    fireEvent.click(screen.getByRole('radio', { name: 'cherry option' }))

    expect(onChange).toHaveBeenCalledWith('cherry')
    expect(getCheckedRadio()).toHaveTextContent('cherry')
  })

  it('keeps the controlled value when the parent does not accept the change', () => {
    const onChange = vi.fn()
    render(<FancySwitch options={fruits} value="apple" onChange={onChange} />)

    fireEvent.click(screen.getByRole('radio', { name: 'cherry option' }))

    expect(onChange).toHaveBeenCalledWith('cherry')
    expect(getCheckedRadio()).toHaveTextContent('apple')
  })

  it('updates the selection when the value prop changes', () => {
    const { rerender } = render(<FancySwitch options={fruits} value="apple" />)
    expect(getCheckedRadio()).toHaveTextContent('apple')

    rerender(<FancySwitch options={fruits} value="cherry" />)
    expect(getCheckedRadio()).toHaveTextContent('cherry')
  })

  it('warns and falls back to the first option for an unknown value', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(<FancySwitch options={fruits} value="durian" />)

    expect(getCheckedRadio()).toHaveTextContent('apple')
    expect(consoleWarn).toHaveBeenCalledTimes(1)
    expect(consoleWarn.mock.calls[0][0]).toContain('durian')
  })

  it('falls back to the first option when the selected option is removed', () => {
    const { rerender } = render(<FancySwitch options={fruits} />)
    fireEvent.click(screen.getByRole('radio', { name: 'cherry option' }))
    expect(getCheckedRadio()).toHaveTextContent('cherry')

    rerender(<FancySwitch options={['apple', 'banana']} />)

    expect(getRadios()).toHaveLength(2)
    expect(getCheckedRadio()).toHaveTextContent('apple')
    expect(screen.getByText('apple selected')).toBeInTheDocument()
  })

  it('re-renders labels when the options change', () => {
    const { rerender } = render(
      <FancySwitch options={[{ value: 1, label: 'One' }]} value={1} />
    )
    expect(getCheckedRadio()).toHaveTextContent('One')

    rerender(<FancySwitch options={[{ value: 1, label: 'Uno' }]} value={1} />)
    expect(getCheckedRadio()).toHaveTextContent('Uno')
    expect(screen.getByText('Uno selected')).toBeInTheDocument()
  })
})

describe('keyboard navigation', () => {
  it('moves the selection with the arrow keys and wraps around', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FancySwitch options={fruits} onChange={onChange} />)

    await user.tab()
    expect(screen.getByRole('radio', { name: 'apple option' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(getCheckedRadio()).toHaveTextContent('banana')
    expect(getCheckedRadio()).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(getCheckedRadio()).toHaveTextContent('cherry')

    await user.keyboard('{ArrowRight}')
    expect(getCheckedRadio()).toHaveTextContent('apple')

    await user.keyboard('{ArrowLeft}')
    expect(getCheckedRadio()).toHaveTextContent('cherry')

    await user.keyboard('{ArrowUp}')
    expect(getCheckedRadio()).toHaveTextContent('banana')

    expect(onChange.mock.calls.map(([value]) => value)).toEqual([
      'banana',
      'cherry',
      'apple',
      'cherry',
      'banana'
    ])
  })

  it('skips disabled options', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <FancySwitch
        options={['a', { value: 'b', label: 'b', disabled: true }, 'c', 'd']}
        disabledOptions={['d']}
        onChange={onChange}
      />
    )

    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(getCheckedRadio()).toHaveTextContent('c')

    await user.keyboard('{ArrowRight}')
    expect(getCheckedRadio()).toHaveTextContent('a')

    await user.keyboard('{ArrowLeft}')
    expect(getCheckedRadio()).toHaveTextContent('c')

    expect(onChange.mock.calls.map(([value]) => value)).toEqual(['c', 'a', 'c'])
  })

  it('moves to the first and last enabled option with Home and End', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <FancySwitch
        options={['w', 'x', 'y', 'z']}
        disabledOptions={['w', 'z']}
        onChange={onChange}
      />
    )

    // "w" is disabled, so "x" is the tab stop.
    await user.tab()
    const x = screen.getByRole('radio', { name: 'x option' })
    expect(x).toHaveFocus()

    await user.keyboard('{End}')
    expect(screen.getByRole('radio', { name: 'y option' })).toBeChecked()

    await user.keyboard('{Home}')
    expect(x).toBeChecked()

    expect(onChange.mock.calls.map(([value]) => value)).toEqual(['y', 'x'])
  })

  it('makes the first enabled option the tab stop when the selected option is disabled and selects it with Space', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <FancySwitch
        options={fruits}
        value="apple"
        disabledOptions={['apple']}
        onChange={onChange}
      />
    )

    expect(screen.getByRole('radio', { name: 'apple option' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'apple option' })).toHaveAttribute(
      'tabindex',
      '-1'
    )
    expect(
      screen.getByRole('radio', { name: 'banana option' })
    ).toHaveAttribute('tabindex', '0')

    await user.tab()
    expect(screen.getByRole('radio', { name: 'banana option' })).toHaveFocus()

    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledWith('banana')

    // Arrow navigation is relative to the focused option, not the selection.
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenLastCalledWith('cherry')
  })

  it('does nothing when every option is disabled', () => {
    const onChange = vi.fn()
    render(
      <FancySwitch
        options={fruits}
        disabledOptions={fruits}
        onChange={onChange}
      />
    )

    const group = screen.getByRole('radiogroup')
    for (const radio of getRadios()) {
      expect(radio).toHaveAttribute('tabindex', '-1')
    }
    fireEvent.keyDown(group, { key: 'ArrowRight' })
    fireEvent.keyDown(group, { key: ' ' })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('prevents the default action only for the keys it handles', () => {
    render(<FancySwitch options={fruits} />)
    const group = screen.getByRole('radiogroup')

    for (const key of [
      'ArrowRight',
      'ArrowLeft',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      ' '
    ]) {
      expect(fireEvent.keyDown(group, { key })).toBe(false)
    }
    expect(fireEvent.keyDown(group, { key: 'Enter' })).toBe(true)
    expect(fireEvent.keyDown(group, { key: 'a' })).toBe(true)
  })

  it('calls a consumer onKeyDown handler and still navigates', () => {
    const onKeyDown = vi.fn()
    render(<FancySwitch options={fruits} onKeyDown={onKeyDown} />)

    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' })

    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyDown.mock.calls[0][0].key).toBe('ArrowRight')
    expect(getCheckedRadio()).toHaveTextContent('banana')
  })

  it('lets a consumer onKeyDown handler cancel navigation with preventDefault', () => {
    render(
      <FancySwitch
        options={fruits}
        onKeyDown={(event) => event.preventDefault()}
      />
    )

    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' })

    expect(getCheckedRadio()).toHaveTextContent('apple')
  })
})

describe('renderOption', () => {
  it('renders custom option content with the resolved option and selection state', () => {
    const onChange = vi.fn()
    const options = [
      { value: 'sun', label: 'Sun', icon: '☀️' },
      { value: 'moon', label: 'Moon', icon: '🌙', disabled: true }
    ]
    const renderOption = vi.fn(
      ({
        option,
        isSelected,
        getOptionProps
      }: RenderOptionProps<(typeof options)[number]>) => (
        <div {...getOptionProps()} className={isSelected ? 'selected' : 'idle'}>
          {option.icon} {option.label}
        </div>
      )
    )

    render(
      <FancySwitch
        options={options}
        radioClassName="ignored-when-overridden"
        onChange={onChange}
        renderOption={renderOption}
      />
    )

    const sun = screen.getByRole('radio', { name: 'Sun option' })
    const moon = screen.getByRole('radio', { name: 'Moon option' })
    expect(sun).toHaveTextContent('☀️ Sun')
    expect(sun).toBeChecked()
    expect(sun).toHaveClass('selected')
    expect(sun).toHaveAttribute('tabindex', '0')
    expect(moon).toHaveClass('idle')
    expect(moon).toHaveAttribute('aria-disabled', 'true')
    expect(moon).toHaveAttribute('data-disabled', 'true')

    expect(renderOption).toHaveBeenCalledWith(
      expect.objectContaining({
        option: { value: 'sun', label: 'Sun', icon: '☀️', disabled: false },
        isSelected: true
      })
    )

    fireEvent.click(moon)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('exposes the props needed for the option element', () => {
    let captured: OptionProps | undefined
    render(
      <FancySwitch
        options={['a']}
        radioClassName="radio"
        renderOption={({ getOptionProps }) => {
          captured = getOptionProps()
          return <div {...getOptionProps()}>a</div>
        }}
      />
    )

    expect(captured).toMatchObject({
      role: 'radio',
      'aria-checked': true,
      'aria-label': 'a option',
      tabIndex: 0,
      className: 'radio',
      'data-checked': true
    })
    expect(captured?.ref).toBeTypeOf('function')
    expect(captured?.onClick).toBeTypeOf('function')
  })
})

describe('highlighter', () => {
  it('positions the highlighter over the selected option relative to the container padding box', () => {
    render(
      <FancySwitch
        options={fruits}
        value="banana"
        style={{ borderLeftWidth: '2px', borderTopWidth: '3px' }}
      />
    )
    const group = screen.getByRole('radiogroup')
    const [, banana] = getRadios()

    mockRect(group, { left: 100, top: 50, width: 300, height: 40 })
    mockRect(banana, { left: 160, top: 58, width: 80, height: 24 })
    act(() => {
      MockResizeObserver.instances[0].trigger()
    })

    expect(getHighlighter(group)).toHaveStyle({
      width: '80px',
      height: '24px',
      transform: 'translate(58px, 5px)'
    })
  })

  it('includes the option margins when highlighterIncludeMargin is set', () => {
    render(
      <FancySwitch
        options={fruits}
        highlighterIncludeMargin
        renderOption={({ option, getOptionProps }) => (
          <div {...getOptionProps()} style={{ margin: '4px 8px 6px 10px' }}>
            {option.label}
          </div>
        )}
      />
    )
    const group = screen.getByRole('radiogroup')
    const [apple] = getRadios()

    mockRect(group, { left: 0, top: 0, width: 300, height: 40 })
    mockRect(apple, { left: 20, top: 10, width: 80, height: 24 })
    act(() => {
      MockResizeObserver.instances[0].trigger()
    })

    expect(getHighlighter(group)).toHaveStyle({
      width: '98px',
      height: '34px',
      transform: 'translate(10px, 6px)'
    })
  })

  it('moves when the selection changes', () => {
    render(<FancySwitch options={fruits} />)
    const group = screen.getByRole('radiogroup')
    const [apple, banana] = getRadios()
    mockRect(group, { left: 0, top: 0, width: 300, height: 40 })
    mockRect(apple, { left: 10, top: 5, width: 60, height: 30 })
    mockRect(banana, { left: 90, top: 5, width: 70, height: 30 })
    act(() => {
      MockResizeObserver.instances[0].trigger()
    })
    expect(getHighlighter(group)).toHaveStyle({
      width: '60px',
      transform: 'translate(10px, 5px)'
    })

    fireEvent.click(banana)

    expect(getHighlighter(group)).toHaveStyle({
      width: '70px',
      transform: 'translate(90px, 5px)'
    })
  })

  it('observes the container and every option for size changes and disconnects on unmount', () => {
    const { unmount } = render(<FancySwitch options={fruits} />)
    const group = screen.getByRole('radiogroup')

    expect(MockResizeObserver.instances).toHaveLength(1)
    const observer = MockResizeObserver.instances[0]
    expect(observer.observed.has(group)).toBe(true)
    for (const radio of getRadios()) {
      expect(observer.observed.has(radio)).toBe(true)
    }

    unmount()
    expect(observer.disconnected).toBe(true)
  })

  it('still renders when ResizeObserver is unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined)

    render(<FancySwitch options={fruits} />)

    expect(getRadios()).toHaveLength(3)
  })
})
