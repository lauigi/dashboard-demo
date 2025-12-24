import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({ component: App });

function App() {
  return <div>login</div>;
}
