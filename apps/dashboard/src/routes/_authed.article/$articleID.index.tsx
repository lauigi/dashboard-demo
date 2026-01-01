import DeleteButton from '@/components/article/DeleteButton';
import { defaultAPI } from '@/utils/fetcher';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Spinner } from '@workspace/ui/components/spinner';
import { SquarePen } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import TitleBar from '@/components/TitleBar';

export const Route = createFileRoute('/_authed/article/$articleID/')({
  component: App,
});

function App() {
  const { user } = Route.useRouteContext();
  const { articleID } = Route.useParams();
  const { status, data, error } = useQuery({
    queryKey: ['article', articleID],
    queryFn: async () => {
      const response = await defaultAPI.articleIdGet({ id: articleID });
      return response;
    },
  });
  return (
    <>
      <TitleBar title={status === 'pending' ? <Spinner /> : data?.title || '-'}>
        {status === 'success' &&
          (data?.userID === user?.id || user?.isAdmin) && (
            <>
              <Button size="sm" className="mr-2" asChild>
                <Link to="/article/$articleID/edit" params={{ articleID }}>
                  <SquarePen /> Edit
                </Link>
              </Button>
              <DeleteButton articleTitle={data?.title ?? ''} />
            </>
          )}
      </TitleBar>
      <section className="mb-8 mx-14">
        {status === 'pending' ? (
          <Spinner className="mx-auto my-4" />
        ) : status === 'error' ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <section className="my-4">
              {data.tags.map(({ name, id }) => (
                <Badge key={id} variant="secondary" className="mr-2">
                  {name}
                </Badge>
              ))}
            </section>
            <section className="my-4">
              {data.content.split('\n').map((p, index) => (
                <p key={index} className="my-1 min-h-[1.5em]">
                  {p}
                </p>
              ))}
            </section>
          </>
        )}
      </section>
    </>
  );
}
