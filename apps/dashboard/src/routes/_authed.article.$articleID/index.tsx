import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/article/$articleID/')({
  component: App,
});

function App() {
  const { user } = Route.useRouteContext();
  return <div>show - {user?.email}</div>;
}
