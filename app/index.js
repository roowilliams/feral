import './utils/polyfills.js'

import Home from './pages/Home'

class App {
  constructor() {
    console.log('app!')
  }

  createPages() {
    this.pages = {
      home: new Home()
    }
  }
}

new App()
