import Component from '../classes/Component'
import gsap from 'gsap'
import mousePosition from 'mouse-position'

export default class Words extends Component {
  constructor() {
    super({
      element: '.content__words',
      elements: {
        words: null,
        triggerWord: null,
        timerDiv: document.querySelector('.timer-div'),
        clipPath: null
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
  }

  async addEventListeners() {
    if (!document.querySelector('#trigger-word')) await this.createTriggers()

    this.elements.words = document.querySelectorAll('.words__word')
    this.elements.triggerWord = document.querySelector('#trigger-word')
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
      this.showTimer(e)
      interval = setTimeout(() => {
        hovered && this.emit('trigger')
      }, this.timeout)
    })

    triggerWord.addEventListener('mouseout', (e) => {
      hovered = false
      this.hideTimer()
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

  async showTimer(e) {
    this.elements.triggerWord.addEventListener('mousemove', (e) =>
      this.onMouseMove(e)
    )

    gsap.fromTo(
      this.elements.timerDiv,
      {
        left: e.pageX - gsap.getProperty(this.elements.timerDiv, 'width') / 2,
        top: e.pageY - gsap.getProperty(this.elements.timerDiv, 'height') / 2,
        scale: 0.1
      },
      { scale: 1, duration: 0.3, ease: 'expo.out' }
    )

    // radial wipe
    var RAD = Math.PI / 180
    var PI_2 = Math.PI / 2

    var arc = {
      start: 0,
      end: 0,
      cx: 50,
      cy: 50,
      r: 15
    }

    this.timerTimeline = gsap
      .timeline({
        paused: true,
        onUpdate: updatePath
      })
      .to(arc, {
        duration: this.timeout / 1000,
        end: 360
      })
      .to(this.elements.timerDiv, { scale: 0, ease: 'expo.out' })

    this.timerTimeline.play()

    let clipPath = document.querySelector('#arcPath')
    clipPath = document.querySelector('#arcPath')

    function updatePath() {
      clipPath.setAttribute(
        'd',
        getPath(arc.cx, arc.cy, arc.r, arc.start, arc.end)
      )
    }

    function getPath(cx, cy, r, a1, a2) {
      var delta = a2 - a1
      if (delta === 360) {
        return (
          'M ' +
          (cx - r) +
          ' ' +
          cy +
          ' a ' +
          r +
          ' ' +
          r +
          ' 0 1 0 ' +
          r * 2 +
          ' 0 a ' +
          r +
          ' ' +
          r +
          ' 0 1 0 ' +
          -r * 2 +
          ' 0z'
        )
      }

      var largeArc = delta > 180 ? 1 : 0

      a1 = a1 * RAD - PI_2
      a2 = a2 * RAD - PI_2

      var x1 = cx + r * Math.cos(a2)
      var y1 = cy + r * Math.sin(a2)

      var x2 = cx + r * Math.cos(a1)
      var y2 = cy + r * Math.sin(a1)

      return (
        'M ' +
        x1 +
        ' ' +
        y1 +
        ' A ' +
        r +
        ' ' +
        r +
        ' 0 ' +
        largeArc +
        ' 0 ' +
        x2 +
        ' ' +
        y2 +
        ' L ' +
        cx +
        ' ' +
        cy +
        'z'
      )
    }
  }

  async hideTimer() {
    this.timerTimeline.clear()
    await gsap.to(this.elements.timerDiv, {
      scale: 0,
      duration: 0.3,
      ease: 'expo.out'
    })
    this.elements.triggerWord.removeEventListener('mousemove', (e) =>
      this.onMouseMove(e)
    )
  }

  onMouseMove(e) {
    gsap.to(this.elements.timerDiv, {
      left: e.pageX - gsap.getProperty(this.elements.timerDiv, 'width') / 3.2,
      top: e.pageY - gsap.getProperty(this.elements.timerDiv, 'height') / 1.4,
      duration: 0.3
    })
  }
}
