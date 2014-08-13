var request = require('request')
  , csv = require('csv-stream')
  , stream = require('stream')
  , util = require('util')
  , lazy = require('lazy.js')
  , moment = require('moment')

var fetch = function () {
  return request('http://www.google.org/flutrends/us/data.txt')
    .pipe(new CleanIntro())
    .pipe(csv.createStream({}))
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

module.exports = function (region) {
  return lazy(fetch())
    .map(function (data) {
      return {
        date: moment(data.Date),
        value: parseInt(data[region])
      }
    })
}