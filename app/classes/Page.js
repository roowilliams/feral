import each from 'lodash/each'
import gsap from 'gsap'
import { clamp, lerp } from '../utils/math'
import prefix from 'prefix'
import map from 'lodash/map'

import NormalizeWheel from 'normalize-wheel'
import AsyncLoad from '~/app/classes/AsyncLoad'

export default class Page {
  constructor({ element, elements, id, isScrollable = true }) {
    this.selector = element
    this.selectorChildren = { ...elements, preloaders: '[data-src]' }

    this.id = id

    this.isScrollable = isScrollable
    this.transformPrefix = prefix('transform')
  }

  create() {
    this.element = document.querySelector(this.selector)
    this.elements = {}

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

    if (this.isScrollable) {
      this.scroll = {
        ease: 0.1,
        position: 0,
        current: 0,
        target: 0,
        limit: 0
      }
    }

    this.createPreloader()
  }

  createPreloader() {
    this.preloaders = map(this.elements.preloaders, (element) => {
      return new AsyncLoad({ element })
    })
  }

  transform(element, y) {
    element.style[this.transformPrefix] = `translate3d(0, ${-Math.round(
      y
    )}px, 0)`
  }

  show() {
    return new Promise((resolve) => {
      if (this.isScrollable) {
        this.scroll.position = 0
        this.scroll.current = 0
        this.scroll.target = 0
      }

      this.isVisible = true
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
    if (!this.isScrollable || !this.elements.wrapper) return

    this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
    this.update()
  }

  onMouseWheel(event) {
    const { pixelY } = NormalizeWheel(event)
    this.scroll.target += pixelY
  }

  onTouchDown(event) {
    if (!this.isScrollable) return

    this.isDown = true

    this.scroll.position = this.scroll.current
    this.start = event.touches ? event.touches[0].clientY : event.clientY
  }

  onTouchMove(event) {
    if (!this.isDown || !this.isScrollable) {
      return
    }

    const y = event.touches ? event.touches[0].clientY : event.clientY
    const distance = (this.start - y) * 2

    this.scroll.target = this.scroll.position + distance
  }

  onTouchUp(event) {
    if (!this.isScrollable) return

    this.isDown = false
  }

  onWheel(event) {
    if (!this.isScrollable) return

    const normalized = NormalizeWheel(event)
    const speed = normalized.pixelY

    this.scroll.target += speed
  }

  update() {
    if (!this.isScrollable || !this.isVisible) return

    this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target)

    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    )

    if (this.scroll.current < 0.1) {
      this.scroll.current = 0
    }

    if (this.elements.wrapper) {
      this.transform(this.elements.wrapper, this.scroll.current)
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
