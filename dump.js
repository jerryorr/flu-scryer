var google = require('./lib/google')
  , wikipedia = require('./lib/wikipedia')
  , moment = require('moment')

var startDate = moment('2012-01-01')
var filterStartDate = function (data) {
  return data.date.isSame(startDate) || data.date.isAfter(startDate)
}

// var result = google('United States')
//   // .filter(function (data) {
//   //   data.
//   // })
//   .filter(filterStartDate)
//   .take(54)
//   .map(function (data) {
//     return {
//       value: data.value,
//       date: data.date.format()
//     }
//   })
// // console.log(result.value())
// result.each(function (data) {
//   console.log(data)
// })

// var result2 = wikipedia()
  // .filter(filterStartDate)
  // .take(5)
  // .map(function (data) {
  //   return {
  //     value: data.value,
  //     date: data.date.format()
  //   }
  // })
// console.log(result2.value())
// result2.each(function (data) {
//   console.log(data)
// })
wikipedia(function (err, result) {
  if (err) {
    return console.log(err)
  }
  // console.log('result: ', result)

  console.log('Date,Vists')
  result
    .map(function (item) {
      return {
        date: item.date.format('YYYY-MM-DD'),
        value: item.value
      }
    })
    .each(function (item) {
      console.log(item.date, ',', item.value)
    })
})

// var Lazy = require('lazy.js')
// var array = Lazy.range(1000).toArray();
// function square(x) { return x * x; }
// function inc(x) { return x + 1; }
// function isEven(x) { return x % 2 === 0; }
// var result = Lazy(array).map(square).map(inc).filter(isEven).take(5);

// console.log(result)