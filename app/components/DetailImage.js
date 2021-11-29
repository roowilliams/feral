import Component from '../classes/Component'
import gsap from 'gsap'

export default class DetailImage extends Component {
  constructor() {
    super({
      element: '.feature_details_wrapper',
      elements: {
        image: document.querySelector('.feature_details__image'),
        caption: document.querySelector('.details__caption')
      }
    })
    console.log(this.elements.image)
    this.tl = gsap.timeline()

    this.tl.to(this.elements.image, {
      scale: 0.8
    })
  }

  onMouseOver() {
    console.log('mo')
    this.tl.play()
  }

  onMouseOut() {
    this.tl.reverse()
  }

  addEventListeners() {
    this.element.addEventListener('mouseover', () => this.onMouseOver)
    this.element.addEventListener('mouseleave', () => this.onMouseOut)
  }
}
