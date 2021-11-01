import each from 'lodash/each'
import gsap from 'gsap'

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element
    this.selectorChildren = elements

    this.id = id
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

  show() {
    return new Promise((resolve) => {
      gsap.from(this.element, { autoAlpha: 0, onComplete: resolve })
    })
  }

  hide() {
    return new Promise((resolve) => {
      gsap.to(this.element, { autoAlpha: 0, onComplete: resolve })
    })
  }
}
