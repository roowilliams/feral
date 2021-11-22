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
    this.addEventListeners()
  }

  show(worldId) {
    let world = document.querySelector(`#world--${worldId}`)
    let tl = gsap.timeline()

    tl.to(world, {
      bottom: 0,
      ease: 'expo.out',
      duration: 0.5
    })

    world.classList.add('active')
  }

  hide() {
    let world = document.querySelector('.worlds__world.active')

    let tl = gsap.timeline()

    tl.to(world, {
      bottom: '-100vh',
      ease: 'expo.out',
      duration: 0.5
    })

    world.classList.remove('active')
  }

  addEventListeners() {
    this.elements.closeControls = document.querySelectorAll(
      '.world__close__control'
    )

    this.elements.closeControls.forEach((control) => {
      control.addEventListener('mouseover', (e) => {
        this.hide()
      })
    })
  }
}
