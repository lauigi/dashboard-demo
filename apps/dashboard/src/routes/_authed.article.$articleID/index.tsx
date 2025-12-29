import { createFileRoute, useRouteContext } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/article/$articleID/')({
  component: App,
});

function App() {
  const { user } = useRouteContext({ from: '__root__' });
  return <div>show - {user?.email}</div>;
}
