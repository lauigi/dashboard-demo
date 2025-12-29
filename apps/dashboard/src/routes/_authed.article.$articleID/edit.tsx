import { createFileRoute, useRouteContext } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/article/$articleID/edit')({
  component: App,
});

function App() {
  const { user } = useRouteContext({ from: '__root__' });
  return <div>edit - {user?.email}</div>;
}
