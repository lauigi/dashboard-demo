import { useRouter } from '@tanstack/react-router';
import { useMutation } from '../hooks/useMutation';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from '@workspace/ui/components/card';
import { loginFn } from '@/routes/_authed';

export function Login() {
  const router = useRouter();
  const loginMutation = useMutation({
    fn: loginFn,
    onSuccess: async (ctx) => {
      if (!ctx.data?.error) {
        await router.invalidate();
        router.navigate({ to: '/' });
        return;
      }
    },
  });

  return (
    <div className="flex items-center justify-center p-24">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              loginMutation.mutate({
                data: {
                  email: formData.get('email') as string,
                  password: formData.get('password') as string,
                },
              });
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
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
