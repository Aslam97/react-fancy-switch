import { FancySwitch } from '@omit/react-fancy-switch'
import { Check, Sun, Moon, Monitor } from 'lucide-react'

// Basic Usage with Primitive Values
export function BasicExample() {
  return (
    <FancySwitch
      options={['Apple', 'Orange', 'Banana']}
      onChange={(value) => console.log('Selected:', value)}
      className="flex gap-2 p-2 bg-gray-100 rounded relative"
      radioClassName="px-4 py-2 cursor-pointer"
      highlighterClassName="bg-white rounded shadow"
    />
  )
}

// With Numbers
export function NumberExample() {
  return (
    <FancySwitch
      options={[1, 2, 3, 4, 5]}
      onChange={(value) => console.log('Selected:', value)}
      className="flex gap-2 p-2 bg-gray-100 rounded relative"
      radioClassName="px-4 py-2 cursor-pointer"
      highlighterClassName="bg-white rounded shadow"
    />
  )
}

// With Simple Objects
export function SimpleObjectExample() {
  const options = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ]

  return (
    <FancySwitch
      options={options}
      onChange={(value) => console.log('Selected:', value)}
      className="flex gap-2 p-2 bg-gray-100 rounded relative"
      radioClassName="px-4 py-2 cursor-pointer"
      highlighterClassName="bg-white rounded shadow"
    />
  )
}

// With Custom Keys
export function CustomKeysExample() {
  const options = [
    { id: 'sm', text: 'Small', isDisabled: false },
    { id: 'md', text: 'Medium', isDisabled: true },
    { id: 'lg', text: 'Large', isDisabled: false }
  ]

  return (
    <FancySwitch
      options={options}
      valueKey="id"
      labelKey="text"
      disabledKey="isDisabled"
      onChange={(value) => console.log('Selected:', value)}
      className="flex gap-2 p-2 bg-gray-100 rounded relative"
      radioClassName="px-4 py-2 cursor-pointer"
      highlighterClassName="bg-white rounded shadow"
    />
  )
}

// With Disabled Options (Array method)
export function DisabledOptionsExample() {
  const options = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ]

  return (
    <FancySwitch
      options={options}
      disabledOptions={['archived']}
      onChange={(value) => console.log('Selected:', value)}
      className="flex gap-2 p-2 bg-gray-100 rounded relative"
      radioClassName="px-4 py-2 cursor-pointer disabled:opacity-50"
      highlighterClassName="bg-white rounded shadow"
    />
  )
}

// With Icons (Basic)
export function BasicIconExample() {
  return (
    <FancySwitch
      options={[
        { value: 'light', label: 'Light', icon: 'sun' },
        { value: 'dark', label: 'Dark', icon: 'moon' },
        { value: 'system', label: 'System', icon: 'monitor' }
      ]}
      renderOption={({ option, getOptionProps }) => (
        <div
          {...getOptionProps()}
          className="flex items-center gap-2 px-4 py-2"
        >
          {option.icon === 'sun' && <Sun className="w-4 h-4" />}
          {option.icon === 'moon' && <Moon className="w-4 h-4" />}
          {option.icon === 'monitor' && <Monitor className="w-4 h-4" />}
          <span>{option.label}</span>
        </div>
      )}
      className="flex gap-2 p-2 bg-gray-100 rounded relative"
      highlighterClassName="bg-white rounded shadow"
    />
  )
}

// Custom Rendering with Selection Indicator
export function CustomRenderingWithIndicatorExample() {
  return (
    <FancySwitch
      options={[
        { value: 'xs', label: 'Extra Small' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' }
      ]}
      renderOption={({ option, isSelected, getOptionProps }) => (
        <div
          {...getOptionProps()}
          className="flex items-center gap-2 px-4 py-2 relative"
        >
          <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
            {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
          </div>
          <span>{option.label}</span>
        </div>
      )}
      className="flex gap-2 p-2 bg-gray-100 rounded relative"
      highlighterClassName="bg-white rounded shadow"
    />
  )
}

// With Description and Icons
export function RichContentExample() {
  return (
    <FancySwitch
      options={[
        {
          value: 'beginner',
          label: 'Beginner',
          description: 'Perfect for getting started',
          icon: '🌱'
        },
        {
          value: 'intermediate',
          label: 'Intermediate',
          description: 'For those with some experience',
          icon: '🌿'
        },
        {
          value: 'advanced',
          label: 'Advanced',
          description: 'For experienced users',
          icon: '🌳'
        }
      ]}
      renderOption={({ option, isSelected, getOptionProps }) => (
        <div
          {...getOptionProps()}
          className={`
            flex items-start gap-3 p-4 relative
            ${isSelected ? 'text-blue-600' : 'text-gray-600'}
          `}
        >
          <div className="text-2xl">{option.icon}</div>
          <div className="flex flex-col">
            <span className="font-medium">{option.label}</span>
            <span className="text-sm opacity-75">{option.description}</span>
          </div>
          {isSelected && <Check className="w-4 h-4 absolute top-4 right-4" />}
        </div>
      )}
      className="flex flex-col gap-2 p-2 bg-gray-100 rounded relative w-80"
      highlighterClassName="bg-white rounded shadow"
    />
  )
}

// With Custom Styling per Option
export function CustomStyledExample() {
  return (
    <FancySwitch
      options={[
        { value: 'error', label: 'Error', color: 'red' },
        { value: 'warning', label: 'Warning', color: 'yellow' },
        { value: 'success', label: 'Success', color: 'green' }
      ]}
      renderOption={({ option, isSelected, getOptionProps }) => (
        <div
          {...getOptionProps()}
          className={`
            px-4 py-2 rounded
            ${
              isSelected
                ? `bg-${option.color}-100 text-${option.color}-800`
                : 'text-gray-600'
            }
          `}
        >
          <span>{option.label}</span>
        </div>
      )}
      className="flex gap-2 p-2 relative"
      highlighterClassName="bg-white rounded shadow"
    />
  )
}

// With Images/Avatars
export function ImageOptionsExample() {
  return (
    <FancySwitch
      options={[
        { value: 'light', label: 'Light', image: '/light-theme.png' },
        { value: 'dark', label: 'Dark', image: '/dark-theme.png' }
      ]}
      renderOption={({ option, isSelected, getOptionProps }) => (
        <div
          {...getOptionProps()}
          className={`
            flex flex-col items-center gap-2 p-4
            ${isSelected ? 'text-blue-600' : 'text-gray-600'}
          `}
        >
          <img
            src={`/api/placeholder/100/100`}
            alt={option.label}
            className={`
              w-24 h-24 rounded object-cover border-2
              ${isSelected ? 'border-blue-500' : 'border-transparent'}
            `}
          />
          <span className="font-medium">{option.label}</span>
        </div>
      )}
      className="flex gap-4 p-4 bg-gray-100 rounded relative"
      highlighterClassName="bg-white rounded shadow"
    />
  )
}

// Advanced Layout with Grid
export function GridLayoutExample() {
  const options = [
    { value: '1x', label: '1x', speedFactor: 1 },
    { value: '1.5x', label: '1.5x', speedFactor: 1.5 },
    { value: '2x', label: '2x', speedFactor: 2 },
    { value: '2.5x', label: '2.5x', speedFactor: 2.5 },
    { value: '3x', label: '3x', speedFactor: 3 },
    { value: '3.5x', label: '3.5x', speedFactor: 3.5 }
  ]

  return (
    <FancySwitch
      options={options}
      renderOption={({ option, isSelected, getOptionProps }) => (
        <div
          {...getOptionProps()}
          className={`
            flex flex-col items-center justify-center p-4 rounded
            ${isSelected ? 'text-blue-600' : 'text-gray-600'}
          `}
        >
          <span className="text-lg font-bold">{option.label}</span>
          <span className="text-sm">
            Speed: {option.speedFactor.toFixed(1)}
          </span>
        </div>
      )}
      className="grid grid-cols-3 gap-2 p-2 bg-gray-100 rounded relative w-80"
      highlighterClassName="bg-white rounded shadow"
      highlighterIncludeMargin={true}
    />
  )
}

// With Animation State
export function AnimatedExample() {
  return (
    <FancySwitch
      options={[
        { value: 'idle', label: 'Idle' },
        { value: 'loading', label: 'Loading' },
        { value: 'success', label: 'Success' },
        { value: 'error', label: 'Error' }
      ]}
      renderOption={({ option, isSelected, getOptionProps }) => {
        const baseClasses = 'px-4 py-2 relative overflow-hidden'
        const selectedClasses = isSelected ? 'text-white' : 'text-gray-600'

        return (
          <div
            {...getOptionProps()}
            className={`${baseClasses} ${selectedClasses}`}
          >
            <span className="relative z-10">{option.label}</span>
            {isSelected && (
              <div className="absolute inset-0 bg-blue-500 animate-gradient" />
            )}
          </div>
        )
      }}
      className="flex gap-2 p-2 bg-gray-100 rounded relative"
      highlighterClassName="rounded shadow"
    />
  )
}

// Color Picker Example
export function ColorPickerExample() {
  const colors = [
    { value: 'red', label: 'Red', hex: '#EF4444' },
    { value: 'green', label: 'Green', hex: '#10B981' },
    { value: 'blue', label: 'Blue', hex: '#3B82F6' },
    { value: 'purple', label: 'Purple', hex: '#8B5CF6' }
  ]

  return (
    <FancySwitch
      options={colors}
      renderOption={({ option, isSelected, getOptionProps }) => (
        <div
          {...getOptionProps()}
          className="flex flex-col items-center gap-2 p-2"
        >
          <div
            className={`
              w-8 h-8 rounded-full
              ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
            `}
            style={{ backgroundColor: option.hex }}
          />
          <span className="text-sm">{option.label}</span>
        </div>
      )}
      className="flex gap-4 p-4 bg-gray-100 rounded relative"
      highlighterClassName="bg-white rounded shadow"
    />
  )
}

// With Badges/Counts
export function BadgedExample() {
  return (
    <FancySwitch
      options={[
        { value: 'all', label: 'All', count: 156 },
        { value: 'active', label: 'Active', count: 23 },
        { value: 'archived', label: 'Archived', count: 133 }
      ]}
      renderOption={({ option, isSelected, getOptionProps }) => (
        <div
          {...getOptionProps()}
          className="flex items-center gap-2 px-4 py-2"
        >
          <span>{option.label}</span>
          <span
            className={`
              px-2 py-0.5 rounded-full text-xs
              ${
                isSelected
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }
            `}
          >
            {option.count}
          </span>
        </div>
      )}
      className="flex gap-2 p-2 bg-gray-100 rounded relative"
      highlighterClassName="bg-white rounded shadow"
    />
  )
}
