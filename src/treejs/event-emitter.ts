export function createEventEmitter<
  E extends Record<string, any>
>() {
  const events = new Map<keyof E, any>()

  function on<K extends keyof E>(
    event: K,
    handler: (payload: E[K]) => unknown,
  ) {
    if (!events.has(event)) {
      events.set(event, [])
    }

    events.get(event).push(handler)
  }

  function off<K extends keyof E>(
    event: K,
    handler: E[K],
  ) {
    if (!events.has(event)) {
      return
    }

    const handlers = events.get(event)
    const index = handlers.indexOf(handler)

    if (index === -1) {
      return
    }

    handlers.splice(index, 1)
  }

  function dispatch<K extends keyof E>(
    event: K,
    payload: E[K],
  ) {
    if (!events.has(event)) {
      return
    }

    const handlers = events.get(event)

    for (const handler of handlers) {
      handler(payload)
    }
  }

  function destroy() {
    events.clear()
  }

  return {
    on,
    off,
    dispatch,
    destroy,
  }
}