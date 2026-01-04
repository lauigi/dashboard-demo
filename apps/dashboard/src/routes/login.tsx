import { createFileRoute, redirect } from '@tanstack/react-router';

import { Login } from '~/components/Login';

export const Route = createFileRoute('/login')({
  beforeLoad({ context }) {
    if (context.user) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: () => <Login />,
});
