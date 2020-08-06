// from https://github.com/Rawrington/SkillDisplay/blob/master/src/ACTListener.js
const getHost = () => /HOST_PORT=(wss?:\/\/.+)/.exec(window.location.search);

function listenActWebSocket(callback) {
  const url = new URLSearchParams(window.location.search)
  const wsUri = `${url.get('HOST_PORT')}BeforeLogLineRead` || undefined
  const ws = new WebSocket(wsUri)
  ws.onerror = () => ws.close()
  ws.onclose = () => setTimeout(() => {
    listenActWebSocket(callback)
  }, 1000)
  ws.onmessage = (e) => {
    if (e.data === '.') return ws.send('.')

    const obj = JSON.parse(e.data)
    if (obj.msgtype === 'CombatData') {
      return callback({ type: 'CombatData', message: obj.msg })
    }
    if (obj.msgtype === 'SendCharName') {
      return callback({ type: 'ChangePrimaryPlayer', message: obj.msg })
    }
    if (obj.msgtype === 'Chat') {
      return callback({ type: 'LogLine', message: obj.msg.split('|') })
    }
  }

  return () => {
    ws.close()
  }
}

function listenOverlayPlugin(callback) {
  const listener = (e) => {
    callback(e)
  }

  addOverlayListener('CombatData', (e) => callback({ type: e.type, message: { ...e } }));
  addOverlayListener('LogLine', (e) => callback({ type: 'LogLine', message: [...e.line] }));
  addOverlayListener('ChangePrimaryPlayer', (e) => callback({ type: e.type, message: { ...e } }));
  startOverlayEvents();

  return () => {
    removeOverlayListener('CombatData', listener);
    removeOverlayListener('LogLine', listener);
    removeOverlayListener('ChangePrimaryPlayer', listener);
  }
}

export default function listenToACT(callback) {
  if (!getHost()) return listenOverlayPlugin(callback)
  return listenActWebSocket(callback)
}
