import Editor, { EditorHandle } from '@/components/editor';
import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { Spinner } from '@workspace/ui/components/spinner';
import { BookCheck } from 'lucide-react';
import { useRef } from 'react';

export const Route = createFileRoute('/_authed/article/create')({
  component: App,
});

function App() {
  const editorRef = useRef<EditorHandle>(null);
  const handleSubmit = () => {
    console.log(editorRef.current?.getData());
  };
  return (
    <>
      <div className="sticky z-50 top-12 bg-white">
        <div className="flex justify-between items-center px-6">
          <h2 className="my-4 text-3xl font-semibold tracking-tight mr-auto">
            Create Article
          </h2>
          <Button size="sm" onClick={handleSubmit}>
            <BookCheck /> Publish
          </Button>
        </div>
        <Separator className="mb-2 shadow" />
      </div>
      <section className="my-2 mx-14">
        {/* To avoid hydration mismatch due to using atomWithStorage */}
        <ClientOnly fallback={<Spinner className="mx-auto my-4" />}>
          <Editor ref={editorRef} />
        </ClientOnly>
      </section>
    </>
  );
}
