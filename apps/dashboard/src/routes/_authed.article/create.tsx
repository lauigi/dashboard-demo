import Editor, { ArticleDraft, EditorHandle } from '@/components/editor';
import { authedAPI } from '@/utils/fetcher';
import { useMutation } from '@tanstack/react-query';
import {
  ClientOnly,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { Spinner } from '@workspace/ui/components/spinner';
import { BookCheck, RotateCcw } from 'lucide-react';
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="mr-2">
                <RotateCcw /> Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This is going to reset all content to empty.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => editorRef.current?.reset()}>
                  Yes, reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
