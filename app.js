require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const find = require('lodash/find')
const filter = require('lodash/filter')

const Prismic = require('@prismicio/client')
var PrismicDOM = require('prismic-dom')

// Link Resolver
function linkResolver(doc) {
  // Define the url depending on the document type
  if (doc.type === 'page') {
    return '/page/' + doc.uid
  } else if (doc.type === 'blog_post') {
    return '/blog/' + doc.uid
  }

  // Default to homepage
  return '/'
}

function initApi(req) {
  return Prismic.getApi(process.env.PRISMIC_API_ENDPOINT, {
    req: req
  })
}

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_API_ENDPOINT,
    linkResolver: linkResolver
  }
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM
  next()
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('tiny'))

app.set('view engine', 'pug')

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const { results } = await api.query(
    Prismic.Predicates.any('document.type', [
      'preloader',
      'index_page',
      'word_page'
    ]),
    { orderings: '[my.word_page.order]' }
  )

  const preloader = find(results, { type: 'preloader' })
  const page = find(results, { type: 'index_page' })
  const words = filter(results, { type: 'word_page' })

  res.render('pages/home', {
    preloader,
    page,
    words,
    meta: { description: 'desc', title: 'yolo' }
  })
})

app.get('/test', async (req, res) => {
  res.render('pages/test', {
    meta: { description: 'desc', title: 'yolo' }
  })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
