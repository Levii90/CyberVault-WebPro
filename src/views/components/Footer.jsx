import { Link } from 'react-router-dom'
import { useState } from 'react'

function Footer() {
  const [feedback, setFeedback] = useState('')

  const showPlaceholderMessage = (label) => {
    setFeedback(`${label} akan tersedia setelah halaman legal CyberVault disiapkan.`)
  }

  return (
    <footer className="cv-footer">
      <div>
        <span>&copy; 2026 CyberVault dilindungi Hak Cipta</span>
        {feedback ? <p className="cv-footer-feedback">{feedback}</p> : null}
      </div>

      <div className="cv-footer-links">
        <button type="button" onClick={() => showPlaceholderMessage('Kebijakan Privasi')}>
          Kebijakan Privasi
        </button>
        <button type="button" onClick={() => showPlaceholderMessage('Syarat & Ketentuan')}>
          Syarat & Ketentuan
        </button>
        <Link to="/pusat-bantuan">Bantuan</Link>
      </div>
    </footer>
  )
}

export default Footer
