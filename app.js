require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const port = 3000

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
app.use(function (req, res, next) {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_API_ENDPOINT,
    linkResolver: linkResolver
  }
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM
  next()
})

app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res) => {
  initApi(req).then((api) => {
    api
      .query(
        Prismic.Predicates.any('document.type', ['preloader', 'index_page'])
      )
      .then((response) => {
        const { results } = response
        const [page, preloader] = results

        console.log(preloader, page)
        res.render('index', {
          preloader,
          page,
          meta: { description: 'desc', title: 'yolo' }
        })
      })
  })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
