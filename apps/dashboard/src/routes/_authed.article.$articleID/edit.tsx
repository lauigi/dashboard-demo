import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/article/$articleID/edit')({
  component: App,
});

function App() {
  const { user } = Route.useRouteContext();
  return <div>edit - {user?.email}</div>;
}
