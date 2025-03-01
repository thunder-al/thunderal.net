import {Camera, PerspectiveCamera, Scene, WebGLRenderer} from 'three'
import {ref} from 'vue'
import {createEventEmitter} from './event-emitter.ts'

export interface ITreeContextEvents {
  canvasResize: DOMRect
  render: DOMHighResTimeStamp
  destroy: null
}

export function createTreeContext(canvasEl: HTMLCanvasElement) {
  /*
   * setup
   */
  const scene = new Scene()
  const renderer = new WebGLRenderer({
    canvas: canvasEl,
    alpha: true,
  })

  /*
   * events
   */

  const events = createEventEmitter<ITreeContextEvents>()

  /*
   * canvas data
   */
  const canvasProps = ref<Record<string, any>>({})
  const canvasInfo = ref(canvasEl.getBoundingClientRect())
  const canvasResizeObserver = new ResizeObserver(() => {
    const info = canvasEl.getBoundingClientRect()
    canvasInfo.value = info

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(info.width, info.height, false)
    events.dispatch('canvasResize', info)
  })
  canvasResizeObserver.observe(canvasEl)

  /*
   * camera
   */

  let camera: Camera | null = null

  function setCamera(newCamera: Camera) {
    camera = newCamera
  }

  function createPerspectiveCamera(fov: number = 90) {
    if (camera) {
      return camera
    }

    const cam = new PerspectiveCamera(fov)
    setCamera(cam)

    cam.aspect = canvasInfo.value.width / canvasInfo.value.height
    cam.updateProjectionMatrix()

    events.on('canvasResize', size => {
      cam.aspect = size.width / size.height
      cam.updateProjectionMatrix()
    })

    return cam
  }

  /*
   * rendering
   */

  function render(time: DOMHighResTimeStamp) {
    if (!camera) {
      return
    }

    events.dispatch('render', time)

    renderer.render(scene, camera)
  }

  function startRenderCycle() {
    renderer.setAnimationLoop(render)
  }

  function destroy() {
    events.dispatch('destroy', null)

    canvasResizeObserver.disconnect()
    renderer.dispose()
    events.destroy()
  }

  /*
   * context
   */

  const ctx = {
    scene,
    canvasEl,
    renderer,
    render,
    startRenderCycle,
    setCamera,
    get camera() {
      return camera
    },
    destroy,
    createPerspectiveCamera,
    canvasProps,
    canvasInfo,
    events,
    use,
  }

  /*
   * components
   */

  function use<T>(comp: (c: typeof ctx) => T): T {
    return comp(ctx)
  }

  return ctx
}