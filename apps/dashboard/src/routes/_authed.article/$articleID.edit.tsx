import ResetButton from '@/components/article/ResetButton';
import Editor, { ArticleDraft, EditorHandle } from '@/components/editor';
import { GENERAL_MESSAGE, STATUS_CODES } from '@/utils/constants';
import { authedAPI, defaultAPI } from '@/utils/fetcher';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { Spinner } from '@workspace/ui/components/spinner';
import { BookCheck } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authed/article/$articleID/edit')({
  component: App,
});

function App() {
  const { user } = Route.useRouteContext();
  const { articleID } = Route.useParams();
  const queryClient = useQueryClient();
  const { status, data, error } = useQuery({
    queryKey: ['article', articleID],
    queryFn: async () => {
      const response = await defaultAPI.articleIdGet({ id: articleID });
      return response;
    },
  });
  const editorRef = useRef<EditorHandle>(null);
  const navigate = useNavigate();
  const publishMutation = useMutation({
    mutationFn: useCallback(async (draft: ArticleDraft) => {
      const response = await authedAPI.articleIdPut({
        id: articleID,
        articlePostRequest: { ...draft },
      });
      return response;
    }, []),
    onSuccess: async ({ id }) => {
      await queryClient.invalidateQueries({ queryKey: ['article', articleID] });
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
    if (data?.userID !== user?.id && !user?.isAdmin) {
      toast.error(GENERAL_MESSAGE[STATUS_CODES.unauthorized]);
      return;
    }
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
            Edit Article
          </h2>
          <ResetButton onConfirm={() => editorRef.current?.reset()} />
          <Button size="sm" onClick={handleSubmit}>
            {publishMutation.isPending ? <Spinner /> : <BookCheck />} Publish
          </Button>
        </div>
        <Separator className="mb-2 shadow" />
      </div>
      <section className="my-4 mx-14">
        {status === 'pending' ? (
          <Spinner className="mx-auto my-4" />
        ) : status === 'error' ? (
          <span>Error: {error.message}</span>
        ) : (
          <Editor
            preset={data}
            ref={editorRef}
            disabled={publishMutation.isPending}
          />
        )}
      </section>
    </>
  );
}
