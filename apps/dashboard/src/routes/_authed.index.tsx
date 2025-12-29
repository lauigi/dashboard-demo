import Articles from '@/components/article/List';
import ArticlesLoading from '@/components/article/Loading';
import { defaultAPI } from '@/utils/fetcher';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Spinner } from '@workspace/ui/components/spinner';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Label } from '@workspace/ui/components/label';

export const Route = createFileRoute('/_authed/')({ component: App });

function App() {
  const fetchArticles = async ({
    pageParam: lastID,
  }: {
    pageParam: string;
  }) => {
    const response = await defaultAPI.articlesGet({
      lastID,
      limit: 100,
    });
    return response;
  };
  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextID,
  });
  return (
    <main className="mt-2 px-6 pb-6">
      <div className="flex justify-between items-center">
        <h2 className="my-4 text-3xl font-semibold tracking-tight mr-auto">
          Article List
        </h2>
        <Checkbox id="onlyMine" className="mr-2" />
        <Label htmlFor="onlyMine">Show only my articles</Label>
      </div>
      {status === 'pending' ? (
        <ArticlesLoading />
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <Articles list={data?.pages ?? []} />
          {hasNextPage && (
            <Button
              className="my-2"
              onClick={() => {
                fetchNextPage();
              }}
            >
              {isFetchingNextPage ? (
                <>
                  <Spinner />
                  Loading
                </>
              ) : (
                'Load more'
              )}
            </Button>
          )}
        </>
      )}
    </main>
  );
}
