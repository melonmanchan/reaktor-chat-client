import marked   from 'marked'
import emojione from 'emojione'

function stringArrayToJSON (arr) {
  return arr.map(a => { return JSON.parse(a) })
}

function markdownifyString (str) {
  return marked(str)
}

function emojifyString (str) {
  return emojione.toImage(str)
}

export { stringArrayToJSON, markdownifyString, emojifyString }
