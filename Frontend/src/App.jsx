import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './Routes'
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <div className='min-h-screen flex flex-col'>
            <Navbar />
            <main className='flex-grow'>
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
