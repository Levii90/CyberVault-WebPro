import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../controllers/authController.js'

function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    logout()
    navigate('/login', { replace: true })
  }, [navigate])

  return null
}

export default Logout
