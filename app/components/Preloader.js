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

    console.log(this.element, this.elements)
  }

  createLoader() {
    each(this.elements.images, (element) => {
      const image = new Image()

      image.onload = (_) => this.onAssetLoaded(image)
      image.src = element.getAttribute('data-src')
    })
  }

  onAssetLoaded(image) {
    this.length++
    const percent = this.length / this.elements.images.length

    this.elements.number.textContent = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      this.onLoaded()
    }
  }

  onLoaded() {
    this.emit('complete')

    return new Promise((resolve) => {
      this.animateOut = gsap.timeline()
      this.animateOut.to(this.element, {
        autoAlpha: 0,
        onComplete: this.emit('complete')
      })
    })
  }

  destroy() {
    this.element.parentNode.removeChild(this.element)
  }
}
