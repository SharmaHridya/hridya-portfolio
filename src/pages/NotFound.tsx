import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Not found · Hridya Sharma'
  }, [])

  return (
    <section className="container-x flex min-h-[80vh] flex-col justify-center pt-24" aria-labelledby="nf-title">
      <p className="label">Error 404 · an unexplored path</p>
      <h1 id="nf-title" className="mt-4 text-[clamp(3rem,9vw,7rem)] leading-none font-semibold">
        A question with <span className="serif-italic text-cobalt">no page yet.</span>
      </h1>
      <p className="mt-6 max-w-lg text-lg text-ink/75">This link doesn’t lead anywhere, which is either a bug or a rabbit hole. Let’s head back.</p>
      <Link to="/" className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-paper hover:bg-cobalt">
        Back to the studio →
      </Link>
    </section>
  )
}
