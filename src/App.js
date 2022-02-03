import './styles/main.css'

import ACTListener from './ACTListener'
import parseMessage from './parseMessage'
import uiControl from './uiControl'
import initialSettings from '../resources/settings.json'

// const getLanguage = async () => {
//   const language = await callOverlayHandler({ call: 'getLanguage' })
//   console.log(language)
// }

const checkSettings = (settings) => {
  try {
    if (Object.keys(initialSettings).some((key) => {
      if (typeof settings[key] !== typeof initialSettings[key]) {
        return true
      }
      return false
    })) {
      console.warn('kagami: some of settings fields are invalid.')
      return false
    }
    return true
  }
  catch {
    // localStorage settings has error
    console.warn('kagami: some of settings fields are missing')
    return false
  }
}
let settings = null
const initializeSettings = () => {
  settings = initialSettings
  localStorage.removeItem('kagami')
  localStorage.setItem('kagami', JSON.stringify(initialSettings))
}
try {
  console.log('kagami: trying to load settings...')
  settings = JSON.parse(localStorage.getItem('kagami'))
  console.table(settings)

  if (settings === null) {
    console.log('kagami: initialize settings.')
    initializeSettings()
  }
  else if (!checkSettings(settings)) {
    console.log('kagami: reset settings.')
    initializeSettings()
  }
}
catch {
  console.log('kagami: corrupt settings')
  initializeSettings()
}

console.table(settings)

window.addEventListener('load', () => {
  uiControl(settings)
  ACTListener(parseMessage)
})
