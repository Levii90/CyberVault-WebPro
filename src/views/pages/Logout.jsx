import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../controllers/authController.js'

function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    let isActive = true

    async function performLogout() {
      await logout()

      if (isActive) {
        navigate('/login', { replace: true })
      }
    }

    performLogout()

    return () => {
      isActive = false
    }
  }, [navigate])

  return null
}

export default Logout
