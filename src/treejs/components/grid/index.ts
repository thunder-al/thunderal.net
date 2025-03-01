import {defineTreeComponent} from '../../tree-component.ts'
import {Mesh, Plane, PlaneGeometry, Uniform, Vector3} from 'three'
import {gridMaterial} from './material.ts'

export const createTreeGridComponent = defineTreeComponent(ctx => {
  const geometry = new PlaneGeometry(1, 1)

  const mesh = new Mesh(geometry, gridMaterial)

  ctx.scene.add(mesh)

  ctx.onDestroy(() => {
    ctx.scene.remove(mesh)
  })


  const plane = new Plane()
  const upVector = new Vector3(0, 1, 0)
  const zeroVector = new Vector3(0, 0, 0)
  function render() {
    plane.setFromNormalAndCoplanarPoint(upVector, zeroVector).applyMatrix4(mesh.matrixWorld)

    const worldCamProjPosition = gridMaterial.uniforms.worldCamProjPosition as Uniform<Vector3>
    const worldPlanePosition = gridMaterial.uniforms.worldPlanePosition as Uniform<Vector3>

    plane.projectPoint(ctx.camera!.position, worldCamProjPosition.value)
    worldPlanePosition.value.set(0, 0, 0).applyMatrix4(mesh.matrixWorld)
  }

  ctx.events.on('render',render)

})