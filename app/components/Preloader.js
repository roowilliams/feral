import Component from '../classes/Component'
import each from 'lodash/each'
import gsap from 'gsap'

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.preloader',
      elements: {
        number: '.preloader__number',
        images: document.querySelectorAll('img')
      }
    })

    this.length = 0

    this.createLoader()
  }

  createLoader() {
    if (this.elements.images) {
      each(this.elements.images, (element) => {
        element.onload = () => this.onAssetLoaded(element)
        element.src = element.getAttribute('data-src')
      })
    }
    return this.onLoaded()
  }

  onAssetLoaded(image) {
    if (this.elements.number) {
      this.length++
      const percent = this.length / this.elements.images.length

      this.elements.number.textContent = `${Math.round(percent * 100)}%`
      image.classList.add('loaded')

      if (percent === 1) {
        this.onLoaded()
      }
    }
  }

  onLoaded() {
    this.animateOut = gsap.timeline()
    this.animateOut
      .to(this.element, {
        autoAlpha: 0,
        delay: 0.8
      })
      .call(() => {
        this.emit('complete')
      })
  }

  destroy() {
    this?.element.parentNode.removeChild(this.element)
  }
}
