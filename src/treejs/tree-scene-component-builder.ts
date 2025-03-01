import {computed, defineComponent, h, onMounted, onUnmounted, shallowRef, useTemplateRef} from 'vue'
import {createTreeContext} from './context.ts'

export function defineTreeSceneComponent(
  setup: (ctx: ReturnType<typeof createTreeContext>) => unknown,
) {
  return defineComponent({
    setup() {
      const canvasEl = useTemplateRef<HTMLCanvasElement>('canvas')
      const ctx = shallowRef<ReturnType<typeof createTreeContext>>()

      onMounted(() => {
        ctx.value = createTreeContext(canvasEl.value!)

        setup(ctx.value)

        ctx.value.startRenderCycle()
      })

      onUnmounted(() => {
        if (!ctx.value) {
          return
        }

        ctx.value.destroy()
      })

      const elementProps = computed(() => ctx.value?.canvasProps?.value ?? {})

      return () => h('canvas', {
        ref: 'canvas',
        ...elementProps.value,
      })
    },
  })
}