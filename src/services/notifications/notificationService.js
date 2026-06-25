import {
  notificationPriorityOptions,
  notificationStatusOptions,
  notificationTypes,
  notifications,
} from '../../data/notifications/notificationData.js'

export const NOTIFICATIONS_UPDATED_EVENT = 'notifications:updated'

let notificationStore = notifications.map((item) => ({
  ...item,
  metadata: item.metadata ? { ...item.metadata } : {},
}))

function buildResponse(message, data) {
  return {
    success: true,
    message,
    data,
  }
}

function cloneNotification(item) {
  return {
    ...item,
    metadata: item.metadata ? { ...item.metadata } : {},
  }
}

function getNotificationStore() {
  return notificationStore.map((item) => cloneNotification(item))
}

function dispatchNotificationsUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT))
  }
}

function updateNotificationStore(updater) {
  notificationStore = updater(notificationStore).map((item) => cloneNotification(item))
  dispatchNotificationsUpdated()
}

export function getUnreadNotificationCount() {
  return notificationStore.filter((item) => item.status === 'unread').length
}

export async function getNotifications() {
  return Promise.resolve(buildResponse('Notifikasi berhasil dimuat.', getNotificationStore()))
}

export async function getNotificationTypes() {
  return Promise.resolve(buildResponse('Tipe notifikasi berhasil dimuat.', notificationTypes))
}

export async function getNotificationStatusOptions() {
  return Promise.resolve(
    buildResponse('Status notifikasi berhasil dimuat.', notificationStatusOptions),
  )
}

export async function getNotificationPriorityOptions() {
  return Promise.resolve(
    buildResponse('Prioritas notifikasi berhasil dimuat.', notificationPriorityOptions),
  )
}

export async function markAsRead(notificationId) {
  updateNotificationStore((currentNotifications) =>
    currentNotifications.map((item) =>
      item.id === notificationId ? { ...item, status: 'read' } : item,
    ),
  )

  return Promise.resolve(
    buildResponse('Notifikasi berhasil ditandai sebagai read.', {
      notificationId,
      status: 'read',
    }),
  )
}

export async function markAsUnread(notificationId) {
  updateNotificationStore((currentNotifications) =>
    currentNotifications.map((item) =>
      item.id === notificationId ? { ...item, status: 'unread' } : item,
    ),
  )

  return Promise.resolve(
    buildResponse('Notifikasi berhasil ditandai sebagai unread.', {
      notificationId,
      status: 'unread',
    }),
  )
}

export async function markAllAsRead() {
  updateNotificationStore((currentNotifications) =>
    currentNotifications.map((item) =>
      item.status === 'unread' ? { ...item, status: 'read' } : item,
    ),
  )

  return Promise.resolve(buildResponse('Semua notifikasi berhasil ditandai read.', {
    status: 'read',
  }))
}

export async function archiveNotification(notificationId) {
  updateNotificationStore((currentNotifications) =>
    currentNotifications.map((item) =>
      item.id === notificationId ? { ...item, status: 'archived' } : item,
    ),
  )

  return Promise.resolve(
    buildResponse('Notifikasi berhasil dipindahkan ke arsip.', {
      notificationId,
      status: 'archived',
    }),
  )
}

export async function deleteNotification(notificationId) {
  updateNotificationStore((currentNotifications) =>
    currentNotifications.filter((item) => item.id !== notificationId),
  )

  return Promise.resolve(
    buildResponse('Notifikasi berhasil dihapus dari state lokal.', {
      notificationId,
    }),
  )
}
