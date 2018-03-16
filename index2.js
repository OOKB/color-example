const { resolve } = require('path')
const { writeJson } = require('fs-extra')
const axios= require('axios')
const _ = require('lodash/fp')
const humps = require('lodash-humps')

// PROCESSING of the entire result.
const processResults = _.flow(
  _.get('data'),
  humps, // Because I do this to everything...
  _.map(_.pick(['colorOne', 'colorTwo']))
)

function getSavePage(pageId) {
  return axios.get(`https://randoma11y.com/combos?page=${pageId}&per_page=50`)
    .then(processResults)
    .then(_.partial(writeJson, [resolve(__dirname, 'downloads', `${pageId}.json`)]))
    .then(() => console.log('DONE'))
    .catch(console.error)
}

getSavePage('1')
