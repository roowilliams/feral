import './utils/polyfills.js'
import Preloader from './components/Preloader.js'
import Thumbnails from './components/Thumbnails.js'

import Home from './pages/Home'
import Test from './pages/Test'
import each from 'lodash/each'

class App {
  constructor() {
    this.createPreloader()
    this.createContent()
    this.createPages()
    this.createThumbnails()

    this.addLinkListeners()
    this.addEventListeners()
    this.update()
  }

  createPreloader() {
    this.preloader = new Preloader()
    this.preloader.once('complete', () => this.onPreloaded())
  }

  createThumbnails() {
    this.thumbnails = new Thumbnails()
  }

  createContent() {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPages() {
    this.pages = {
      home: new Home(),
      test: new Test()
    }

    this.page = this.pages[this.template]
    this.page.create()
  }

  onPreloaded() {
    this.preloader.destroy()
    this.onResize()
    this.page.show()
  }
  // Events
  async onNavigate(url) {
    await this.page.hide()

    const request = await window.fetch(url)

    if (request.status === 200) {
      const html = await request.text()
      const div = document.createElement('div')
      div.innerHTML = html

      const divContent = div.querySelector('.content')
      this.template = divContent.getAttribute('data-template')
      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.page = this.pages[this.template]

      this.page.create()
      this.onResize()
      this.page.show()

      this.addLinkListeners()
    } else {
      console.log('Error', request.status)
    }
  }

  onResize() {
    this.page?.onResize()
  }

  // Loop
  update() {
    this.page?.update()

    this.frame = window.requestAnimationFrame(() => this.update())
  }

  // Listeners
  addLinkListeners() {
    const links = document.querySelectorAll('a')

    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault()
        const { href } = link
        this.onNavigate(href)
      }
    })
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.onResize())
  }
}

new App()
