import {defineTreeComponent} from '../../tree-component.ts'
import {Vector3} from 'three'
import {deg2rad} from '../../../util/3d.ts'

export const createMouseParallaxComponent = defineTreeComponent<{
  center?: Vector3
  maxAngle?: number
}>((ctx, args) => {
  const cancelToken = new AbortController()

  const camera = ctx.camera
  if (!camera) return

  const center = args.center ?? new Vector3(0, 0, 0)

  const initialPosition = camera.position.clone()
  const initialDistance = initialPosition.distanceTo(center)

  ctx.canvasEl.addEventListener(
    'mousemove',
    (e: MouseEvent) => {
      if (!camera) return

      const {clientX, clientY} = e
      const {width, height} = ctx.canvasInfo.value
      const x = (clientX - width / 2) / width
      const y = (clientY - height / 2) / height

      const maxAngle = args.maxAngle ?? deg2rad(45)
      const angleX = -x * maxAngle
      const angleY = y * maxAngle

      // Calculate new position using spherical coordinates
      const radius = initialDistance / 2
      const posX = radius * Math.sin(angleX) + initialPosition.x
      const posY = radius * Math.sin(angleY) + initialPosition.y
      const posZ = radius * Math.cos(angleX) * Math.cos(angleY) + initialPosition.z

      // Apply the combined rotation to the camera
      camera.position.set(posX, posY, posZ)

      // Look at the initial target point to maintain focus
      camera.lookAt(center)
    },
    {signal: cancelToken.signal},
  )

  ctx.onDestroy(() => cancelToken.abort())
})