import {createTreeContext} from './context.ts'

export interface ITreeComponentContext extends ReturnType<typeof createTreeContext> {
  destroy: () => void
  onDestroy: (func: () => unknown) => void
}

export type TTreeComponentInstance = ReturnType<ReturnType<typeof defineTreeComponent>>

export function defineTreeComponent<T = null, R = unknown>(
  setup: (context: ITreeComponentContext, arg: T) => R,
) {
  return function make(arg: T) {

    return function register(
      renderContext: ReturnType<typeof createTreeContext>,
    ) {
      const destroyHooks: Array<() => unknown> = []

      function destroy() {
        for (const hook of destroyHooks) {
          hook()
        }
      }

      function onDestroy(func: () => unknown) {
        destroyHooks.push(func)
      }

      const ctx = Object.assign(
        Object.create(renderContext),
        {
          destroy,
          onDestroy,
        },
      ) as ITreeComponentContext

      const payload = setup(ctx, arg)

      return {
        payload,
        ctx,
      }
    }
  }
}