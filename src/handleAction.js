import actionResource from '../resources/actions/actions.json'
import classjobResources from '../resources/classjob/classjob.json'
import autoAttackIcon from '../resources/actions/000101.png'
import { lang } from './lang';

const option = {
  displayTime: 10,
  scale: 1,
  checkPositional: true,
  validatePetAction: true,
}
const resources = {
  lastTimestamp: -1,
  lastActionID: -1,
  lastCastAction: null,
  positionalActionCount: 0,
  mispositionalCount: 0,
  castingCount: 0,
  interruptedCount: 0,
  pet: {
    actions: [],
    lastCastAction: null,
    count: 0,
    ghostedActionCount: 0,
  },
  samurai: {
    action: null,
    checkPositional: false,
    kenki: 0
  }
}

// job specific values
const monkPositionals = [
  53, // 連撃
  56, // 崩拳
  54, // 正拳突き
  74, // 双竜脚
  61, // 双掌打
  66, // 破砕拳
]
const dragoonPositionals = [
  88,
  79,
  3554,
  3556,
]
const ninjaPositionals = [
  2255, // 旋風刃
  3563, // 強甲破点突
]
const samuraiPositionals = [
  7481, // 月光 23D
  7482, // 花車 43D
]

const reaperPositionals = [
  24382, // Gibbet
  24383, // Gallows
]

export const cleanup = () => {
  resources.lastTimestamp = -1
  resources.lastActionID = -1
  resources.lastCastAction = null
  resources.positionalActionCount = 0
  resources.mispositionalCount = 0
  resources.castingCount = 0
  resources.interruptedCount = 0
  resources.pet.ghostedActionCount = 0
}
const updateInfo = (classjob) => {
  const updateMispositional = (condition) => {
    if (condition && option.checkPositional) {
      const mispositionalRate = resources.positionalActionCount !== 0 ? ((resources.mispositionalCount / resources.positionalActionCount) * 100).toFixed(0) : 0
      document.getElementById('mispositional').classList.remove('hide')
      document.getElementById('mispositional').innerHTML = `${lang('mispositional')}: ${resources.mispositionalCount}/${resources.positionalActionCount} (${mispositionalRate}%)`
    }
    else document.getElementById('mispositional').classList.add('hide')
  }
  const updatePetInterrupt = (condition) => {
    if (condition && option.validatePetAction) {
      const ghostedRate = resources.pet.count !== 0 ? ((resources.pet.ghostedActionCount / resources.pet.count) * 100).toFixed(0) : 0
      document.getElementById('pet-action').classList.remove('hide')
      document.getElementById('pet-action').innerHTML = `${lang('pet-action')}: ${resources.pet.ghostedActionCount}/${resources.pet.count} (${ghostedRate}%)`
    }
    else document.getElementById('pet-action').classList.add('hide')
  }

  updateMispositional(classjobResources[classjob].includes('mispositional'))
  // updateCasting(classjobResources[classjob].includes('casting'))
  updatePetInterrupt(classjobResources[classjob].includes('pet-action'))
}
export const getPositionalCounts = () => ({ positionalActionCount: resources.positionalActionCount, mispositionalCount: resources.mispositionalCount })
export const updateSpeed = (value) => { option.displayTime = value }
export const updateScale = (value) => { option.scale = value }
export const updateCheckPositional = (value) => {
  option.checkPositional = value
  resources.positionalActionCount = 0
  resources.mispositionalCount = 0
}
export const updatePetValidation = (value) => {
  option.validatePetAction = value
  resources.pet.ghostedActionCount = 0
}

export const appendErrorIcon = (icon, errorClass) => {
  icon.classList.add(errorClass)
  const iconImage = icon.firstChild
  // console.log(icon.classList)

  if (iconImage.classList.contains('casting')) {
    iconImage.style.backgroundColor = 'transparent';
  }

  const errorIcon = document.createElement('i')
  errorIcon.classList.add('material-icons', 'error-icon')
  errorIcon.innerHTML = 'error'
  icon.appendChild(errorIcon)
}

export const unsubscribePet = (petID) => {
  if (option.validatePetAction) {
    resources.pet.actions = resources.pet.actions.filter((action) => {
      if (action.actorID === petID) {
        appendErrorIcon(action.icon, 'interrupted')
        resources.pet.ghostedActionCount++
      }
      return false
    })
  }
}

export const handleHit = (logParameter) => {
  resources.pet.actions = resources.pet.actions.filter((action) => action.hitID !== parseInt(logParameter[2], 16) || !option.validatePetAction)
}

export const handleInterrupt = (primaryCharacter, logParameter, active) => {
  const actionID = parseInt(logParameter[2], 16)
  const inturruptedAction = {
    actionID,
    // actionName: logParameter[3],
    actorID: parseInt(logParameter[0], 16),
    classes: ['interrupted'],
    castTime: 0,
    Image: '',
    CooldownGroup: [0, 0],
    ...actionResource[actionID],
    // actorName: logParameter[1],
  }

  if (inturruptedAction.actorID === primaryCharacter.charID
    && inturruptedAction.actorID === resources.lastCastAction.actorID) {
    resources.interruptedCount++
    appendErrorIcon(resources.lastCastAction.icon, 'interrupted')
    // if (active) updateInfo(primaryCharacter.classjob)
  }
  else if (inturruptedAction.actorID === primaryCharacter.petID
    && inturruptedAction.actorID === resources.pet.lastCasting.actorID) {
    resources.pet.ghostedActionCount++
    appendErrorIcon(resources.pet.lastCasting.icon, 'interrupted')
  }
}

/*
export const handleJobGauge = (primaryCharacter, logParameter, active) => {
  if (parseInt(logParameter[0], 16) === primaryCharacter.charID) {
    if (logParameter[1] === '22') { // sam
      const kenki = parseInt(logParameter[2], 16) & 0xFF
      if (resources.samurai.checkPositional) {
        if (kenki - resources.samurai.kenki !== 10) {
          // samurai mispositional
          appendErrorIcon(resources.samurai.action.icon, 'mispositional')
          resources.mispositionalCount++
          if (active) updateInfo(primaryCharacter.classjob)
        }
        resources.samurai.checkPositional = false
      }
      resources.samurai.kenki = kenki
    }
  }
}
*/

const checkPositional = (action, logParameter) => {
  if (monkPositionals.includes(action.actionID)) {
    // monk rear/flank check
    resources.positionalActionCount++

    return logParameter.slice(8, 22).includes('1B')
  }
  if (dragoonPositionals.includes(action.actionID)) {
    // dragoon rear/flank check
    resources.positionalActionCount++

    const succeedCode = action.actionID === 88 ? '11B' : '1B' // 桜花は11Bにコードが変わる
    return logParameter.slice(8, 22).includes(succeedCode)
  }
  if (ninjaPositionals.includes(action.actionID)) {
    // ninja rear/flank check
    resources.positionalActionCount++

    const succeedCode = '11B'
    return logParameter.slice(8, 22).includes(succeedCode)
  }
  if (action.actionID === 2258) {
    // だまし討ち
    resources.positionalActionCount++

    const succeedCode = '1E71' // 1E710003 1E710203 1E710303
    // failedCode: 00710003 00710203
    return logParameter[6].includes(succeedCode)
  }
  if (samuraiPositionals.includes(action.actionID)) {
    // samurai rear/flank check
    resources.positionalActionCount++
    const succeedCode = '11B'
    const meikyoCode = '4871'
    const noComboCode = '2171'
    return logParameter.slice(8, 22).includes(succeedCode) || logParameter[6].includes(meikyoCode) || logParameter[6].includes(noComboCode)
  }
  if (reaperPositionals.includes(action.actionID)) {
    // reaper rear/flank check
    resources.positionalActionCount++
    const gibbetCode = 'D710'
    const gallowsCode = 'B710'
    return logParameter[6].includes(gibbetCode) || logParameter[6].includes(gallowsCode)
  }

  return true
}

const showActionIcon = (action) => {
  const icon = document.createElement('div')
  icon.classList.add('icon')

  const fetchingIcon = document.createElement('div')
  fetchingIcon.classList.add('spinner', 'flex-row')
  for (let i = 1; i <= 3; i++) {
    const circle = document.createElement('div')
    circle.classList.add(`bounce${i}`)
    fetchingIcon.appendChild(circle)
  }
  icon.appendChild(fetchingIcon)

  const image = new Image()
  image.src = `https://xivapi.com${action.Image}`
  image.classList.add(...action.classes)
  icon.appendChild(image)
  image.addEventListener('load', () => {
    icon.removeChild(fetchingIcon)
  })

  if (action.classes.includes('mispositional')) {
    appendErrorIcon(icon, 'mispositional')
  }
  let castingBarLength = 0
  if (action.classes.includes('casting') && action.castTime !== 0) {
    castingBarLength = (action.castTime / (option.displayTime * option.scale))
    image.style.paddingRight = `${castingBarLength}vw`
  }
  icon.animate(
    {
      right: [`-${castingBarLength}vw`, '100%'],
      visibility: ['visible', 'visible']
    },
    {
      duration: option.displayTime * 1000 + action.castTime * 10,
      iterations: 1,
    }
  )

  return icon
}

const autoAttack = () => {
  const icon = document.createElement('div')
  icon.classList.add('icon')
  const image = new Image()
  image.src = autoAttackIcon
  icon.appendChild(image)
  icon.animate(
    {
      right: [0, '100%'],
      visibility: ['visible', 'visible']
    },
    {
      duration: option.displayTime * 1000,
      iterations: 1,
    }
  )

  document.getElementById('auto-attack-window').appendChild(icon)
  setTimeout(() => {
    try { document.getElementById('auto-attack-window').removeChild(icon) }
    catch { } // ignore error
  }, option.displayTime * 1000)
}

export const handleAction = async (primaryCharacter, logCode, logTimestamp, logParameter, active) => {
  let actionWindow = null
  const actionID = parseInt(logParameter[2], 16)
  const action = {
    timestamp: logTimestamp,
    actionID,
    actionName: logParameter[3],
    actorID: parseInt(logParameter[0], 16),
    hitID: parseInt(logParameter[42], 16),
    // actorName: logParameter[1],
    // targetID: logParameter[4],
    // targetName: logParameter[5],
    classes: [],
    castTime: logCode === '20' ? Math.ceil(parseFloat(logParameter[6]) * 100) : 0,
    icon: null,
    Image: '',
    CooldownGroup: [0, 0],
    ...actionResource[actionID],
  }

  // AoE action will make multiple logs and no duplicate allowed
  if ((action.timestamp === resources.lastTimestamp && action.actionID === resources.lastActionID)) return

  resources.lastTimestamp = action.timestamp
  resources.lastActionID = action.actionID

  // only parse primaryCharacter and pet action
  if (action.actorID === primaryCharacter.charID) {
    actionWindow = document.getElementById('player-actions-window')
    if (action.castTime > 66) action.castTime -= 66
  }
  else if (primaryCharacter.petID === action.actorID) {
    actionWindow = document.getElementById('pet-actions-window')
    if (logCode !== '20') {
      resources.pet.actions.push(action)
      resources.pet.count++
    }
    else {
      resources.pet.lastCasting = action
    }
  }
  else return

  // auto-attack
  if (actionID === 7 || actionID === 8) {
    autoAttack()
    return
  }

  // check invalid actionID
  if (actionID > 29738) { // previously 25885, pvp abilities go up to 29738
    if (actionID > 0x4000000) {
      // mount icons: 59000 ~ 59399 (266 total)
      const mountID = action.actionID & 0xffffff
      action.Image = (await fetch(`https://xivapi.com/mount/${mountID}`)
        .then((res) => res.json())
        .then((json) => json.IconSmall))
    }
    else if (actionID > 0x2000000) {
      // item icons: (30999 total)
      let itemID = actionID & 0xffffff

      // hq item. currently xivapi is not supporting hq item/icons
      if (itemID > 1000000) itemID -= 1000000

      action.Image = (await fetch(`https://xivapi.com/item/${itemID}`)
        .then((res) => res.json())
        .then((json) => json.Icon))
    }
  }
  else {
    // add classes
    const casting = logCode === '20'
    const positional = option.checkPositional ? checkPositional(action, logParameter) : true
    const gcd = action.CooldownGroup.includes(58)
    if (casting) {
      resources.castingCount++
      action.classes.push('casting')
      resources.lastCastAction = action
    }
    if (!positional) {
      action.classes.push('mispositional')
      resources.mispositionalCount++
    }
    if (gcd) action.classes.push('gcd')
    else action.classes.push('ogcd')
  }

  const icon = showActionIcon(action)

  action.icon = icon
  actionWindow.appendChild(icon)
  setTimeout(() => {
    try { actionWindow.removeChild(icon) }
    catch { } // ignore error
  }, option.displayTime * 1000 + action.castTime * 100)
  if (active) updateInfo(primaryCharacter.classjob)
}
