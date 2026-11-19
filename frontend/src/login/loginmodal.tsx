import { useState, type SubmitEvent } from 'react'
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Mail, Phone, Sparkles, User } from 'lucide-react'
import Popup from '../popup/popup'
import './loginmodal.css'

type LoginModalProps = Readonly<{
  isOpen: boolean
  onClose: () => void
}>

type Mode = 'login' | 'signup'
type Method = 'email' | 'phone'

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+971', label: '🇦🇪 +971' },
]

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [method, setMethod] = useState<Method>('email')
  const [otpSent, setOtpSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isLogin = mode === 'login'
  const isPhone = method === 'phone'

  function changeMode(next: Mode) {
    setMode(next)
    setOtpSent(false)
  }

  function changeMethod(next: Method) {
    setMethod(next)
    setOtpSent(false)
  }

  function handleGoogleClick() {
    // UI only — hook up Google OAuth here later
    onClose()
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    // UI only — phone flow: first submit "sends" the code, second submit verifies
    if (isPhone && !otpSent) {
      setOtpSent(true)
      return
    }
    onClose()
  }

  let submitLabel = isLogin ? 'Log in' : 'Create account'
  if (isPhone) submitLabel = otpSent ? 'Verify & continue' : 'Send code'

  const title = isLogin ? 'Welcome back' : 'Create your account'
  const subtitle = isLogin
    ? 'Log in to pick up where you left off.'
    : 'Sign up to save your chats and sync across devices.'

  return (
    <Popup isOpen={isOpen} onClose={onClose} labelledBy="login-modal-title">
      <header className="auth-header">
        <div className="auth-logo" aria-hidden="true">
          <Sparkles size={22} />
        </div>
        <h2 id="login-modal-title">{title}</h2>
        <p className="auth-subtitle">{subtitle}</p>
      </header>

      <button type="button" className="google-button" onClick={handleGoogleClick}>
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <div className="segmented">
        <span className={isPhone ? 'segmented-thumb right' : 'segmented-thumb'} aria-hidden="true" />
        <button
          type="button"
          className={isPhone ? 'segment' : 'segment active'}
          aria-pressed={!isPhone}
          onClick={() => changeMethod('email')}
        >
          <Mail size={15} /> Email
        </button>
        <button
          type="button"
          className={isPhone ? 'segment active' : 'segment'}
          aria-pressed={isPhone}
          onClick={() => changeMethod('phone')}
        >
          <Phone size={15} /> Phone
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="field">
            <User size={17} className="field-icon" aria-hidden="true" />
            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              aria-label="Full name"
              autoComplete="name"
              required
            />
          </div>
        )}

        {isPhone ? (
          <>
            <div className="phone-row">
              <select
                className="country-select"
                name="countryCode"
                aria-label="Country code"
                defaultValue="+91"
                disabled={otpSent}
              >
                {COUNTRY_CODES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </select>
              <div className="field">
                <Phone size={17} className="field-icon" aria-hidden="true" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  aria-label="Phone number"
                  autoComplete="tel-national"
                  inputMode="numeric"
                  pattern="[0-9]{6,15}"
                  readOnly={otpSent}
                  required
                />
              </div>
            </div>

            {otpSent && (
              <>
                <p className="otp-hint">We sent a 6-digit code to your phone.</p>
                <div className="field">
                  <KeyRound size={17} className="field-icon" aria-hidden="true" />
                  <input
                    className="otp-input"
                    type="text"
                    name="otp"
                    placeholder="••••••"
                    aria-label="Verification code"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="otp-actions">
                  <button type="button" className="link-button muted" onClick={() => setOtpSent(false)}>
                    <ArrowLeft size={14} /> Change number
                  </button>
                  <button type="button" className="link-button">
                    Resend code
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="field">
              <Mail size={17} className="field-icon" aria-hidden="true" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                aria-label="Email address"
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <Lock size={17} className="field-icon" aria-hidden="true" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                aria-label="Password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                minLength={isLogin ? undefined : 8}
                required
              />
              <button
                type="button"
                className="field-action"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {isLogin ? (
              <button type="button" className="link-button forgot">
                Forgot password?
              </button>
            ) : (
              <p className="field-hint">Use at least 8 characters.</p>
            )}
          </>
        )}

        <button type="submit" className="auth-submit">
          {submitLabel}
        </button>
      </form>

      <p className="auth-switch">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          type="button"
          className="link-button"
          onClick={() => changeMode(isLogin ? 'signup' : 'login')}
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>

      <p className="auth-terms">
        By continuing, you agree to our <a href="#terms">Terms</a> and{' '}
        <a href="#privacy">Privacy Policy</a>.
      </p>
    </Popup>
  )
}

export default LoginModal
