import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/edit')({ component: App });

function App() {
  return <div>edit</div>;
}
