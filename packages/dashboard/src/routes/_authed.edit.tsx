import { createFileRoute, useRouteContext } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/edit')({ component: App });

function App() {
  const { user } = useRouteContext({ from: '/' });
  return <div>edit - {user.email}</div>;
}
