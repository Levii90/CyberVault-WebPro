import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../controllers/authController.js'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
    setSubmitError('')
  }

  const handleRegister = async (event) => {
    event.preventDefault()

    const nextErrors = {
      name: formData.name.trim() ? '' : 'Nama wajib diisi.',
      email: formData.email.trim() ? '' : 'Email wajib diisi.',
      password: formData.password ? '' : 'Password wajib diisi.',
      confirmPassword: formData.confirmPassword
        ? formData.confirmPassword === formData.password
          ? ''
          : 'Konfirmasi password harus sama.'
        : 'Konfirmasi password wajib diisi.',
      agreeToTerms: formData.agreeToTerms
        ? ''
        : 'Anda harus menyetujui Ketentuan Layanan dan Kebijakan Privasi.',
    }

    setErrors(nextErrors)
    setSubmitError('')

    if (
      nextErrors.name ||
      nextErrors.email ||
      nextErrors.password ||
      nextErrors.confirmPassword ||
      nextErrors.agreeToTerms
    ) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      })

      if (!response.success) {
        const mappedErrors = {
          ...response.errors,
          confirmPassword: response.errors?.password_confirmation || '',
        }
        setErrors(mappedErrors)
        setSubmitError(response.message || 'Registrasi gagal.')
        return
      }

      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      })
      setShowPassword(false)
      setShowConfirmPassword(false)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setSubmitError(error.message || 'Terjadi kesalahan saat registrasi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="cv-form-title">Buat Akun</h2>
      <p className="cv-form-description">
        Daftar untuk memulai perjalanan Anda bersama CyberVault.
      </p>

      <form className="mt-4" onSubmit={handleRegister}>
        {submitError ? <div className="alert alert-danger py-2">{submitError}</div> : null}

        <div className="cv-form-group">
          <label className="cv-form-label" htmlFor="register-name">
            Nama
          </label>
          <div className="cv-input-group">
            <i className="bi bi-person" />
            <input
              id="register-name"
              name="name"
              type="text"
              className="cv-form-control"
              placeholder="Nama lengkap"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
            />
          </div>
          {errors.name ? <small className="text-danger d-block mt-1">{errors.name}</small> : null}
        </div>

        <div className="cv-form-group">
          <label className="cv-form-label" htmlFor="register-username">
            Username
          </label>
          <div className="cv-input-group">
            <i className="bi bi-at" />
            <input
              id="register-username"
              name="username"
              type="text"
              className="cv-form-control"
              placeholder="username opsional"
              value={formData.username}
              onChange={handleChange}
              aria-invalid={Boolean(errors.username)}
            />
          </div>
          {errors.username ? (
            <small className="text-danger d-block mt-1">{errors.username}</small>
          ) : null}
        </div>

        <div className="cv-form-group">
          <label className="cv-form-label" htmlFor="register-email">
            Alamat Email
          </label>
          <div className="cv-input-group">
            <i className="bi bi-envelope" />
            <input
              id="register-email"
              name="email"
              type="email"
              className="cv-form-control"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
            />
          </div>
          {errors.email ? <small className="text-danger d-block mt-1">{errors.email}</small> : null}
        </div>

        <div className="cv-form-group">
          <label className="cv-form-label" htmlFor="register-password">
            Kata Sandi
          </label>
          <div className="cv-input-group">
            <i className="bi bi-lock" />
            <input
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="cv-form-control"
              placeholder="Masukkan kata sandi"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="cv-input-action"
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
              onClick={() => setShowPassword((current) => !current)}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
            </button>
          </div>
          {errors.password ? (
            <small className="text-danger d-block mt-1">{errors.password}</small>
          ) : null}
        </div>

        <div className="cv-form-group">
          <label className="cv-form-label" htmlFor="register-confirm-password">
            Konfirmasi Kata Sandi
          </label>
          <div className="cv-input-group">
            <i className="bi bi-shield-lock" />
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="cv-form-control"
              placeholder="Konfirmasi kata sandi"
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-invalid={Boolean(errors.confirmPassword)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="cv-input-action"
              aria-label={
                showConfirmPassword
                  ? 'Sembunyikan konfirmasi kata sandi'
                  : 'Lihat konfirmasi kata sandi'
              }
              onClick={() => setShowConfirmPassword((current) => !current)}
            >
              <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
            </button>
          </div>
          {errors.confirmPassword ? (
            <small className="text-danger d-block mt-1">{errors.confirmPassword}</small>
          ) : null}
        </div>

        <label className="cv-check-group cv-check-group--muted mb-4">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
          />
          <span>Saya menyetujui Ketentuan Layanan dan Kebijakan Privasi.</span>
        </label>
        {errors.agreeToTerms ? (
          <small className="text-danger d-block mb-3">{errors.agreeToTerms}</small>
        ) : null}

        <button type="submit" className="cv-btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Buat Akun'}
        </button>
      </form>

      <div className="cv-auth-divider">Atau lanjutkan dengan</div>

      <div className="cv-auth-socials">
        <button
          type="button"
          className="cv-btn-social"
          onClick={() => setSubmitError('Registrasi Google akan tersedia setelah backend auth aktif.')}
        >
          <i className="bi bi-google" />
          Google
        </button>
        <button
          type="button"
          className="cv-btn-social"
          onClick={() => setSubmitError('Registrasi Microsoft akan tersedia setelah backend auth aktif.')}
        >
          <i className="bi bi-microsoft" />
          Microsoft
        </button>
      </div>

      <div className="cv-auth-meta">
        <p className="mb-0">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="cv-auth-link">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
