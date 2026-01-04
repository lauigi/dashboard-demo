import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Spinner } from '@workspace/ui/components/spinner';
import { BookCheck } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

import ResetButton from '@/components/article/ResetButton';
import Editor, { ArticleDraft, EditorHandle } from '@/components/editor';
import TitleBar from '@/components/TitleBar';
import { GENERAL_MESSAGE, STATUS_CODES } from '@/utils/constants';
import { authedAPI, defaultAPI } from '@/utils/fetcher';

export const Route = createFileRoute('/_authed/article/$articleID/edit')({
  component: App,
});

function App() {
  const { user } = Route.useRouteContext();
  const { articleID } = Route.useParams();
  const queryClient = useQueryClient();
  const { status, data, error } = useQuery({
    queryKey: ['article', articleID],
    async queryFn() {
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
    async onSuccess({ id }) {
      await queryClient.invalidateQueries({ queryKey: ['article', articleID] });
      navigate({
        to: '/article/$articleID',
        params: {
          articleID: id,
        },
      });
      editorRef.current?.reset();
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const handleSubmit = () => {
    if (data?.userID !== user?.id && !user?.isAdmin) {
      toast.error(GENERAL_MESSAGE[STATUS_CODES.unauthorized]);
      return;
    }

    const draft = editorRef.current?.getData();
    if (draft) {
      publishMutation.mutate(draft);
    }
  };

  return (
    <>
      <TitleBar title="Edit Article">
        <ResetButton onConfirm={() => editorRef.current?.reset()} />
        <Button size="sm" onClick={handleSubmit}>
          {publishMutation.isPending ? <Spinner /> : <BookCheck />} Publish
        </Button>
      </TitleBar>
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
