import { AuthShell }  from '@/components/auth/AuthShell'
import { SignInForm }  from '@/components/auth/SignInForm'

export const metadata = {
  title: 'Sign In',
}

export default function SignInPage() {
  return (
    <AuthShell
      heading="Welcome back"
      subheading="Sign in to your BuildLab account to continue."
    >
      <SignInForm />
    </AuthShell>
  )
}