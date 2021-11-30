import Component from '../classes/Component'
import gsap from 'gsap'
import mousePosition from 'mouse-position'
export default class Thumbnails extends Component {
  constructor() {
    super({
      element: '.content__words',
      elements: {
        trigger: null
      }
    })

    this.mouse = mousePosition()
    this.timeout = 1000

    this.createTriggers()
  }

  createTrigger() {
    // find feral in words
    // add a span
    let content = this.element.innerHTML

    // words comes from the pug template
    window.CONFIG.forEach((word) => {
      var re = new RegExp(word.data.word, 'g')
      let w = word.data.word

      content = content.replace(re, () => {
        return `<a class="words__word" id="word--${w
          .replace(/\s+/g, '_')
          .toLowerCase()}" data-for="${w
          .replace(/\s+/g, '_')
          .toLowerCase()}" href="/world/${w
          .replace(/\s+/g, '_')
          .toLowerCase()
          .toLowerCase()}">${w}</a>`
      })
    })

    this.element.innerHTML = content

    this.createAnimations()
  }
}
