import {
  alertCategories,
  alertSeverityLevels,
  alertStatusOptions,
  cyberAlerts,
} from '../../data/alerts/alertData.js'

function buildResponse(message, data) {
  return {
    success: true,
    message,
    data,
  }
}

export async function getCyberAlerts() {
  return Promise.resolve(buildResponse('Alert siber berhasil dimuat.', cyberAlerts))
}

export async function getAlertCategories() {
  return Promise.resolve(buildResponse('Kategori alert berhasil dimuat.', alertCategories))
}

export async function getAlertSeverityLevels() {
  return Promise.resolve(
    buildResponse('Level severity alert berhasil dimuat.', alertSeverityLevels),
  )
}

export async function getAlertStatusOptions() {
  return Promise.resolve(buildResponse('Status alert berhasil dimuat.', alertStatusOptions))
}

export async function markAlertAsRead(alertId) {
  return Promise.resolve(
    buildResponse('Mode demo: alert berhasil ditandai sudah dibaca.', {
      alertId,
      status: 'read',
    }),
  )
}

export async function saveAlert(alertId) {
  return Promise.resolve(
    buildResponse('Mode demo: alert berhasil disimpan.', {
      alertId,
      saved: true,
    }),
  )
}
