import {
  educationCategories,
  educationLevels,
  educationModules,
} from '../../data/education/educationData.js'

function buildResponse(message, data) {
  return {
    success: true,
    message,
    data,
  }
}

export async function getEducationModules() {
  return Promise.resolve(buildResponse('Modul edukasi berhasil dimuat.', educationModules))
}

export async function getEducationCategories() {
  return Promise.resolve(buildResponse('Kategori edukasi berhasil dimuat.', educationCategories))
}

export async function getEducationLevels() {
  return Promise.resolve(buildResponse('Level edukasi berhasil dimuat.', educationLevels))
}

export async function startModule(moduleId) {
  return Promise.resolve(
    buildResponse('Mode demo: modul ditandai mulai dipelajari.', {
      moduleId,
      status: 'in_progress',
      progress: 10,
    }),
  )
}

export async function updateModuleProgress(moduleId, progress) {
  return Promise.resolve(
    buildResponse('Mode demo: progress modul berhasil diperbarui.', {
      moduleId,
      progress,
    }),
  )
}
