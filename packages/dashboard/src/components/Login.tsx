import { useMutation } from '../hooks/useMutation';
import { AuthForm } from './AuthForm';
import { auth } from '@/lib/auth';

export function Login() {
  const loginMutation = useMutation({
    fn: auth.login,
  });

  return (
    <AuthForm
      actionText="Login"
      status={loginMutation.status}
      onSubmit={(e) => {
        const formData = new FormData(e.target as HTMLFormElement);
        debugger;
        loginMutation.mutate(formData.get('email') as string);
      }}
      afterSubmit={null}
    />
  );
}
