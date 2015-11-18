const Metalsmith = require('metalsmith')
const MJade = require('metalsmith-jade')
const MSass = require('metalsmith-sass')

const path = require('path')

const core = Metalsmith(path.join(__dirname, 'core'))
  .source('./')
  .destination('../build')
  .use(MJade({
    pretty: true
  }))
  .build(err => {
    if (err) { throw new Error(err) }
  })

const styles = Metalsmith(path.join(__dirname, 'styles'))
  .source('./')
  .destination('../build/css')
  .use(MSass())
  .build(err => {
    if (err) { throw new Error(err) }
  })
