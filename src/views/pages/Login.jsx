import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../controllers/authController.js'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
    setSubmitError('')
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    const nextErrors = {
      email: formData.email.trim() ? '' : 'Email wajib diisi.',
      password: formData.password ? '' : 'Password wajib diisi.',
    }

    setErrors(nextErrors)
    setSubmitError('')

    if (nextErrors.email || nextErrors.password) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await login(formData)

      if (!response.success) {
        setErrors(response.errors || {})
        setSubmitError(response.message || 'Login gagal.')
        return
      }

      setFormData({
        email: '',
        password: '',
      })
      setShowPassword(false)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setSubmitError(error.message || 'Terjadi kesalahan saat login.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="cv-form-title">Login</h2>
      <p className="cv-form-description">
        Selamat datang kembali! Silakan masukkan detail Anda.
      </p>

      <form className="mt-4" onSubmit={handleLogin}>
        {submitError ? <div className="alert alert-danger py-2">{submitError}</div> : null}

        <div className="cv-form-group">
          <label className="cv-form-label" htmlFor="email">
            Alamat Email
          </label>
          <div className="cv-input-group">
            <i className="bi bi-envelope" />
            <input
              id="email"
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
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="cv-form-label mb-0" htmlFor="password">
              Kata Sandi
            </label>
            <Link to="/reset-password" className="cv-auth-link small">
              Lupa Kata Sandi?
            </Link>
          </div>
          <div className="cv-input-group">
            <i className="bi bi-lock" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="cv-form-control"
              placeholder="Masukkan kata sandi"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
              autoComplete="current-password"
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

        <label className="cv-check-group cv-check-group--muted mb-4">
          <input type="checkbox" />
          <span>Ingat saya selama 30 hari</span>
        </label>

        <button type="submit" className="cv-btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Login'}
        </button>
      </form>

      <div className="cv-auth-divider">Atau lanjutkan dengan</div>

      <div className="cv-auth-socials">
        <button
          type="button"
          className="cv-btn-social"
          onClick={() => setSubmitError('Login Google akan tersedia setelah backend auth aktif.')}
        >
          <i className="bi bi-google" />
          Google
        </button>
        <button
          type="button"
          className="cv-btn-social"
          onClick={() => setSubmitError('Login Microsoft akan tersedia setelah backend auth aktif.')}
        >
          <i className="bi bi-microsoft" />
          Microsoft
        </button>
      </div>

      <div className="cv-auth-meta">
        <p className="mb-0">
          Belum punya akun?{' '}
          <Link to="/register" className="cv-auth-link">
            Buat Akun
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
