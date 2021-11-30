import Page from '~/app/classes/Page'
import Words from '~/app/components/Words'
import gsap from 'gsap'

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        proposition: '.proposition',
        blurb: '.blurb'
      }
    })
  }

  create() {
    super.create()
    this.words = new Words()

    this.words.once('trigger', () => {
      this.showProposition()
    })
  }

  showProposition() {
    const { proposition, blurb } = this.elements

    const tl = gsap.timeline()

    tl.to(proposition, {
      autoAlpha: 1
    })
  }
}
