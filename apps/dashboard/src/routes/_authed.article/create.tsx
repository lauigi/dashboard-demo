import ResetButton from '@/components/article/ResetButton';
import Editor, { ArticleDraft, EditorHandle } from '@/components/editor';
import { authedAPI } from '@/utils/fetcher';
import { useMutation } from '@tanstack/react-query';
import {
  ClientOnly,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { Spinner } from '@workspace/ui/components/spinner';
import { BookCheck } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authed/article/create')({
  component: App,
});

function App() {
  const editorRef = useRef<EditorHandle>(null);
  const navigate = useNavigate();
  const publishMutation = useMutation({
    mutationFn: useCallback(async (draft: ArticleDraft) => {
      const response = await authedAPI.articlePost({
        articlePostRequest: { ...draft },
      });
      return response;
    }, []),
    onSuccess: ({ id }) => {
      navigate({
        to: '/article/$articleID',
        params: {
          articleID: id,
        },
      });
      editorRef.current?.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleSubmit = () => {
    const draft = editorRef.current?.getData();
    console.log(draft);
    if (draft) {
      publishMutation.mutate(draft);
    }
  };
  return (
    <>
      <div className="sticky z-50 top-12 bg-white">
        <div className="flex justify-between items-center px-6">
          <h2 className="my-4 text-3xl font-semibold tracking-tight mr-auto">
            Create Article
          </h2>
          <ResetButton onConfirm={() => editorRef.current?.reset()} />
          <Button size="sm" onClick={handleSubmit}>
            {publishMutation.isPending ? <Spinner /> : <BookCheck />} Publish
          </Button>
        </div>
        <Separator className="mb-2 shadow" />
      </div>
      <section className="my-2 mx-14">
        {/* To avoid hydration mismatch due to using atomWithStorage */}
        <ClientOnly fallback={<Spinner className="mx-auto my-4" />}>
          <Editor ref={editorRef} disabled={publishMutation.isPending} />
        </ClientOnly>
      </section>
    </>
  );
}
