import {defineTreeSceneComponent} from '../../treejs/tree-scene-component-builder.ts'
import {BoxGeometry, Mesh, MeshBasicMaterial, Vector3} from 'three'
import {createMouseParallaxComponent} from '../../treejs/components/mouse-parrallax'
import {deg2rad} from '../../util/3d.ts'
import {createTreeGridComponent} from '../../treejs/components/grid'

export const SurfaceLevelScene = defineTreeSceneComponent(ctx => {
  ctx.canvasProps.value.style = {
    width: '100vw',
    height: '100vh',
  }

  const camera = ctx.createPerspectiveCamera()
  camera.position.x = 0
  camera.position.y = 6
  camera.position.z = 5
  camera.lookAt(new Vector3(0, 0, 0))

  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial({color: 0x00ff00})
  const cube = new Mesh(geometry, material)
  ctx.scene.add(cube)

  ctx.use(createMouseParallaxComponent({
    maxAngle: deg2rad(15),
  }))

  ctx.use(createTreeGridComponent(null))
})