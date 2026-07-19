import { useEffect } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'

export function Perfil() {
  useEffect(() => {
    document.body.classList.add('profile-no-scroll')
    return () => {
      document.body.classList.remove('profile-no-scroll')
    }
  }, [])

  return <DashboardLayout centerPanel />
}
