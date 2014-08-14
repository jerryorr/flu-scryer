var request = require('request')
  , csv = require('csv-stream')
  , stream = require('stream')
  , util = require('util')
  , lazy = require('lazy.js')
  , moment = require('moment')

var fetch = function (next) {
  // TODO things just aren't working with a stream, so just
  // build an array before processing it
  var data = []
  request('http://www.google.org/flutrends/us/data.txt')
    .pipe(new CleanIntro())
    .pipe(csv.createStream({}))
    .on('data', function (item) {
      data.push(item)
    })
    .on('end', function () {
      next(null, data)
    })
    .on('error', next)
}

function CleanIntro(options) {
  stream.Transform.call(this, options)
}

util.inherits(CleanIntro, stream.Transform)

CleanIntro.prototype._transform = function (chunk, enc, cb) {
  if (this.readingData) {
    this.push(chunk, enc)
  } else {
    // Ignore all text until we find a line beginning with 'Date,''
    var start = chunk.toString().search(/^Date,/m)
    if (start !== -1) {
      this.readingData = true
      this.push(chunk.slice(start), enc)
    }
  }
  cb()
}

module.exports = function (region, next) {
  fetch(function (err, data) {
    if (err) {
      return next(err)
    }

    var results = lazy(data)
      .map(function (data) {
        return {
          date: moment(data.Date),
          value: parseInt(data[region])
        }
      })
    next(null, results)
  })
}