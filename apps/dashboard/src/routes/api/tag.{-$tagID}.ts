import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/tag/{-$tagID}')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const res = await request.json();
        return new Response(JSON.stringify({ message: `Hello, ${res}!` }));
      },
    },
  },
});
