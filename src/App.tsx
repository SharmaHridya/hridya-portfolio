import { MotionConfig } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CommandPaletteProvider } from './components/CommandPalette/CommandPalette'
import { Footer } from './components/Footer/Footer'
import { Navbar } from './components/Navbar/Navbar'
import Home from './pages/Home/Home'

const ProjectDetails = lazy(() => import('./pages/ProjectDetails/ProjectDetails'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    // reducedMotion="user" turns transform animations into instant changes for visitors who ask for less motion.
    <MotionConfig reducedMotion="user">
      <CommandPaletteProvider>
        <Navbar />
        <main id="main">
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:slug" element={<ProjectDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </CommandPaletteProvider>
    </MotionConfig>
  )
}
