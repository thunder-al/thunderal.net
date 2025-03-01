import {createApp} from 'vue'
import Root from './Root.vue'

function getRootElement() {
  const existedElement = document.getElementById('app')
  if (existedElement) {
    return existedElement
  }

  const el = document.createElement('div')
  el.id = 'app'
  document.body.appendChild(el)

  return el
}

const el = getRootElement()

const app = createApp(Root)

app.mount(el)
