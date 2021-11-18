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
    console.log(words)
    // words comes from the pug template
    words.forEach((word) => {
      var re = new RegExp(word.data.word, 'g')
      let w = word.data.word

      content = content.replace(re, () => {
        return `<span class="home__content__words__word" id="word--${w.replace(
          /\s+/g,
          '_'
        )}" data-for="${w.replace(/\s+/g, '_')}">${w}</span>`.toLowerCase()
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
      let hovered = false
      let interval = null

      word.addEventListener('mouseover', (e) => {
        this.animateIn(imageDiv)
        hovered = true
        interval = setTimeout(() => {
          hovered && this.emit('show', worldId)
        }, this.timeout)
      })

      word.addEventListener('mouseout', (e) => {
        hovered = false
        clearTimeout(interval)
        this.animateOut(imageDiv)
      })
    })
  }

  animateIn(el) {
    let tl = gsap.timeline()
    tl.set(el, {
      x: this.mouse[0],
      y: this.mouse[1],

      height: 226,
      width: 400,
      scale: 0.1
    })
      .set(el.firstChild, {
        autoAlpha: 1
      })
      .to(el, {
        x: this.mouse[0] + window.innerWidth / 8,
        ease: 'expo.out',
        duration: 0.2
      })
      .to(el, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.2,
        ease: 'expo.out'
      })
  }

  animateOut(el) {
    let tl = gsap.timeline()
    tl.to(el, {
      x: this.mouse[0],
      y: this.mouse[1],
      ease: 'expo.out',
      duration: 0.2
    }).to(el, {
      scale: 0,
      ease: 'expo.out',
      duration: 0.2
    })
  }
}
