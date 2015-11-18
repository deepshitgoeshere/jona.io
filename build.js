const Metalsmith = require('metalsmith')
const MJade = require('metalsmith-jade')

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
