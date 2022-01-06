import Page from '~/app/classes/Page'
import gsap from 'gsap'

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        proposition: '.proposition'
      }
    })
  }

  create() {
    super.create()
  }

  showProposition() {
    const { proposition } = this.elements

    const tl = gsap.timeline()

    tl.to(proposition, {
      autoAlpha: 1
    })
  }
}
