function sendNotification (title, body) {
  if (!window['Notification']) {
    return
  }

  window.Notification.requestPermission().then(res => {
    if (res === 'granted') {
      spawnNotification(title, body)
    }
  })
}

function requestPermission () {
  if (!window['Notification']) {
    return
  }

  window.Notification.requestPermission()
}

function spawnNotification (title, body) {
  const n = new window.Notification(title, { body })
  window.setTimeout(n.close.bind(n), 5000)
  return n
}

export { sendNotification, requestPermission }
