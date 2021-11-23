import Page from '~/app/classes/Page'

export default class World extends Page {
  constructor() {
    super({
      id: 'world',
      element: '.world',
      elements: {
        wrapper: '.world__wrapper'
      }
    })
  }

  create() {
    super.create()
  }
}
