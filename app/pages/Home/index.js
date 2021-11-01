import Page from '../../classes/Page'

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      element: '.home',
      elements: {
        words: '.home__content__words',
        blurb: '.home__content__blurb'
      }
    })

    this.create()
  }
}
