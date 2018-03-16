const { resolve } = require('path')
const { writeJson } = require('fs-extra')
const axios= require('axios')
const _ = require('lodash/fp')
const humps = require('lodash-humps')

var timestamp = new Date().toISOString()
console.log(timestamp)

function getUrl() {
  return `https://randoma11y.com/combos/top`
}
function getSavePath() {
  return resolve(__dirname, 'downloads', `${timestamp}.json`)
}
// This one here is tricky. It returns a function that accepts the final result.
// The pageId is known from the start so that is passed first.
function saveResult() {
  const savePath = getSavePath()
  return (result) => writeJson(savePath, result)
}
// PROCESSING each individual result.
const processResult = _.flow(
  humps, // Because I do this to everything...
  _.pick(['colorOne', 'colorTwo'])
)

// PROCESSING of the entire result.
const processResults = _.flow(
  // The axios module returns many props. `data` is what has the stuff we want here.
  _.get('data'),
  // Using a map function to edit each object in array.
  _.map(processResult)
)

function getSavePage() {
  return axios.get(getUrl())
    .then(processResults)
    .then(saveResult())
    .then(() => console.log('DONE'))
    .catch(console.error)
}

getSavePage()
