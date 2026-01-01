import DeleteButton from '@/components/article/DeleteButton';
import { defaultAPI } from '@/utils/fetcher';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { Spinner } from '@workspace/ui/components/spinner';
import { SquarePen } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';

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
      <div className="sticky z-50 top-12 bg-white">
        <div className="flex justify-between items-center px-6">
          <h2 className="my-4 text-3xl font-semibold tracking-tight mr-auto">
            {status === 'pending' ? <Spinner /> : data?.title || '-'}
          </h2>
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
        </div>
        <Separator className="mb-2 shadow" />
      </div>
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
              {data.content.split('\n').map((p) => (
                <p className="my-1 min-h-[1.5em]">{p}</p>
              ))}
            </section>
          </>
        )}
      </section>
    </>
  );
}
