import { json } from './_shared.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 }

type Payload = { name?: unknown; email?: unknown; subject?: unknown; message?: unknown; company?: unknown }

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

export function validate(body: Payload): { fields?: Record<string, string>; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  const fields: Record<string, string> = {}
  for (const key of ['name', 'email', 'subject', 'message'] as const) {
    const value = typeof body[key] === 'string' ? (body[key] as string).trim() : ''
    if (!value) errors[key] = 'Required'
    else if (value.length > LIMITS[key]) errors[key] = `Keep it under ${LIMITS[key]} characters`
    fields[key] = value
  }
  if (fields.email && !EMAIL.test(fields.email)) errors.email = 'Enter a valid email address'
  if (fields.message && fields.message.length < 10 && !errors.message) errors.message = 'A little more detail, please'
  return { fields: Object.keys(errors).length ? undefined : fields, errors }
}

export async function POST(request: Request): Promise<Response> {
  let body: Payload
  try {
    body = (await request.json()) as Payload
  } catch {
    return json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: real people never see or fill this field.
  if (typeof body.company === 'string' && body.company.trim()) return json({ ok: true })

  const { fields, errors } = validate(body)
  if (!fields) return json({ error: 'Please fix the highlighted fields.', fields: errors }, { status: 422 })

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!apiKey || !to) {
    return json({ error: 'The contact form is not configured on this deployment yet.' }, { status: 503 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to: [to],
      reply_to: fields.email,
      subject: `[Portfolio] ${fields.subject}`,
      text: `From: ${fields.name} <${fields.email}>\n\n${fields.message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(fields.name)} &lt;${escapeHtml(fields.email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(fields.message)}</p>`,
    }),
  })

  if (!res.ok) return json({ error: 'The message could not be sent. Please try again or email me directly.' }, { status: 502 })
  return json({ ok: true })
}
