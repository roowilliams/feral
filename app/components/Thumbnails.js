import Component from '../classes/Component'
import gsap from 'gsap'
import mousePosition from 'mouse-position'

export default class Thumbnails extends Component {
  constructor() {
    super({
      element: '.home__content__words',
      elements: {
        words: document.querySelectorAll('.home__content__words__word')
      }
    })

    this.mouse = mousePosition()
    this.timeout = 1000

    this.createThumbnails()
  }

  createThumbnails() {
    let content = this.element.innerHTML

    // words comes from the pug template
    window.WORDS.forEach((word) => {
      var re = new RegExp(word.data.word, 'g')
      let w = word.data.word

      content = content.replace(re, () => {
        return `<a class="home__content__words__word" id="word--${w.replace(
          /\s+/g,
          '_'
        )}" data-for="${w.replace(/\s+/g, '_')}" href="/world/${w.replace(
          /\s+/g,
          '_'
        )}">${w}</a>`.toLowerCase()
      })
    })

    this.element.innerHTML = content

    this.createAnimations()
  }

  createAnimations() {
    this.elements.words = document.querySelectorAll(
      '.home__content__words__word'
    )

    this.elements.words.forEach((word) => {
      const worldId = word.getAttribute('data-for')
      const imageId = `image--${worldId}`
      const imageDiv = document.getElementById(imageId)
      // let hovered = false
      // let interval = null

      word.addEventListener('mouseover', (e) => {
        this.animateIn(imageDiv)
        // hovered = true
        // interval = setTimeout(() => {
        //   hovered && window.location
        // }, this.timeout)
      })

      word.addEventListener('mouseout', (e) => {
        this.animateOut(imageDiv)
        // hovered = false
        // clearTimeout(interval)
      })
    })
  }

  animateIn(el) {
    this.tl = gsap.timeline()
    this.tl
      .set(el, {
        x: this.mouse[0] - 200,
        y: this.mouse[1] - 113,

        height: 226,
        width: 400,
        scale: 0.01
      })
      .set(el.firstChild, {
        autoAlpha: 1
      })
      .to(el, {
        x: this.mouse[0] + window.innerWidth / 12,
        y: this.mouse[1] - 113,
        ease: 'expo.in',
        scale: 0.4,
        duration: 0.4
      })
      .to(el, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        ease: 'expo.out'
      })
  }

  animateOut(el) {
    this.tl
      .to(el, {
        x: this.mouse[0],
        y: this.mouse[1],
        ease: 'expo.in',
        duration: 0.2
      })
      .to(el, {
        scale: 0,
        ease: 'expo.out',
        duration: 0.2
      })
  }
}
