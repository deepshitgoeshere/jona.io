const Metalsmith = require('metalsmith')
const Jade = require('metalsmith-jade')
const Sass = require('metalsmith-sass')
const Permalinks = require('metalsmith-permalinks')

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
