import Component from '../classes/Component'
import each from 'lodash/each'
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
        )}" data-for="image--${w.replace(
          /\s+/g,
          '_'
        )}">${w}</span>`.toLowerCase()
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
      const imageId = word.getAttribute('data-for')
      const imageDiv = document.getElementById(imageId)
      const tl = gsap.timeline()

      word.addEventListener('mouseover', (e) => {
        tl.set(imageDiv, {
          x: this.mouse[0],
          y: this.mouse[1],

          height: 226,
          width: 400,
          scale: 0.1
        })
          .set(imageDiv.firstChild, {
            autoAlpha: 1
          })
          .to(imageDiv, {
            x: this.mouse[0] + window.innerWidth / 8,
            ease: 'expo.out',
            duration: 0.2
          })
          .to(imageDiv, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.2,
            ease: 'expo.out'
          })
      })

      word.addEventListener('mouseout', (e) => {
        tl.to(imageDiv, {
          x: this.mouse[0],
          y: this.mouse[1],
          ease: 'expo.out',
          duration: 0.2
        }).to(imageDiv, {
          scale: 0,
          ease: 'expo.out',
          duration: 0.2
        })
      })
      // word.onmouseover((event) => console.log(event))
    })
  }

  animateIn() {}

  animateOut() {}
}
