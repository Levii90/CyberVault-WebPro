import {
  faqItems,
  helpCategories,
  quickActions,
  supportTopics,
  troubleshootingSteps,
} from '../../data/help/helpData.js'

function buildResponse(message, data) {
  return {
    success: true,
    message,
    data,
  }
}

function generateTicketCode() {
  const now = new Date()
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate(),
  ).padStart(2, '0')}`
  const randomPart = String(Math.floor(1000 + Math.random() * 9000))
  return `CV-HELP-${datePart}-${randomPart}`
}

export async function getHelpCategories() {
  return Promise.resolve(buildResponse('Kategori bantuan berhasil dimuat.', helpCategories))
}

export async function getFaqItems() {
  return Promise.resolve(buildResponse('FAQ bantuan berhasil dimuat.', faqItems))
}

export async function getTroubleshootingSteps() {
  return Promise.resolve(
    buildResponse('Checklist troubleshooting berhasil dimuat.', troubleshootingSteps),
  )
}

export async function getQuickActions() {
  return Promise.resolve(buildResponse('Quick actions berhasil dimuat.', quickActions))
}

export async function getSupportTopics() {
  return Promise.resolve(buildResponse('Topik support berhasil dimuat.', supportTopics))
}

export async function submitSupportTicket(payload) {
  return Promise.resolve(
    buildResponse('Tiket bantuan mock berhasil dibuat.', {
      ticketCode: generateTicketCode(),
      payload,
    }),
  )
}
