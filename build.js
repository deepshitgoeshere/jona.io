const Metalsmith = require('metalsmith')
const express = require('express')
const moment = require('moment')
const Jade = require('metalsmith-jade')
const Sass = require('metalsmith-sass')
const Permalinks = require('metalsmith-permalinks')
const Collections = require('metalsmith-collections')
const Markdown = require('metalsmith-markdown')
const Layouts = require('metalsmith-layouts')
const Pagination = require('metalsmith-pagination')

const path = require('path')

// The core pipeline. This is the portion of the page you see when visiting the
// index. It's basically just Jade files.
const core = Metalsmith(path.join(__dirname, 'core'))
  .source('./')
  .destination('../build')
  .use(Jade({
    pretty: true
  }))
  .use(Permalinks({
    pattern: ':title'
  }))
  .build(err => {
    if (err) { throw new Error(err) }
  })

// The styles pipeline. I need a separate one because the styles are global,
// they're not pipeline-specific. Bundles up SCSS files and pipes them (or IT)
// into ./build/css.
const styles = Metalsmith(path.join(__dirname, 'styles'))
  .source('./')
  .destination('../build/css')
  .use(Sass())
  .build(err => {
    if (err) { throw new Error(err) }
  })

const blog = Metalsmith(path.join(__dirname, 'blog'))
  .source('./')
  .destination('../build/blog')
  .use(Collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(Pagination({
    'collections.posts': {
      perPage: 4,
      layout: 'pagination.jade',
      first: 'index.html',
      path: 'index.html'
    }
  }))
  .use(Markdown())
  .use(dateFormat())
  .use(Layouts({
    engine: 'jade',
    default: 'post.jade',
    directory: '../layouts'
  }))
  .use(Permalinks({
    pattern: ':short'
  }))
  .build(err => {
    if (err) { throw new Error(err) }
  })

function dateFormat () {
  return (files, metalsmith, done) => {
    files['index.html'].pagination.files.forEach(c => {
      c.sdate = moment(c.date).fromNow()
    })
    done()
  }
}

// Spin up a small Express server that just serves the compiled files as static
// directory. This is required because of the SSL redirection middleware (which
// will come later).
const app = express()

app.use(express.static(path.join(__dirname, 'build')))

app.listen(process.env['PORT'] || 3030)
