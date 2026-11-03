import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { About } from '../../components/About/About'
import { BeyondCode } from '../../components/BeyondCode/BeyondCode'
import { Contact } from '../../components/Contact/Contact'
import { CuriosityLab } from '../../components/CuriosityLab/CuriosityLab'
import { Hero } from '../../components/Hero/Hero'
import { Journey } from '../../components/Journey/Journey'
import { Process } from '../../components/Process/Process'
import { Projects } from '../../components/Projects/Projects'
import { Workspace } from '../../components/Workspace/Workspace'

export default function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    document.title = 'Hridya Sharma — Software Developer & AI/ML Explorer · NIT Jalandhar'
  }, [])

  // Arriving from another route with /#section: wait a frame for layout, then jump.
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'auto' }), 60)
    return () => window.clearTimeout(t)
  }, [hash])

  return (
    <>
      <Hero />
      <About />
      <Projects />
      <CuriosityLab />
      <Workspace />
      <Process />
      <BeyondCode />
      <Journey />
      <Contact />
    </>
  )
}
