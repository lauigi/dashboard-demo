import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { Login } from '~/components/Login';
import { useAppSession } from '~/utils/session';

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    if (!data.email) {
      return {
        error: true,
        userNotFound: true,
        message: 'placeholder',
      };
    }
    const user = { email: data.email };
    // Check the email and password here
    // But for the demo, all allow through
    const session = await useAppSession();
    await session.update({
      userEmail: user.email,
    });
  });

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authenticated') {
      return <Login />;
    }

    throw error;
  },
});
