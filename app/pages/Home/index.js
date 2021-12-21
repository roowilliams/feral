import Page from '~/app/classes/Page'
import Words from '~/app/components/Words'
import gsap from 'gsap'
import Lottie from 'lottie-web'
import * as animationData from '~/assets/libcap.json'

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        proposition: '.proposition',
        blurb: '.blurb',
        lottieDiv: '.lottie'
      }
    })
  }

  create() {
    super.create()
    this.words = new Words()

    this.words.once('trigger', () => {
      this.showProposition()
    })

    var params = {
      container: this.elements.lottieDiv,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animationData
    }

    var anim

    anim = Lottie.loadAnimation(params)
    Lottie.setSpeed(0.2)
  }

  showProposition() {
    const { proposition, blurb } = this.elements

    const tl = gsap.timeline()

    tl.to(proposition, {
      autoAlpha: 1
    })
  }
}
