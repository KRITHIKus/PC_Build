import { AuthShell }  from '@/components/auth/AuthShell'
import { SignUpForm }  from '@/components/auth/SignUpForm'

export const metadata = {
  title: 'Create Account',
}

export default function SignUpPage() {
  return (
    <AuthShell
      heading="Create your account"
      subheading="Join BuildLab and start configuring your perfect machine."
    >
      <SignUpForm />
    </AuthShell>
  )
}