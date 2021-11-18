import Component from '../classes/Component'
import gsap from 'gsap'

export default class World extends Component {
  constructor() {
    super({
      element: '.worlds',
      elements: {}
    })
  }
  createWorlds() {
    // this.elements.worlds = document.querySelectorAll()
  }

  show(worldId) {
    let world = document.querySelector(`#world--${worldId}`)
    let tl = gsap.timeline()

    tl.to(world, {
      bottom: 0,
      ease: 'expo.out',
      duration: 0.2
    })

    console.log(world)
  }

  animateIn(worldId) {}
}
