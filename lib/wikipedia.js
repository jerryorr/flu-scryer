var Stream = require('stream')
  , request = require('request')
  , JSONStream = require('JSONStream')
  , lazy = require('lazy.js')
  , moment = require('moment')

function fetch (next) {
  // TODO things just aren't working with a stream. I think maybe the groupBy
  // gets messed up because of the async logic.
  // return request('http://www.additiveanalytics.com/solutions/flu_tracker_data')
  //   .pipe(JSONStream.parse([true]))
  request('http://www.additiveanalytics.com/solutions/flu_tracker_data', function (err, response, body) {
    if (err) {
      return next(err)
    }
    next(null, JSON.parse(body))
  })
}

module.exports = function (next) {
  // return process(lazy(fetch()))
  fetch(function (err, data) {
    if (err) {
      return next(err)
    }

    next(null, process(lazy(data)))
  })
}

var process = module.exports.process = function (data) {
  return lazy(data)
    .map(function (item) {
      return {
        date: moment(item.view_date),
        value: item.daily_views
      }
    })
    .groupBy(groupByWeek)
    .map(sumWeek)
}

var groupByWeek = module.exports.groupByWeek = function (item) {
  return sunday(item.date).format('YYYY-MM-DD')
}

var sumWeek = module.exports.sumWeek = function (weekItems) {
  return {
    date: sunday(weekItems[0].date),
    value: lazy(weekItems).sum(function (weekItems) {
      return weekItems.value
    })
  }
}

function sunday (date) {
  return date.clone().day(0)
}
