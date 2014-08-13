var moment = require('moment')
  , assert = require('chai').assert
  , wikipedia = require('../lib/wikipedia')
  , groupByWeek = wikipedia.groupByWeek
  , sumWeek = wikipedia.sumWeek
  , lazy = require('lazy.js')
  , fs = require('fs')
  , JSONStream = require('JSONStream')

describe('wikipedia', function () {
  var data = [
    { date: moment('2014-08-04'), value: 1}, // Monday week 1
    { date: moment('2014-08-05'), value: 2}, // Tuesday week 1
    { date: moment('2014-08-10'), value: 3}, // Sunday week 2
    { date: moment('2014-08-13'), value: 4}, // Wednesday week 2
    { date: moment('2014-08-14'), value: 5}, // Thursday week 2
    { date: moment('2014-08-15'), value: 6}, // Friday week 2
    { date: moment('2014-08-16'), value: 7}  // Saturday week 2
  ]

  describe('groupByWeek', function () {
    it ('groups all items by the first day of their week (Sunday)', function () {
      var results = lazy(data).groupBy(groupByWeek)

      var week1 = results.get('2014-08-03')
      assert.sameMembers(lazy(week1).pluck('value').toArray(), [1, 2])

      var week2 = results.get('2014-08-10')
      assert.sameMembers(lazy(week2).pluck('value').toArray(), [3,4,5,6,7])
    })
  })

  describe('sumWeek', function () {
    it('sums up the entire week into a single record', function () {
      var results = lazy(data)
        .groupBy(groupByWeek)
        .map(sumWeek)
        .toArray()

      assert.equal(results.length, 2)

      var week1 = results[0]
      assert.equal(week1.value, 3)

      var week2 = results[1]
      assert.equal(week2.value, 25)
    })
  })

  it('combines and sums up everything properly', function (done) {
    var data = fs.readFileSync(__dirname + '/wikipedia-data.json').toString()

    var results = wikipedia.process(JSON.parse(data))
      .toArray()

    assert.equal(results.length, 2)

    var week1 = results[0]
    assert(moment('2014-08-03').isSame(week1.date))
    assert.equal(week1.value, 3)

    var week2 = results[1]

    done()

  })
})