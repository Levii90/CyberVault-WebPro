export function validateRequired(value) {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  return String(value ?? '').trim().length > 0
}

export function validateMinLength(value, min) {
  return String(value ?? '').trim().length >= min
}

export function validateEvidenceFile(file, options = {}) {
  const {
    allowedTypes = [],
    maxFileSize = Infinity,
  } = options

  if (!file) {
    return {
      valid: false,
      error: 'File bukti tidak ditemukan.',
    }
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File harus berupa JPG, PNG, atau PDF.',
    }
  }

  if (file.size > maxFileSize) {
    return {
      valid: false,
      error: 'Ukuran file melebihi batas yang diizinkan.',
    }
  }

  return {
    valid: true,
    error: '',
  }
}

export function validateEvidenceFiles(files, options = {}) {
  const normalizedFiles = Array.isArray(files) ? files : Array.from(files ?? [])

  for (const file of normalizedFiles) {
    const result = validateEvidenceFile(file, options)

    if (!result.valid) {
      return result
    }
  }

  return {
    valid: true,
    error: '',
  }
}
