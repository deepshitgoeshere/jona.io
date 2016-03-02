const Metalsmith = require('metalsmith')
const Jade = require('metalsmith-jade')
const Sass = require('metalsmith-sass')
const Permalinks = require('metalsmith-permalinks')
const Metadata = require('metalsmith-metadata')

const express = require('express')
const path = require('path')

// The core pipeline. This is the portion of the page you see when visiting the
// index. It's basically just Jade files.
const main = Metalsmith(path.join(__dirname, 'main'))
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

const resume = Metalsmith(path.join(__dirname, 'resume'))
  .source('./')
  .destination('../build/resume')
  .use(Metadata({
    me: 'metadata.yml'
  }))
  .use(Jade({
    pretty: true,
    useMetadata: true
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

// Same with javascript. Separate build pipeline.
const javascripts = Metalsmith(path.join(__dirname, 'javascripts'))
  .source('./')
  .destination('../build/js')
  .build(err => {
    if (err) { throw new Error(err) }
  })

// Spin up a small Express server that just serves the compiled files as static
// directory.
const app = express()
app.use(express.static(path.join(__dirname, 'build')))
app.listen(process.env['PORT'] || 3030)
