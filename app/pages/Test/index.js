import Page from '../../classes/Page'

export default class Test extends Page {
  constructor() {
    super({
      id: 'test',
      element: '.test',
      elements: {}
    })

    this.create()
  }
}
