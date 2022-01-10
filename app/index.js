import './utils/polyfills.js'
import Preloader from './components/Preloader'

import Home from './pages/Home'
import each from 'lodash/each'

class App {
  constructor() {
    this.createPreloader()
    this.createContent()
    this.createPages()
    this.addLinkListeners()
    this.addEventListeners()
    this.update()
  }

  createPreloader() {
    this.preloader = new Preloader()
    this.preloader.once('complete', () => this.onPreloaded())
  }

  createContent() {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  // createWorlds() {
  //   this.worlds = new Worlds()
  //   this.preloader.on('show', () => this.onShow())
  // }

  createPages() {
    this.pages = {
      home: new Home()
    }

    this.page = this.pages[this.template]
    this.page.create()
  }

  async onPreloaded() {
    this.preloader.destroy()
    await this.page.show()
    this.onResize()
  }

  // Events

  onPopState() {
    this.onNavigate({
      url: window.location.pathname,
      push: false
    })
  }

  async onNavigate({ url, push = true }) {
    await this.page.hide()

    const request = await window.fetch(url)

    if (request.status === 200) {
      const html = await request.text()
      const div = document.createElement('div')
      div.innerHTML = html

      if (push) {
        window.history.pushState({}, '', url)
      }

      const divContent = div.querySelector('.content')
      this.template = divContent.getAttribute('data-template')
      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.page = this.pages[this.template]

      this.page.create()
      await this.page.show()

      this.onResize()
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

  isExternal(url) {
    return !(
      location.href
        .replace('http://', '')
        .replace('https://', '')
        .split('/')[0] ===
      url.replace('http://', '').replace('https://', '').split('/')[0]
    )
  }
  // Listeners
  addLinkListeners() {
    const links = document.querySelectorAll('a')

    each(links, (link) => {
      link.onclick = (event) => {
        if (this.isExternal(link.href)) return

        event.preventDefault()
        const { href } = link
        this.onNavigate({ url: href })
      }
    })
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.onResize())
    window.addEventListener('popstate', () => onPopState())
  }
}

new App()
