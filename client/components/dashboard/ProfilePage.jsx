'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Eye, EyeOff, Mail, Lock, User, Camera, ShieldCheck,
  CheckCircle2, XCircle, AlertCircle, ChevronRight,
} from 'lucide-react'
import {
  useGetCurrentUserQuery,
  useUpdateUsernameMutation,
  useUpdatePasswordMutation,
  useUpdateAvatarMutation,
} from '@/services/userApi'

/* ─────────────────────────────────────────────────────────────
   useFeedback — auto-dismisses after 10 s (logic unchanged)
───────────────────────────────────────────────────────────── */
function useFeedback() {
  const [feedback, setFeedbackRaw] = useState(null)
  const timerRef = useRef(null)

  const setFeedback = useCallback((val) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setFeedbackRaw(val)
    if (val) {
      timerRef.current = setTimeout(() => setFeedbackRaw(null), 10000)
    }
  }, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return [feedback, setFeedback]
}

/* ─────────────────────────────────────────────────────────────
   Feedback
───────────────────────────────────────────────────────────── */
function Feedback({ type, message }) {
  if (!message) return null
  const isSuccess = type === 'success'
  const Icon = isSuccess ? CheckCircle2 : XCircle
  return (
    <div className={[
      'flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg mt-3 text-xs font-medium',
      isSuccess
        ? 'text-green-400 bg-green-400/[0.07] border border-green-400/[0.18]'
        : 'text-red-400 bg-red-400/[0.07] border border-red-400/[0.18]',
    ].join(' ')}>
      <Icon size={14} className="mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Field
───────────────────────────────────────────────────────────── */
function Field({ label, id, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-2)]"
      >
        {label}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <AlertCircle size={11} className="text-[var(--red)] flex-shrink-0" />
          <p className="text-xs text-[var(--red)]">{error}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Input
───────────────────────────────────────────────────────────── */
function Input({ id, type = 'text', value, onChange, placeholder, disabled, autoComplete, suffix }) {
  return (
    <div className="relative flex items-center">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={[
          'w-full h-11 px-4 rounded-lg text-sm outline-none transition-all duration-150',
          'bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text-1)]',
          'focus:border-[var(--red-border)] focus:ring-2 focus:ring-[var(--red-muted)]',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          suffix ? 'pr-11' : '',
        ].join(' ')}
      />
      {suffix && (
        <div className="absolute right-3 flex items-center">{suffix}</div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   PasswordInput — logic unchanged
───────────────────────────────────────────────────────────── */
function PasswordInput({ id, value, onChange, placeholder, disabled, autoComplete }) {
  const [show, setShow] = useState(false)
  const Icon = show ? EyeOff : Eye

  return (
    <Input
      id={id}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      suffix={
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(s => !s)}
          className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-150"
        >
          <Icon size={15} />
        </button>
      }
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   PasswordStrengthMeter — logic unchanged
───────────────────────────────────────────────────────────── */
const STRENGTH_RULES = [
  { label: 'At least 8 characters', test: v => v.length >= 8 },
  { label: 'Uppercase letter',       test: v => /[A-Z]/.test(v) },
  { label: 'Number',                 test: v => /[0-9]/.test(v) },
  { label: 'Special character',      test: v => /[^A-Za-z0-9]/.test(v) },
]

const STRENGTH_META = [
  { label: 'Weak',   barClass: 'bg-red-500',    textClass: 'text-red-500'    },
  { label: 'Fair',   barClass: 'bg-orange-500',  textClass: 'text-orange-500'  },
  { label: 'Good',   barClass: 'bg-yellow-500',  textClass: 'text-yellow-500'  },
  { label: 'Strong', barClass: 'bg-green-500',   textClass: 'text-green-500'   },
]

function PasswordStrengthMeter({ password }) {
  if (!password) return null

  const passed = STRENGTH_RULES.filter(r => r.test(password)).length
  const meta   = STRENGTH_META[passed - 1] ?? STRENGTH_META[0]

  return (
    <div className="mt-2.5 flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {STRENGTH_META.map((m, i) => (
            <div
              key={i}
              className={[
                'h-1 flex-1 rounded-full transition-all duration-300',
                i < passed ? meta.barClass : 'bg-[var(--surface-3)]',
              ].join(' ')}
            />
          ))}
        </div>
        <span className={`text-xs font-semibold w-14 text-right transition-colors duration-300 ${meta.textClass}`}>
          {meta.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {STRENGTH_RULES.map((rule, i) => {
          const ok = rule.test(password)
          return (
            <div key={i} className="flex items-center gap-1.5">
              <CheckCircle2
                size={11}
                className={`flex-shrink-0 transition-colors duration-200 ${ok ? 'text-green-500' : 'text-[var(--text-3)]'}`}
              />
              <span className={`text-xs transition-colors duration-200 ${ok ? 'text-[var(--text-2)]' : 'text-[var(--text-3)]'}`}>
                {rule.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Card
───────────────────────────────────────────────────────────── */
function Card({ title, description, icon: Icon, children }) {
  return (
    <div className="rounded-xl overflow-hidden bg-[var(--surface-2)] border border-[var(--border)]">
      <div className="px-5 sm:px-6 py-4 flex items-center gap-3 border-b border-[var(--border)]">
        {Icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--red-muted)] border border-[var(--red-border)]">
            <Icon size={15} className="text-[var(--red)]" />
          </div>
        )}
        <div>
          <h2 className="text-sm font-semibold font-display text-[var(--text-1)]">{title}</h2>
          {description && (
            <p className="text-xs mt-0.5 text-[var(--text-3)]">{description}</p>
          )}
        </div>
      </div>
      <div className="px-5 sm:px-6 py-5">{children}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SubmitButton
───────────────────────────────────────────────────────────── */
function SubmitButton({ loading, disabled, label, loadingLabel = 'Saving…' }) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="h-10 px-6 text-sm font-semibold font-display rounded-lg text-white flex items-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--red)] hover:bg-[var(--red-deep)]"
    >
      {loading
        ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />{loadingLabel}</>
        : <>{label}<ChevronRight size={14} /></>
      }
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────
   AvatarSection — logic unchanged
───────────────────────────────────────────────────────────── */
function AvatarSection({ user }) {
  const [updateAvatar, { isLoading }] = useUpdateAvatarMutation()
  const [preview,  setPreview]  = useState(null)
  const [feedback, setFeedback] = useFeedback()
  const fileRef = useRef(null)

  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const MAX_SIZE_MB   = 2

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFeedback({ type: 'error', message: 'Only JPG, PNG, or WebP images are allowed.' })
      e.target.value = ''
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFeedback({ type: 'error', message: `File must be under ${MAX_SIZE_MB}MB.` })
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)

    setFeedback(null)
    try {
      await updateAvatar(file).unwrap()
      setFeedback({ type: 'success', message: 'Profile picture updated.' })
    } catch (err) {
      setPreview(null)
      setFeedback({ type: 'error', message: err?.data?.message ?? 'Upload failed. Please try again.' })
    }
    e.target.value = ''
  }

  const avatarSrc = preview ?? user?.avatar ?? user?.profilePicture ?? null
  const initials  = (user?.username ?? user?.email ?? 'U')[0].toUpperCase()

  return (
    <Card title="Profile Picture" description="JPG, PNG, or WebP · Max 2 MB" icon={Camera}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

        {/* Avatar with gradient ring */}
        <div className="relative flex-shrink-0 p-[2px] rounded-full bg-gradient-to-br from-[var(--red)] to-[var(--red-deep)]">
          <div className={[
            'w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold select-none',
            avatarSrc ? '' : 'bg-[var(--surface-3)]',
          ].join(' ')}>
            {avatarSrc
              ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
              : <span className="text-[var(--red)] font-display">{initials}</span>
            }
          </div>
          {!isLoading && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center bg-[var(--red)] border-2 border-[var(--surface-2)]"
              aria-label="Change avatar"
            >
              <Camera size={11} color="#fff" />
            </button>
          )}
        </div>

        {/* Info + upload */}
        <div className="flex flex-col gap-1.5 text-center sm:text-left w-full sm:w-auto">
          <p className="text-base font-semibold font-display text-[var(--text-1)]">
            {user?.username ?? 'Anonymous'}
          </p>
          <p className="text-xs text-[var(--text-3)]">{user?.email ?? '—'}</p>

          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload profile picture"
          />

          <button
            type="button"
            disabled={isLoading}
            onClick={() => fileRef.current?.click()}
            className="mt-2 h-9 px-4 text-xs font-medium rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed self-center sm:self-start flex items-center gap-2 bg-[var(--surface-3)] border border-[var(--border-strong)] text-[var(--text-2)] hover:border-[var(--red-border)] hover:text-[var(--text-1)]"
          >
            <Camera size={13} />
            {isLoading ? 'Uploading…' : (avatarSrc ? 'Replace Photo' : 'Upload Photo')}
          </button>
        </div>
      </div>

      <Feedback type={feedback?.type} message={feedback?.message} />
    </Card>
  )
}

/* ─────────────────────────────────────────────────────────────
   UsernameSection — logic unchanged
───────────────────────────────────────────────────────────── */
function UsernameSection({ user }) {
  const [updateUsername, { isLoading }] = useUpdateUsernameMutation()
  const [username, setUsername] = useState(user?.username ?? '')
  const [feedback, setFeedback] = useFeedback()

  useEffect(() => {
    if (user?.username && !username) setUsername(user.username)
  }, [user?.username]) // eslint-disable-line

  const isDirty   = username !== (user?.username ?? '')
  const tooShort  = username.trim().length > 0 && username.trim().length < 3
  const canSubmit = isDirty && !tooShort && username.trim().length >= 3

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setFeedback(null)
    try {
      await updateUsername({ username: username.trim() }).unwrap()
      setFeedback({ type: 'success', message: 'Username updated successfully.' })
    } catch (err) {
      setFeedback({ type: 'error', message: err?.data?.message ?? 'Failed to update username.' })
    }
  }

  return (
    <Card title="Username" description="Displayed across the platform." icon={User}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Username"
          id="username"
          error={tooShort ? 'At least 3 characters required.' : undefined}
        >
          <Input
            id="username"
            value={username}
            onChange={e => { setUsername(e.target.value); setFeedback(null) }}
            placeholder="Enter username"
            disabled={isLoading}
            autoComplete="username"
          />
        </Field>

        <div className="flex items-center gap-3 flex-wrap">
          <SubmitButton loading={isLoading} disabled={!canSubmit} label="Save Username" />
          {isDirty && !isLoading && (
            <button
              type="button"
              onClick={() => { setUsername(user?.username ?? ''); setFeedback(null) }}
              className="h-10 px-4 text-sm rounded-lg transition-colors duration-150 text-[var(--text-3)] hover:text-[var(--text-2)]"
            >
              Cancel
            </button>
          )}
        </div>

        <Feedback type={feedback?.type} message={feedback?.message} />
      </form>
    </Card>
  )
}

/* ─────────────────────────────────────────────────────────────
   EmailSection
───────────────────────────────────────────────────────────── */
function EmailSection({ user }) {
  return (
    <Card title="Email Address" description="Your sign-in email — cannot be changed." icon={Mail}>
      <div className="h-11 px-4 flex items-center rounded-lg text-sm gap-3 select-all bg-[var(--surface-3)] border border-[var(--border)]">
        <Mail size={14} className="text-[var(--text-3)] flex-shrink-0" />
        <span className="flex-1 text-sm text-[var(--text-2)]">{user?.email ?? '—'}</span>
        <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-3)]">
          <Lock size={10} />
          locked
        </span>
      </div>
    </Card>
  )
}

/* ─────────────────────────────────────────────────────────────
   PasswordSection — logic unchanged
───────────────────────────────────────────────────────────── */
function PasswordSection() {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation()
  const [form, setForm]         = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [errors, setErrors]     = useState({})
  const [feedback, setFeedback] = useFeedback()

  const setField = (key, val) => {
    setForm(p => ({ ...p, [key]: val }))
    setErrors(p => ({ ...p, [key]: '' }))
    setFeedback(null)
  }

  const validate = () => {
    const e = {}
    if (!form.currentPassword)             e.currentPassword = 'Current password is required.'
    if (form.newPassword.length < 8)       e.newPassword     = 'New password must be at least 8 characters.'
    if (form.newPassword !== form.confirm) e.confirm         = 'Passwords do not match.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setFeedback(null)
    try {
      await updatePassword({
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      }).unwrap()
      setForm({ currentPassword: '', newPassword: '', confirm: '' })
      setFeedback({ type: 'success', message: 'Password updated successfully.' })
    } catch (err) {
      setFeedback({ type: 'error', message: err?.data?.message ?? 'Failed to update password.' })
    }
  }

  return (
    <Card title="Change Password" description="Use a strong password with at least 8 characters." icon={ShieldCheck}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <Field label="Current Password" id="currentPassword" error={errors.currentPassword}>
          <PasswordInput
            id="currentPassword"
            value={form.currentPassword}
            onChange={e => setField('currentPassword', e.target.value)}
            placeholder="Enter current password"
            disabled={isLoading}
            autoComplete="current-password"
          />
        </Field>

        <div className="h-px w-full bg-[var(--border)]" />

        <Field label="New Password" id="newPassword" error={errors.newPassword}>
          <PasswordInput
            id="newPassword"
            value={form.newPassword}
            onChange={e => setField('newPassword', e.target.value)}
            placeholder="Min. 8 characters"
            disabled={isLoading}
            autoComplete="new-password"
          />
          <PasswordStrengthMeter password={form.newPassword} />
        </Field>

        <Field label="Confirm Password" id="confirm" error={errors.confirm}>
          <PasswordInput
            id="confirm"
            value={form.confirm}
            onChange={e => setField('confirm', e.target.value)}
            placeholder="Repeat new password"
            disabled={isLoading}
            autoComplete="new-password"
          />
          {form.confirm && form.newPassword && (
            <div className="flex items-center gap-1.5 mt-1">
              {form.confirm === form.newPassword
                ? <><CheckCircle2 size={11} className="text-green-500" /><span className="text-xs text-green-500">Passwords match</span></>
                : <><XCircle      size={11} className="text-red-400"   /><span className="text-xs text-red-400">Passwords do not match</span></>
              }
            </div>
          )}
        </Field>

        <SubmitButton
          loading={isLoading}
          disabled={!form.currentPassword || !form.newPassword || !form.confirm}
          label="Update Password"
          loadingLabel="Updating…"
        />

        <Feedback type={feedback?.type} message={feedback?.message} />
      </form>
    </Card>
  )
}

/* ─────────────────────────────────────────────────────────────
   ProfilePage — main export
───────────────────────────────────────────────────────────── */
export function ProfilePage() {
  const { data, isLoading, isError } = useGetCurrentUserQuery()
  const user = data?.data ?? data ?? null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-[var(--red-border)] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--text-3)]">Loading profile…</p>
        </div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <div className="text-center px-6 py-8 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
          <XCircle size={28} className="mx-auto mb-3 text-[var(--red)]" />
          <p className="text-sm font-semibold font-display mb-1 text-[var(--text-1)]">
            Failed to load profile
          </p>
          <p className="text-xs text-[var(--text-3)]">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className="space-y-6">

      {/* Section heading */}
      <div>
        <h2 className="text-xl font-display text-[var(--text-1)]">
          Profile{' '}
          <span className="bg-gradient-to-r from-[var(--red)] to-[var(--red-deep)] bg-clip-text text-transparent">
            Settings
          </span>
        </h2>
        <p className="text-sm text-[var(--text-2)]">
          Manage your account details and security settings.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4 sm:gap-5 max-w-2xl">
        <AvatarSection   user={user} />
        <UsernameSection user={user} />
        <EmailSection    user={user} />
        <PasswordSection />
      </div>

      <p className="text-xs text-[var(--text-3)]">
        Changes are saved immediately to your account.
      </p>

    </section>
  )
}