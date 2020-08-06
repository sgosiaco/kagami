import previewActions from '../resources/preview.json'
import { setLanguage, updateUi } from './lang';
import { appendErrorIcon, updateCheckPositional, updatePetValidation } from './handleAction'

const { updateSpeed, updateScale } = require('./handleAction');

const skillDisplayer = document.getElementsByClassName('skilldisplayer')
const aaWindow = document.getElementsByClassName('auto-attack-window')
const playerActionsWindow = document.getElementById('player-actions-window')
const petActionsWindow = document.getElementsByClassName('pet-actions-window')

const header = document.getElementById('header')
const slider = document.getElementById('slider')
// const mainContainer = document.getElementById('main-container')

const settingsContainer = document.getElementById('settings-container')
const pinHeaderChecker = document.getElementById('pin-header-button')
const settingsChecker = document.getElementById('settings-button')
const settingsAAWindow = document.getElementById('settings-aa-window')
const settingsPlayerActionWindow = document.getElementById('settings-player-window')
const settingsPetActionWindow = document.getElementById('settings-pet-window')

const languageForm = document.getElementById('lang-form')
const aaWindowChecker = document.getElementById('auto-attack-switch')
const petActionsChecker = document.getElementById('pet-actions-switch')
const positionalChecker = document.getElementById('positional-switch')
const validatePetChecker = document.getElementById('validate-pet-switch')
const displayTimeForm = document.getElementById('speed-form')
const scaleForm = document.getElementById('scale-form')
let settings = null
let previewTimeouts = []

const cleanupPreview = () => {
  previewTimeouts.filter((timeout) => clearTimeout(timeout))
  previewTimeouts = []
  settingsAAWindow.innerHTML = ''
  settingsPlayerActionWindow.innerHTML = ''
  settingsPetActionWindow.innerHTML = ''
}
const animatePreview = () => {
  cleanupPreview()

  const checkPositional = settings['check-positionals']
  previewActions['auto-attacks'].timing.forEach((aaTiming) => {
    previewTimeouts.push(setTimeout(() => {
      settingsAAWindow.insertAdjacentHTML('beforeend', previewActions['auto-attacks'].element)
      settingsAAWindow.lastChild.animate(
        {
          right: [0, '100%'],
          visibility: ['visible', 'visible']
        },
        {
          duration: settings['display-time'] * 1000,
          iterations: 1,
        }
      )
    }, aaTiming * 1000))
  })
  previewActions['player-actions'].forEach((action) => {
    const castingBarLength = (action.castTime / (settings['display-time'] * settings['scale'])) * 100;
    previewTimeouts.push(setTimeout(() => {
      settingsPlayerActionWindow.insertAdjacentHTML('beforeend', action.element)
      const icon = settingsPlayerActionWindow.lastChild
      icon.firstChild.style.paddingRight = `${castingBarLength}vw`
      if (checkPositional && action.classes.includes('mispositional')) {
        appendErrorIcon(icon, 'mispositional')
      }
      icon.animate(
        {
          right: [`-${castingBarLength}vw`, '100%'],
          visibility: ['visible', 'visible']
        },
        {
          duration: 1000 * (settings['display-time'] + action.castTime),
          iterations: 1,
        }
      )
    }, action.timing * 1000))
  })
  previewActions['pet-actions'].timing.forEach((aaTiming, index) => {
    previewTimeouts.push(setTimeout(() => {
      settingsPetActionWindow.insertAdjacentHTML('beforeend', previewActions['pet-actions'].element)
      const icon = settingsPetActionWindow.lastChild
      icon.animate(
        {
          right: [0, '100%'],
          visibility: ['visible', 'visible']
        },
        {
          duration: settings['display-time'] * 1000,
          iterations: 1,
        }
      )
      if (settings['validate-pet-actions'] && index === 0) {
        setTimeout(() => {
          appendErrorIcon(icon, 'interrupted')
        }, 4000)
      }
    }, aaTiming * 1000))
  })
}
const saveSettings = () => {
  localStorage.setItem('kagami', JSON.stringify(settings))
}
const changeLang = (lang) => {
  setLanguage(lang)
  updateUi()
}
const changeDisplayTime = (time) => {
  Array.from(aaWindow).forEach((window) => { window.innerHTML = '' })
  playerActionsWindow.innerHTML = ''
  Array.from(petActionsWindow).forEach((window) => { window.innerHTML = '' })
  updateSpeed(time)
}
const changeScale = (scale) => {
  Array.from(skillDisplayer).forEach((window) => {
    window.style.zoom = scale
  })
  Array.from(aaWindow).forEach((window) => { window.innerHTML = '' })
  playerActionsWindow.innerHTML = ''
  Array.from(petActionsWindow).forEach((window) => { window.innerHTML = '' })
  updateScale(scale)
}

const applySettings = () => {
  if (!settings['pin-header']) {
    pinHeaderChecker.checked = false
    header.classList.remove('pinned')
  }
  if (!settings['aa-window-show']) {
    aaWindowChecker.checked = false
    Array.from(aaWindow).forEach((window) => {
      window.classList.add('hide')
    })
  }
  if (!settings['pet-actions-show']) {
    petActionsChecker.checked = false
    Array.from(petActionsWindow).forEach((window) => {
      window.classList.add('hide')
    })
  }
  languageForm['lang-radio'].value = settings['lang']
  displayTimeForm['speed-radio'].value = settings['display-time']
  scaleForm['scale-radio'].value = settings['scale']
  changeDisplayTime(settings['display-time'])
  changeScale(settings['scale'])
  changeLang(settings['lang'])
}

const headerMenu = () => {
  settingsChecker.addEventListener('click', (e) => {
    slider.classList.toggle('settings')
    settingsContainer.classList.toggle('hide')
    if (e.target.checked) animatePreview()
  })
  pinHeaderChecker.addEventListener('click', (e) => {
    header.classList.toggle('pinned')
    settings['pin-header'] = e.target.checked
    saveSettings()
  })
}

const uiControl = (param) => {
  settings = param
  applySettings()
  headerMenu()
  document.getElementById('reset-encounter').addEventListener('click', () => {
    window.OverlayPluginApi.endEncounter();
  })
  languageForm.addEventListener('change', (e) => {
    const lang = e.target.value
    changeLang(lang)
    settings['lang'] = lang
    saveSettings()
  })
  aaWindowChecker.addEventListener('click', (e) => {
    if (e.target.checked) { // show
      Array.from(aaWindow).forEach((window) => {
        window.classList.remove('hide')
        settings['aa-window-show'] = true
        saveSettings()
      })
    }
    else { // hide
      Array.from(aaWindow).forEach((window) => {
        window.classList.add('hide')
        settings['aa-window-show'] = false
        saveSettings()
      })
    }
  })
  petActionsChecker.addEventListener('click', (e) => {
    if (e.target.checked) { // show
      Array.from(petActionsWindow).forEach((window) => {
        window.classList.remove('hide')
        settings['pet-actions-show'] = true
        saveSettings()
      })
    }
    else { // hide
      Array.from(petActionsWindow).forEach((window) => {
        window.classList.add('hide')
        settings['pet-actions-show'] = false
        saveSettings()
      })
    }
  })
  positionalChecker.addEventListener('click', (e) => {
    const { checked } = e.target
    settings['check-positionals'] = checked
    updateCheckPositional(checked)
    animatePreview()
    saveSettings()
  })
  validatePetChecker.addEventListener('click', (e) => {
    const { checked } = e.target
    settings['validate-pet-actions'] = checked
    updatePetValidation(checked)
    animatePreview()
    saveSettings()
  })
  displayTimeForm.addEventListener('change', (e) => {
    const displayTime = parseInt(e.target.value, 10)
    changeDisplayTime(displayTime)
    settings['display-time'] = displayTime
    animatePreview()
    saveSettings()
  })
  scaleForm.addEventListener('change', (e) => {
    const scale = parseFloat(e.target.value)
    changeScale(scale)
    settings['scale'] = scale
    animatePreview()
    saveSettings()
  })
}

export default uiControl
