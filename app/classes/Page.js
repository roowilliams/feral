import each from 'lodash/each'
import gsap from 'gsap'
import prefix from 'prefix'
import map from 'lodash/map'

import NormalizeWheel from 'normalize-wheel'
import AsyncLoad from '~/app/classes/AsyncLoad'

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element
    this.selectorChildren = { ...elements, preloaders: '[data-src]' }

    this.id = id

    this.transformPrefix = prefix('transform')
  }

  create() {
    console.log('page create')

    this.element = document.querySelector(this.selector)
    this.elements = {}

    this.scroll = {
      current: 0,
      target: 0,
      prev: 0,
      limit: 0
    }

    if (this.selector instanceof window.HTMLElement) {
      this.element = this.selector
    } else {
      this.element = document.querySelector(this.selector)
    }
    this.elements = {}

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelectorAll(entry)

        if (this.elements[key].length === 0) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry)
        }
      }
    })

    this.createPreloader()
  }

  createPreloader() {
    console.log('create preloader')
    this.preloaders = map(this.elements.preloaders, (element) => {
      return new AsyncLoad({ element })
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
