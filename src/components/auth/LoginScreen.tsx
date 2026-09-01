import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LoginScreenProps {
  onLogin: () => void
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3a7.4 7.4 0 0 1-11-3.9H1.1v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.04 14.19a7.2 7.2 0 0 1 0-4.38V6.72H1.1a12 12 0 0 0 0 10.56l3.94-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.1 6.72l3.94 3.09A7.15 7.15 0 0 1 12 4.75Z"
      />
    </svg>
  )
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [loading, setLoading] = React.useState(false)

  const handleClick = () => {
    setLoading(true)
    window.setTimeout(() => {
      onLogin()
    }, 900)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-semibold text-accent-foreground">
            M
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Motion</h1>
          <p className="mt-3 text-base font-medium text-text">Your thoughts, in motion.</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Capture ideas, organize your notes, and find what matters.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm shadow-black/[0.02]">
          <Button
            className="w-full gap-2.5 border border-border bg-elevated text-text hover:bg-surface-hover"
            variant="secondary"
            size="lg"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleMark />
            )}
            {loading ? 'Signing in…' : 'Continue with Google'}
          </Button>
          <p className="mt-4 text-center text-xs leading-relaxed text-faint">
            This is a prototype — sign-in is simulated locally.
          </p>
        </div>
      </div>
    </div>
  )
}
