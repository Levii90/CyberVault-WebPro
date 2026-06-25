import {
  assessmentHistory,
  certificates,
  scoreSummary,
} from '../../data/certificates/certificateData.js'

function buildResponse(message, data) {
  return {
    success: true,
    message,
    data,
  }
}

export async function getScoreSummary() {
  return Promise.resolve(buildResponse('Ringkasan skor berhasil dimuat.', scoreSummary))
}

export async function getAssessmentHistory() {
  return Promise.resolve(buildResponse('Riwayat asesmen berhasil dimuat.', assessmentHistory))
}

export async function getCertificates() {
  return Promise.resolve(buildResponse('Data sertifikat berhasil dimuat.', certificates))
}

export async function getCertificateById(certificateId) {
  const certificate = certificates.find((item) => item.id === certificateId) || null

  return Promise.resolve(buildResponse('Detail sertifikat berhasil dimuat.', certificate))
}

export async function generateCertificate(certificateId) {
  return Promise.resolve(
    buildResponse('Mode demo: sertifikat berhasil digenerate.', {
      certificateId,
      status: 'issued',
      issuedAt: new Date().toISOString().slice(0, 10),
      validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .slice(0, 10),
    }),
  )
}

export async function downloadCertificate(certificateId) {
  return Promise.resolve(
    buildResponse('Mode demo: sertifikat siap diunduh setelah backend tersedia.', {
      certificateId,
    }),
  )
}

export async function verifyCertificateCode(certificateCode) {
  const certificate = certificates.find((item) => item.certificateCode === certificateCode) || null

  if (!certificate) {
    return {
      success: false,
      message: 'Kode sertifikat tidak ditemukan pada data mock.',
      data: null,
    }
  }

  return buildResponse('Kode sertifikat valid pada mode demo.', certificate)
}
