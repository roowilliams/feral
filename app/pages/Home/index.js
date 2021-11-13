import Page from '~/app/classes/Page'

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        words: '.home__content__words',
        images: document.querySelectorAll('.home__content__words__word__image')
      }
    })

    this.create()
  }
}
