import Component from '../classes/Component'
import gsap from 'gsap'
import mousePosition from 'mouse-position'

export default class Words extends Component {
  constructor() {
    super({
      element: '.content__words',
      elements: {
        words: null,
        triggerWord: null
      }
    })

    this.mouse = mousePosition()
    this.timeout = 1000
  }

  createTriggers() {
    let content = this.element.innerHTML
    let triggerWord = CONFIG.trigger_word

    // WORDS and CONFIG come from the pug template
    WORDS.forEach((word) => {
      var re = new RegExp(word.data.word, 'g')
      let w = word.data.word

      content = content.replace(
        re,
        () =>
          `<a class="words__word" id="word--${w
            .replace(/\s+/g, '_')
            .toLowerCase()}" data-for="${w
            .replace(/\s+/g, '_')
            .toLowerCase()}" href="/world/${w
            .replace(/\s+/g, '_')
            .toLowerCase()
            .toLowerCase()}">${w}</a>`
      )
    })

    content = content.replace(
      triggerWord,
      () => `<span id="trigger-word">${triggerWord}</span>`
    )
    this.element.innerHTML = content

    this.elements.words = document.querySelectorAll('.words__word')
    this.elements.triggerWord = document.querySelector('#trigger-word')
  }

  async addEventListeners() {
    await this.createTriggers()

    const { words, triggerWord } = this.elements
    words.forEach((word) => {
      const worldId = word.getAttribute('data-for')
      const imageId = `image--${worldId}`
      const imageDiv = document.getElementById(imageId)

      word.addEventListener('mouseover', (e) => {
        this.animateThumbsIn(imageDiv)
      })

      word.addEventListener('mouseout', (e) => {
        this.animateThumbsOut(imageDiv)
      })
    })

    let interval = {}
    let hovered = false
    triggerWord.addEventListener('mouseover', (e) => {
      hovered = true
      interval = setTimeout(() => {
        hovered && this.emit('trigger')
      }, this.timeout)
    })

    triggerWord.addEventListener('mouseout', (e) => {
      hovered = false
      clearTimeout(interval)
    })
  }

  animateThumbsIn(el) {
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
        x: this.mouse[0] + window.innerWidth / 18,
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

  animateThumbsOut(el) {
    this.tl
      .to(el, {
        x: this.mouse[0],
        y: this.mouse[1] - 113,
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
