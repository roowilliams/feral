import Page from '~/app/classes/Page'
import DetailImage from '../../components/DetailImage'

export default class World extends Page {
  constructor() {
    super({
      id: 'world',
      element: '.world',
      elements: {
        wrapper: '.world__wrapper',
        featureDetails: '.feature_details_wrapper'
      }
    })
  }

  create() {
    super.create()

    // this.featureDetails = this.elements.featureDetails.forEach(
    //   (featureDetail) => new DetailImage()
    // )
  }
}
