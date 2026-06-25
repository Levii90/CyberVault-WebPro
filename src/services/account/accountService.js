import {
  accountActivities,
  deviceSessions,
  profileCompletionItems,
  profileSummary,
  securitySummary,
} from '../../data/account/accountData.js'
import { isBackendAuthMode } from '../../config/authConfig.js'
import {
  getCurrentUser,
  getCurrentUserFromApi,
  updateCurrentUserProfile,
  updateProfile as updateAuthProfile,
} from '../auth/authService.js'

function buildResponse(message, data) {
  return {
    success: true,
    message,
    data,
  }
}

function buildMergedProfile() {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    return profileSummary
  }

  return {
    ...profileSummary,
    fullName: currentUser.name || profileSummary.fullName,
    username: currentUser.username || profileSummary.username,
    email: currentUser.email || profileSummary.email,
    role: currentUser.role || profileSummary.role,
    bio: currentUser.bio || profileSummary.bio,
    phone: currentUser.phone || '',
    institution: currentUser.institution || '',
    joinedAt: currentUser.created_at
      ? String(currentUser.created_at).slice(0, 10)
      : profileSummary.joinedAt,
  }
}

export async function getAccountProfile() {
  if (isBackendAuthMode()) {
    const response = await getCurrentUserFromApi()

    if (!response.success) {
      return response
    }

    return buildResponse('Profil akun berhasil dimuat.', buildMergedProfile())
  }

  return Promise.resolve(buildResponse('Profil akun berhasil dimuat.', buildMergedProfile()))
}

export async function updateAccountProfile(payload) {
  const normalizedPayload = {
    fullName: String(payload.fullName || '').trim(),
    username: String(payload.username || '').trim(),
    email: String(payload.email || '').trim(),
    bio: String(payload.bio || '').trim(),
    phone: String(payload.phone || '').trim(),
    institution: String(payload.institution || '').trim(),
  }

  if (isBackendAuthMode()) {
    const response = await updateAuthProfile({
      name: normalizedPayload.fullName,
      username: normalizedPayload.username,
      bio: normalizedPayload.bio,
      phone: normalizedPayload.phone,
      institution: normalizedPayload.institution,
    })

    if (!response.success) {
      return response
    }

    return buildResponse('Profil akun berhasil diperbarui.', buildMergedProfile())
  }

  updateCurrentUserProfile({
    name: normalizedPayload.fullName,
    username: normalizedPayload.username,
    email: normalizedPayload.email,
    bio: normalizedPayload.bio,
    phone: normalizedPayload.phone,
    institution: normalizedPayload.institution,
  })

  return Promise.resolve(
    buildResponse('Profil akun berhasil diperbarui secara lokal.', {
      ...buildMergedProfile(),
      ...normalizedPayload,
    }),
  )
}

export async function getSecuritySummary() {
  return Promise.resolve(buildResponse('Ringkasan keamanan akun berhasil dimuat.', securitySummary))
}

export async function getDeviceSessions() {
  return Promise.resolve(buildResponse('Daftar device session berhasil dimuat.', deviceSessions))
}

export async function revokeDeviceSession(sessionId) {
  return Promise.resolve(
    buildResponse('Session perangkat berhasil direvoke pada mode demo.', {
      sessionId,
      revoked: true,
    }),
  )
}

export async function getAccountActivities() {
  return Promise.resolve(buildResponse('Aktivitas akun berhasil dimuat.', accountActivities))
}

export async function getProfileCompletionItems() {
  return Promise.resolve(
    buildResponse('Checklist profil berhasil dimuat.', profileCompletionItems),
  )
}
