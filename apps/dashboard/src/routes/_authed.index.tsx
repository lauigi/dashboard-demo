import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/')({ component: App });

function App() {
  return <div>index</div>;
}
