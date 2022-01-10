const morgan = require('morgan')
const express = require('express')
const path = require('path')
const app = express()
const port = 3000
const { cmsEndpoint } = require('./package.json')

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
  return Prismic.getApi(cmsEndpoint, {
    req: req
  })
}

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: cmsEndpoint,
    linkResolver: linkResolver
  }
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM
  next()
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('tiny'))

app.set('view engine', 'pug')

// const handleRequest = async (api) => {
//   // Preload all images & content
//   const home = await api.query(
//     Prismic.Predicates.any('document.type', [
//       'preloader',
//       'index_page',
//       'word_page'
//     ]),
//     { orderings: '[my.word_page.order]' }
//   )

//   const preloader = await api.getSingle('preloader')

//   let assets = []

//   home.data.gallery.forEach(item =>{
//     assets.push(item.image.url);
//   })

//   return {
//     assets,
//     home,
//     preloader
//   }
// }

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const { results } = await api.query(
    Prismic.Predicates.any('document.type', [
      'preloader',
      'index_page',
      'config'
    ])
  )

  const preloader = find(results, { type: 'preloader' })
  const page = find(results, { type: 'index_page' })
  const config = filter(results, { type: 'config' })[0].data

  res.render('pages/home', {
    preloader,
    page,
    config,
    meta: { description: 'desc', title: 'yolo' }
  })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
