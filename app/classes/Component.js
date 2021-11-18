import EventEmitter from 'events'
import each from 'lodash/each'

export default class Component extends EventEmitter {
  constructor({ element, elements }) {
    super()

    this.selector = element
    this.selectorChildren = elements

    this.create()

    this.addEventListeners()
  }

  create() {
    this.element = document.querySelector(this.selector)
    this.elements = {}

    each(this.selectorChildren, (item, key) => {
      if (
        item instanceof window.HTMLElement ||
        item instanceof window.NodeList
      ) {
        this.elements[key] = item
      } else {
        this.elements[key] = document.querySelectorAll(item)

        if (!this.elements[key].length) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(item)
        }
      }
    })
  }
  addEventListeners() {}

  removeEventListeners() {}
}
