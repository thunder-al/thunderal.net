import {Color, DoubleSide, ShaderMaterial, Vector3} from 'three'
import vertex from './material-vertex.glsl?raw'
import fragment from './material-fragment.glsl?raw'

export const gridMaterial = new ShaderMaterial({
  uniforms: {
    cellSize: {value: 0.5},
    sectionSize: {value: 1},
    fadeDistance: {value: 100},
    fadeStrength: {value: 1},
    fadeFrom: {value: 1},
    cellThickness: {value: 0.5},
    sectionThickness: {value: 1},
    cellColor: {value: new Color('#000000')},
    sectionColor: {value: new Color('#0000ff')},
    infiniteGrid: {value: true},
    followCamera: {value: false},
    worldCamProjPosition: {value: new Vector3()},
    worldPlanePosition: {value: new Vector3()},
  },
  vertexShader: vertex,
  fragmentShader: fragment,
  side: DoubleSide,
  transparent: true,
})