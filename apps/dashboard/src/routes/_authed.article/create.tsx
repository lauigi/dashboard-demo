import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { BookCheck } from 'lucide-react';

export const Route = createFileRoute('/_authed/article/create')({
  component: App,
});

function App() {
  const { user } = Route.useRouteContext();
  return (
    <>
      <div className="sticky z-50 top-12 bg-white">
        <div className="flex justify-between items-center px-6">
          <h2 className="my-4 text-3xl font-semibold tracking-tight mr-auto">
            Create Article
          </h2>
          <Button size="sm">
            <BookCheck /> Publish
          </Button>
        </div>
        <Separator className="mb-2 shadow" />
      </div>
    </>
  );
}
