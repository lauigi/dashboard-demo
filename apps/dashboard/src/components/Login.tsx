import { useMutation } from '../hooks/useMutation';
import { auth } from '@/lib/auth';
import { Button } from '@workspace/ui/components/button';

export function Login() {
  const loginMutation = useMutation({
    fn: auth.login,
  });

  return (
    <div className="fixed inset-0 bg-white dark:bg-black flex items-start justify-center p-8">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            loginMutation.mutate(formData.get('email') as string);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-xs">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white dark:bg-gray-800"
            />
          </div>
          <Button
            type="submit"
            className="uppercase"
            variant="outline"
            disabled={loginMutation.status === 'pending'}
          >
            {loginMutation.status === 'pending' ? '...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
