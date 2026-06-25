import {
  timelineActivities,
  timelineFilters,
  timelineStats,
} from '../../data/timeline/timelineData.js'

function buildResponse(message, data) {
  return {
    success: true,
    message,
    data,
  }
}

function cloneActivity(activity) {
  return {
    ...activity,
    metadata: {
      ...activity.metadata,
    },
  }
}

export async function getTimelineActivities() {
  return Promise.resolve(
    buildResponse(
      'Riwayat aktivitas timeline berhasil dimuat.',
      timelineActivities.map(cloneActivity),
    ),
  )
}

export async function getTimelineStats() {
  return Promise.resolve(buildResponse('Ringkasan timeline berhasil dimuat.', [...timelineStats]))
}

export async function getTimelineFilters() {
  return Promise.resolve(
    buildResponse('Filter timeline berhasil dimuat.', {
      types: [...timelineFilters.types],
      statuses: [...timelineFilters.statuses],
      ranges: [...timelineFilters.ranges],
    }),
  )
}

export async function getActivityById(activityId) {
  const activity = timelineActivities.find((item) => item.id === activityId) || null

  return Promise.resolve(
    buildResponse(
      activity ? 'Detail aktivitas timeline berhasil dimuat.' : 'Aktivitas tidak ditemukan.',
      activity ? cloneActivity(activity) : null,
    ),
  )
}

export async function markActivityAsReviewed(activityId) {
  return Promise.resolve(
    buildResponse('Aktivitas berhasil ditandai sebagai ditinjau pada mode demo.', {
      activityId,
      reviewed: true,
      status: 'updated',
    }),
  )
}
