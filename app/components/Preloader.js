import Component from '../classes/Component'
import each from 'lodash/each'
import gsap from 'gsap'

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.preloader',
      elements: {
        number: '.preloader__number',
        images: document.querySelectorAll('img'),
        paths: document
          .querySelector('.preloader__logo__container')
          .querySelectorAll('.letter')
      }
    })

    this.length = 0

    this.createLoader()
  }

  createLoader() {
    gsap.fromTo(
      '.preloader .letter',
      { y: 100, scale: 0.4, autoAlpha: 0.4 },
      {
        y: 0,
        scale: 1,
        stagger: { amount: '0.2', from: 'center' },
        ease: 'expo.out',
        autoAlpha: 1
      }
    )
    if (this.elements.images.length) {
      each(this.elements.images, (element) => {
        element.onload = () => this.onAssetLoaded(element)
        element.src = element.getAttribute('data-src')
      })
    } else {
      return this.onLoaded()
    }
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
        delay: 1.2
      })
      .call(() => {
        this.emit('complete')
      })
  }

  destroy() {
    this?.element.parentNode.removeChild(this.element)
  }
}
