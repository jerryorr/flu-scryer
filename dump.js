var google = require('./lib/google')
  , wikipedia = require('./lib/wikipedia')
  , moment = require('moment')
  , _ = require('lodash')

var startDate = moment('2011-09-01')
var filterStartDate = function (data) {
  return data.date.isSame(startDate) || data.date.isAfter(startDate)
}


var async = require('async')

// TODO put this all in a module
async.parallel({
    google: function (cb) {
      google('United States', cb)
    },
    wikipedia: function (cb) {
      wikipedia(cb)
    },
  },
  function (err, results) {
    if (err) {
      return console.log('err: ', err)
    }
    console.log('Date,Google Flu Trends,Wikipedia')

    var google = results.google.map(function (item) {
        return _.extend({ source: 'google'}, item)
      })
      .filter(filterStartDate)


    var wikipedia = results.wikipedia.map(function (item) {
        return _.extend({ source: 'wikipedia'}, item)
      })
      .filter(filterStartDate)

    // TODO now I need to scale!

    google.union(wikipedia)
      .groupBy(function (item) {
        return item.date.format('YYYY-MM-DD')
      })
      .map(function (items, key) {
        // console.log('items: ', items)
        return {
          date: key,
          // TODO *10 was a quick scaling hack
          google: _.find(items, function (item) { return item.source === 'google'}).value * 10,
          wikipedia: _.find(items, function (item) { return item.source === 'wikipedia'}).value,
        }
      })
      .each(function (item) {
        console.log(item.date, ',', item.google, ',', item.wikipedia)
      })
  })

