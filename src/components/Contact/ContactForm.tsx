import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { profile } from '../../data/profile'
import { cn } from '../../utils/format'

type Fields = { name: string; email: string; subject: string; message: string }
type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string }

const EMPTY: Fields = { name: '', email: '', subject: '', message: '' }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Mirrors the server-side checks in api/contact.ts so errors show before a round trip.
function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {}
  if (!f.name.trim()) e.name = 'Please tell me your name'
  if (!f.email.trim()) e.email = 'I’ll need an email to reply to'
  else if (!EMAIL.test(f.email.trim())) e.email = 'That email doesn’t look quite right'
  if (!f.subject.trim()) e.subject = 'A short subject helps'
  if (f.message.trim().length < 10) e.message = 'A little more detail, please (10+ characters)'
  if (f.message.length > 5000) e.message = 'Keep it under 5,000 characters'
  return e
}

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [honeypot, setHoneypot] = useState('')

  const update = (key: keyof Fields, value: string) => {
    const next = { ...fields, [key]: value }
    setFields(next)
    if (touched[key]) setErrors(validate(next))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validate(fields)
    setErrors(found)
    setTouched({ name: true, email: true, subject: true, message: true })
    if (Object.keys(found).length) {
      document.getElementById(`cf-${Object.keys(found)[0]}`)?.focus()
      return
    }
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, company: honeypot }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (body.fields) setErrors(body.fields)
        throw new Error(body.error ?? 'The message could not be sent.')
      }
      setStatus({ kind: 'sent' })
      setFields(EMPTY)
      setTouched({})
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'The message could not be sent.' })
    }
  }

  if (status.kind === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        role="status"
        className="flex h-full min-h-[420px] flex-col items-start justify-center rounded-[24px] border border-line bg-card p-8 md:p-12"
      >
        <CheckCircle2 className="size-10 text-[#3c9a5f]" aria-hidden />
        <h3 className="mt-6 text-3xl font-semibold">Message sent. Thank you!</h3>
        <p className="mt-3 max-w-md text-ink/75">It’s in my inbox now. I’ll get back to you at the address you gave.</p>
        <button onClick={() => setStatus({ kind: 'idle' })} className="link-underline mt-8 text-sm text-cobalt-deep">
          Send another message
        </button>
      </motion.div>
    )
  }

  const sending = status.kind === 'sending'

  return (
    <form onSubmit={submit} noValidate className="rounded-[24px] border border-line bg-card p-6 md:p-10" aria-describedby="cf-note">
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="name" label="Name" error={touched.name ? errors.name : undefined}>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            value={fields.name}
            onChange={(e) => update('name', e.target.value)}
            onBlur={() => {
              setTouched((t) => ({ ...t, name: true }))
              setErrors(validate(fields))
            }}
            aria-invalid={!!(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? 'cf-name-error' : undefined}
            maxLength={100}
            className={inputClass(!!(touched.name && errors.name))}
          />
        </Field>
        <Field id="email" label="Email" error={touched.email ? errors.email : undefined}>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={fields.email}
            onChange={(e) => update('email', e.target.value)}
            onBlur={() => {
              setTouched((t) => ({ ...t, email: true }))
              setErrors(validate(fields))
            }}
            aria-invalid={!!(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? 'cf-email-error' : undefined}
            maxLength={200}
            className={inputClass(!!(touched.email && errors.email))}
          />
        </Field>
      </div>
      <div className="mt-5">
        <Field id="subject" label="Subject" error={touched.subject ? errors.subject : undefined}>
          <input
            id="cf-subject"
            name="subject"
            value={fields.subject}
            onChange={(e) => update('subject', e.target.value)}
            onBlur={() => {
              setTouched((t) => ({ ...t, subject: true }))
              setErrors(validate(fields))
            }}
            aria-invalid={!!(touched.subject && errors.subject)}
            aria-describedby={touched.subject && errors.subject ? 'cf-subject-error' : undefined}
            maxLength={150}
            className={inputClass(!!(touched.subject && errors.subject))}
          />
        </Field>
      </div>
      <div className="mt-5">
        <Field id="message" label="Message" error={touched.message ? errors.message : undefined} hint={`${fields.message.length}/5000`}>
          <textarea
            id="cf-message"
            name="message"
            rows={6}
            value={fields.message}
            onChange={(e) => update('message', e.target.value)}
            onBlur={() => {
              setTouched((t) => ({ ...t, message: true }))
              setErrors(validate(fields))
            }}
            aria-invalid={!!(touched.message && errors.message)}
            aria-describedby={touched.message && errors.message ? 'cf-message-error' : undefined}
            maxLength={5000}
            className={cn(inputClass(!!(touched.message && errors.message)), 'resize-y')}
          />
        </Field>
      </div>

      {/* Honeypot for bots: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      <AnimatePresence>
        {status.kind === 'error' && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <p className="flex gap-3 rounded-xl border border-tangerine/50 bg-tangerine/10 p-4 text-sm text-[#7a3412]">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {status.message} You can also email me directly at{' '}
                <a className="underline" href={`mailto:${profile.email}?subject=${encodeURIComponent(fields.subject)}`}>
                  {profile.email}
                </a>
                .
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p id="cf-note" className="max-w-xs text-xs text-muted">
          Your details are only used to reply to you.
        </p>
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-cobalt disabled:opacity-70"
        >
          {sending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              Send message <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

const inputClass = (invalid: boolean) =>
  cn(
    'mt-1.5 w-full rounded-xl border bg-paper px-4 py-3 text-base transition-colors outline-none placeholder:text-muted focus:border-cobalt focus:bg-card focus:ring-4 focus:ring-cobalt/10',
    invalid ? 'border-[#c2410c]' : 'border-line hover:border-ink/30',
  )

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={`cf-${id}`} className="label text-ink">
          {label}
        </label>
        {hint && <span className="font-mono text-[0.65rem] text-muted">{hint}</span>}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p id={`cf-${id}-error`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-sm text-[#b23c0a]">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
