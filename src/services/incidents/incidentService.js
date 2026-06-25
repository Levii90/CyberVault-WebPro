import { isBackendAuthMode } from '../../config/authConfig.js'
import httpClient from '../httpClient.js'
import { clearAuth } from '../auth/authService.js'
import { getStorageItem, setStorageItem } from '../../utils/storage.js'

const DEMO_INCIDENT_REPORTS_STORAGE_KEY = 'demo_incident_reports'

function generateReportCode() {
  const now = new Date()
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')
  const randomPart = String(Math.floor(100000 + Math.random() * 900000))

  return `CV-INC-${datePart}-${randomPart}`
}

function getDemoReports() {
  return getStorageItem(DEMO_INCIDENT_REPORTS_STORAGE_KEY, [])
}

function saveDemoReports(reports) {
  setStorageItem(DEMO_INCIDENT_REPORTS_STORAGE_KEY, reports)
}

function mapFrontendReportToBackend(payload = {}) {
  return {
    incident_type: String(payload.incident_type || '').trim(),
    title: String(payload.title || '').trim(),
    description: String(payload.description || '').trim(),
    platform: String(payload.platform || '').trim(),
    city: String(payload.city || '').trim(),
    suspicious_url: String(payload.suspicious_url || '').trim(),
    evidence_summary: String(payload.evidence_summary || '').trim(),
    incident_date: String(payload.incident_date || '').trim(),
    severity: String(payload.severity || 'medium').trim() || 'medium',
    contact_preference: String(payload.contact_preference || 'in_app').trim() || 'in_app',
  }
}

function normalizeReportPayload(report = {}) {
  const normalizedReport = report || {}

  return {
    ...normalizedReport,
    title: normalizedReport.title || '',
    incident_type: normalizedReport.incident_type || '',
    description: normalizedReport.description || '',
    platform: normalizedReport.platform || '',
    city: normalizedReport.city || '',
    suspicious_url: normalizedReport.suspicious_url || '',
    evidence_summary: normalizedReport.evidence_summary || '',
    severity: normalizedReport.severity || 'medium',
    report_code: normalizedReport.report_code || '',
    status: normalizedReport.status || 'submitted',
    contact_preference: normalizedReport.contact_preference || 'in_app',
    incident_date: normalizedReport.incident_date || null,
    created_at: normalizedReport.created_at || null,
    updated_at: normalizedReport.updated_at || null,
    status_logs: Array.isArray(normalizedReport.status_logs) ? normalizedReport.status_logs : [],
  }
}

function normalizeIncidentSuccessResponse(response, fallbackMessage) {
  const report = normalizeReportPayload(response?.data?.report || {})

  return {
    success: Boolean(response?.success),
    message: response?.message || fallbackMessage,
    data: {
      ...response?.data,
      report,
      report_code: report.report_code || response?.data?.report_code || '',
      status: report.status || response?.data?.status || 'submitted',
      created_at: report.created_at || response?.data?.created_at || null,
    },
  }
}

function normalizeIncidentListResponse(response, fallbackMessage) {
  const items = Array.isArray(response?.data?.items)
    ? response.data.items.map((item) => normalizeReportPayload(item))
    : []

  return {
    success: Boolean(response?.success),
    message: response?.message || fallbackMessage,
    data: {
      ...response?.data,
      items,
      pagination: response?.data?.pagination || {
        total: items.length,
        page: 1,
        limit: items.length || 10,
      },
      filters: response?.data?.filters || {},
    },
  }
}

function mapIncidentErrorMessage(error) {
  if (error?.status === 401) {
    return 'Sesi login berakhir. Silakan login ulang.'
  }

  if (error?.status === 422) {
    return 'Periksa kembali data laporan.'
  }

  if (error?.status >= 500) {
    return 'Server belum dapat memproses laporan.'
  }

  if (!error?.status) {
    return 'Backend tidak terhubung. Pastikan XAMPP aktif.'
  }

  return error.message || 'Terjadi kesalahan pada pelaporan insiden.'
}

function normalizeIncidentError(error) {
  if (error?.status === 401) {
    clearAuth()
  }

  const nextErrors = {
    ...(error?.errors || {}),
  }

  if (nextErrors.evidence_files) {
    nextErrors.evidence_files =
      'Upload bukti file belum tersedia. Tulis ringkasan bukti pada deskripsi.'
  }

  return {
    success: false,
    message: mapIncidentErrorMessage(error),
    errors: nextErrors,
    status: error?.status ?? null,
    data: error?.data ?? null,
  }
}

function buildDemoReport(payload = {}) {
  const now = new Date().toISOString()
  const report = {
    id: String(Date.now()),
    report_code: generateReportCode(),
    incident_type: String(payload.incident_type || '').trim(),
    title: String(payload.title || '').trim(),
    description: String(payload.description || '').trim(),
    platform: String(payload.platform || '').trim(),
    city: String(payload.city || '').trim(),
    suspicious_url: String(payload.suspicious_url || '').trim(),
    evidence_summary: String(payload.evidence_summary || '').trim(),
    incident_date: String(payload.incident_date || '').trim(),
    severity: String(payload.severity || 'medium').trim() || 'medium',
    status: 'submitted',
    contact_preference: String(payload.contact_preference || 'in_app').trim() || 'in_app',
    created_at: now,
    updated_at: null,
    status_logs: [
      {
        id: '1',
        old_status: null,
        new_status: 'submitted',
        note: 'Report submitted',
        created_at: now,
      },
    ],
  }

  const reports = getDemoReports()
  saveDemoReports([report, ...reports])

  return report
}

export async function getIncidentStatus() {
  if (!isBackendAuthMode()) {
    return {
      success: true,
      message: 'Demo incident status fetched.',
      data: {
        module: 'incidents',
        persistence_ready: false,
        current_phase: 'demo',
      },
    }
  }

  try {
    const response = await httpClient.get('/api/incidents/status')
    return {
      success: Boolean(response?.success),
      message: response?.message || 'Incident status fetched successfully.',
      data: response?.data || {},
    }
  } catch (error) {
    return normalizeIncidentError(error)
  }
}

export async function getIncidentContract() {
  if (!isBackendAuthMode()) {
    return {
      success: true,
      message: 'Demo incident contract fetched.',
      data: {
        report: {
          endpoint: '/api/incidents/report',
          persistence_ready: false,
        },
      },
    }
  }

  try {
    const response = await httpClient.get('/api/incidents/contract')
    return {
      success: Boolean(response?.success),
      message: response?.message || 'Incident contract fetched successfully.',
      data: response?.data || {},
    }
  } catch (error) {
    return normalizeIncidentError(error)
  }
}

export async function submitIncidentReport(payload = {}) {
  const mappedPayload = mapFrontendReportToBackend(payload)

  if (!mappedPayload.incident_type || !mappedPayload.title || !mappedPayload.description) {
    return {
      success: false,
      message: 'Validasi laporan gagal',
      errors: {
        form: 'Data laporan belum lengkap.',
      },
      status: 422,
    }
  }

  if (!isBackendAuthMode()) {
    const report = buildDemoReport(mappedPayload)

    return {
      success: true,
      message: 'Laporan berhasil dibuat',
      data: {
        report,
        report_code: report.report_code,
        status: report.status,
        created_at: report.created_at,
      },
    }
  }

  try {
    const response = await httpClient.post('/api/incidents/report', mappedPayload)
    return normalizeIncidentSuccessResponse(response, 'Incident report submitted successfully.')
  } catch (error) {
    return normalizeIncidentError(error)
  }
}

export async function getMyIncidentReports(filters = {}) {
  if (!isBackendAuthMode()) {
    const reports = getDemoReports().map((item) => normalizeReportPayload(item))

    return {
      success: true,
      message: 'Demo incident reports fetched.',
      data: {
        items: reports,
        pagination: {
          total: reports.length,
          page: 1,
          limit: reports.length || 10,
        },
        filters: {},
      },
    }
  }

  try {
    const response = await httpClient.get('/api/incidents/my', {
      params: filters,
    })

    return normalizeIncidentListResponse(response, 'Incident reports fetched successfully.')
  } catch (error) {
    return normalizeIncidentError(error)
  }
}

export async function getIncidentDetail(reportCode) {
  const normalizedReportCode = String(reportCode || '').trim()

  if (!normalizedReportCode) {
    return {
      success: false,
      message: 'Kode laporan tidak valid.',
      errors: {
        report_code: 'Kode laporan wajib diisi.',
      },
      status: 422,
    }
  }

  if (!isBackendAuthMode()) {
    const report = getDemoReports().find((item) => item.report_code === normalizedReportCode)

    if (!report) {
      return {
        success: false,
        message: 'Incident report not found',
        errors: {},
        status: 404,
      }
    }

    return {
      success: true,
      message: 'Demo incident report detail fetched.',
      data: {
        report: normalizeReportPayload(report),
      },
    }
  }

  try {
    const response = await httpClient.get(`/api/incidents/detail/${encodeURIComponent(normalizedReportCode)}`)
    return {
      success: Boolean(response?.success),
      message: response?.message || 'Incident report detail fetched successfully.',
      data: {
        ...response?.data,
        report: normalizeReportPayload(response?.data?.report || {}),
      },
    }
  } catch (error) {
    return normalizeIncidentError(error)
  }
}

export async function createIncidentReport(payload) {
  return submitIncidentReport(payload)
}
