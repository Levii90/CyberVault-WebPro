import {
  accountPreferences,
  appearanceSettings,
  dataControlActions,
  notificationSettings,
  privacySettings,
  securitySettings,
  settingsSections,
} from '../../data/settings/settingsData.js'

function buildResponse(message, data) {
  return {
    success: true,
    message,
    data,
  }
}

export async function getSettingsSections() {
  return Promise.resolve(buildResponse('Section pengaturan berhasil dimuat.', settingsSections))
}

export async function getAccountPreferences() {
  return Promise.resolve(
    buildResponse('Preferensi akun berhasil dimuat.', accountPreferences),
  )
}

export async function getSecuritySettings() {
  return Promise.resolve(buildResponse('Pengaturan keamanan berhasil dimuat.', securitySettings))
}

export async function getNotificationSettings() {
  return Promise.resolve(
    buildResponse('Pengaturan notifikasi berhasil dimuat.', notificationSettings),
  )
}

export async function getPrivacySettings() {
  return Promise.resolve(buildResponse('Pengaturan privasi berhasil dimuat.', privacySettings))
}

export async function getAppearanceSettings() {
  return Promise.resolve(
    buildResponse('Pengaturan tampilan berhasil dimuat.', appearanceSettings),
  )
}

export async function getDataControlActions() {
  return Promise.resolve(
    buildResponse('Aksi kontrol data berhasil dimuat.', dataControlActions),
  )
}

export async function updateSetting(section, settingId, value) {
  return Promise.resolve(
    buildResponse('Pengaturan berhasil diperbarui secara lokal.', {
      section,
      settingId,
      value,
    }),
  )
}

export async function resetSettings() {
  return Promise.resolve(
    buildResponse('Semua pengaturan berhasil dikembalikan ke default mock.', {
      accountPreferences,
      securitySettings,
      notificationSettings,
      privacySettings,
      appearanceSettings,
    }),
  )
}

export async function exportSettings() {
  return Promise.resolve(
    buildResponse('Mode demo: export akan tersedia setelah backend aktif.', {
      exported: false,
    }),
  )
}
