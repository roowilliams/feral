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
    this.x = {
      start: 0,
      distance: 0,
      end: 0
    }
    this.y = {
      start: 0,
      distance: 0,
      end: 0
    }
    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.3
    }

    this.scroll = {
      x: 0,
      y: 0
    }

    this.scrollCurrent = {
      x: 0,
      y: 0
    }
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

  onTouchDown(event) {
    this.isDown = true

    this.x.start = event.touches ? event.touches[0].clientX : event.clientX
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY

    const values = {
      x: this.x,
      y: this.y
    }

    this.speed.target = 1

    this.scrollCurrent.x = this.scroll.x
    this.scrollCurrent.y = this.scroll.y
  }

  onTouchMove(event) {
    if (!this.isDown) return

    const x = event.touches ? event.touches[0].clientX : event.clientX
    const y = event.touches ? event.touches[0].clientY : event.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y
    }

    const xDistance = values.x.start - x.end
    const yDistance = values.y.start - y.end

    this.x.target = this.scrollCurrent.x - xDistance
    this.y.target = this.scrollCurrent.y - yDistance
  }

  onTouchUp(event) {
    this.isDown = false
    this.speed.target = 0
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
    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))
  }

  removeEventListeners() {
    window.removeEventListener('mousewheel', (e) => this.onMouseWheel(e))
  }
}
