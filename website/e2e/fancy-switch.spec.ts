import { expect, test as base, type Locator, type Page } from '@playwright/test'

interface ConsoleRecord {
  type: string
  text: string
}

/**
 * Records console errors/warnings and uncaught exceptions for the page and
 * fails the test if any were emitted.
 */
const test = base.extend<{ problems: ConsoleRecord[] }>({
  problems: [
    async ({ page }, use) => {
      const records = recordProblems(page)
      await use(records)
      expect(records).toEqual([])
    },
    { auto: true }
  ]
})

function recordProblems(page: Page): ConsoleRecord[] {
  const records: ConsoleRecord[] = []
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      records.push({ type: message.type(), text: message.text() })
    }
  })
  page.on('pageerror', (error) => {
    records.push({ type: 'pageerror', text: error.message })
  })
  return records
}

/**
 * Asserts that the highlighter of `group` visually covers `option`
 * (its border box, or its margin box when `includeMargin` is set) once the
 * highlighter transition has settled.
 */
async function expectHighlighterToCover(
  group: Locator,
  option: Locator,
  includeMargin = false
) {
  const highlighter = group.locator('[data-highlighter]')

  await expect
    .poll(
      async () => {
        const [highlighterBox, optionBox, margin] = await Promise.all([
          highlighter.boundingBox(),
          option.boundingBox(),
          option.evaluate((element) => {
            const style = getComputedStyle(element)
            return {
              left: parseFloat(style.marginLeft),
              right: parseFloat(style.marginRight),
              top: parseFloat(style.marginTop),
              bottom: parseFloat(style.marginBottom)
            }
          })
        ])
        if (!highlighterBox || !optionBox) return Number.POSITIVE_INFINITY

        const expected = includeMargin
          ? {
              x: optionBox.x - margin.left,
              y: optionBox.y - margin.top,
              width: optionBox.width + margin.left + margin.right,
              height: optionBox.height + margin.top + margin.bottom
            }
          : optionBox

        return Math.max(
          Math.abs(highlighterBox.x - expected.x),
          Math.abs(highlighterBox.y - expected.y),
          Math.abs(highlighterBox.width - expected.width),
          Math.abs(highlighterBox.height - expected.height)
        )
      },
      { timeout: 3_000 }
    )
    .toBeLessThan(0.5)
}

test.describe('demo page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders three labelled switches with their default selection', async ({
    page
  }) => {
    await expect(page).toHaveTitle('React Fancy Switch')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Fancy Switch' })
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /view on github/i })
    ).toHaveAttribute('href', 'https://github.com/Aslam97/react-fancy-switch')

    for (const name of ['Order type', 'Is published', 'Pet']) {
      await expect(page.getByRole('radiogroup', { name })).toBeVisible()
    }
    await expect(
      page.getByRole('radio', { name: 'Pickup option' })
    ).toBeChecked()
    await expect(
      page.getByRole('radio', { name: 'Draft option' })
    ).toBeChecked()
    await expect(
      page.getByRole('radio', { name: 'Car, (AKA Cat) option' })
    ).toBeChecked()
  })

  test('keeps the highlighter aligned with the selected option', async ({
    page
  }) => {
    const orderType = page.getByRole('radiogroup', { name: 'Order type' })
    await expectHighlighterToCover(
      orderType,
      orderType.getByRole('radio', { name: 'Pickup option' }),
      true
    )

    await orderType.getByRole('radio', { name: 'Shipping option' }).click()
    await expectHighlighterToCover(
      orderType,
      orderType.getByRole('radio', { name: 'Shipping option' }),
      true
    )

    const isPublished = page.getByRole('radiogroup', { name: 'Is published' })
    await isPublished.getByRole('radio', { name: 'Publish option' }).click()
    await expectHighlighterToCover(
      isPublished,
      isPublished.getByRole('radio', { name: 'Publish option' })
    )

    const pet = page.getByRole('radiogroup', { name: 'Pet' })
    await pet.getByRole('radio', { name: 'Dog option' }).click()
    await expectHighlighterToCover(
      pet,
      pet.getByRole('radio', { name: 'Dog option' })
    )
  })

  test('supports keyboard navigation', async ({ page }) => {
    const pickup = page.getByRole('radio', { name: 'Pickup option' })
    const shipping = page.getByRole('radio', { name: 'Shipping option' })
    const delivery = page.getByRole('radio', { name: 'Delivery option' })

    await pickup.focus()
    await page.keyboard.press('ArrowRight')
    await expect(shipping).toBeChecked()
    await expect(shipping).toBeFocused()
    await expect(page.getByText('Order type: Shipping')).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(delivery).toBeChecked()
    await expect(delivery).toBeFocused()

    await page.keyboard.press('ArrowLeft')
    await expect(shipping).toBeChecked()
  })

  test('submits the selected values', async ({ page }) => {
    await page.getByRole('radio', { name: 'Delivery option' }).click()
    await page.getByRole('radio', { name: 'Publish option' }).click()
    await page.getByRole('radio', { name: 'Dog option' }).click()
    await page.getByRole('button', { name: 'Submit' }).click()

    const output = page.getByTestId('submitted-values')
    await expect(output).toBeVisible()
    expect(JSON.parse(await output.innerText())).toEqual({
      isPublished: 1,
      orderType: 'Delivery',
      pet: 2
    })
  })

  test('fits the viewport without horizontal scrolling', async ({ page }) => {
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test('follows the system colour scheme', async ({ page }) => {
    const bodyBackground = () =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    const luminance = (rgb: string) => {
      const channels = rgb.match(/\d+/g)?.map(Number) ?? []
      return channels.slice(0, 3).reduce((sum, channel) => sum + channel, 0)
    }

    await page.emulateMedia({ colorScheme: 'light' })
    const light = await bodyBackground()
    expect(light).toBe('rgb(255, 255, 255)')

    await page.emulateMedia({ colorScheme: 'dark' })
    const dark = await bodyBackground()
    expect(luminance(dark)).toBeLessThan(luminance(light) / 4)
  })
})
