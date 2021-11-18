import each from 'lodash/each'
import gsap from 'gsap'
import prefix from 'prefix'
import NormalizeWheel from 'normalize-wheel'

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element
    this.selectorChildren = elements

    this.id = id

    this.transformPrefix = prefix('transform')
  }

  create() {
    this.element = document.querySelector(this.selector)
    this.elements = {}

    this.scroll = {
      current: 0,
      target: 0,
      prev: 0,
      limit: 0
    }

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
      const tl = gsap.timeline()
      tl.to(this.element, { autoAlpha: 1 }).call(() => {
        this.addEventListeners()
        resolve()
      })
    })
  }

  hide() {
    return new Promise((resolve) => {
      gsap.to(this.element, { autoAlpha: 0, onComplete: resolve })
    })
  }

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight
    }
  }

  onMouseWheel(event) {
    const { pixelY } = NormalizeWheel(event)
    this.scroll.target += pixelY
  }

  update() {
    if (this.elements.wrapper) {
      this.scroll.target = gsap.utils.clamp(
        0,
        this.scroll.limit,
        this.scroll.target
      )

      this.scroll.current = gsap.utils.interpolate(
        this.scroll.current,
        this.scroll.target,
        0.1
      )
      if (this.scroll.current < 0.01) this.scroll.current = 0

      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`
    }
  }

  addEventListeners() {
    window.addEventListener('mousewheel', (e) => this.onMouseWheel(e))
  }

  removeEventListeners() {
    window.removeEventListener('mousewheel', (e) => this.onMouseWheel(e))
  }
}
