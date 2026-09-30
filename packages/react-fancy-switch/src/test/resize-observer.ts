/**
 * jsdom does not implement ResizeObserver. This minimal implementation
 * records observed elements and lets tests trigger resize notifications.
 */
export class MockResizeObserver implements ResizeObserver {
  static instances: MockResizeObserver[] = []

  readonly observed = new Set<Element>()
  disconnected = false

  constructor(private readonly callback: ResizeObserverCallback) {
    MockResizeObserver.instances.push(this)
  }

  observe(target: Element) {
    this.observed.add(target)
  }

  unobserve(target: Element) {
    this.observed.delete(target)
  }

  disconnect() {
    this.observed.clear()
    this.disconnected = true
  }

  trigger() {
    this.callback([], this)
  }
}
