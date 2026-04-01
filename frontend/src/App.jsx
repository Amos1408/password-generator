import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login'
import Register from './Register'
import Dashboard from './Dashboard';


function App() {
  const [page, setPage] = useState('Login')
  return (
    <>
      {page === 'Login' && <Login changePage={setPage} />}
      {page === 'Register' && <Register changePage={setPage} />}
      {page === "Dashboard" && <Dashboard changePage={setPage} />}
    </>
  )
}

export default App
