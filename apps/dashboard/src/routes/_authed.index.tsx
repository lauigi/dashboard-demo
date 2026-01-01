import Articles from '@/components/article/List';
import ArticlesLoading from '@/components/article/Loading';
import { defaultAPI } from '@/utils/fetcher';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import { Spinner } from '@workspace/ui/components/spinner';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Label } from '@workspace/ui/components/label';
import { Kbd } from '@workspace/ui/components/kbd';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@workspace/ui/components/input-group';
import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { Separator } from '@workspace/ui/components/separator';
import { X, FilePlusCorner, SearchIcon } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts';
import NoArticles from '@/components/article/NoArticles';
import { mineFilterAtom, titleKeywordAtom } from '@/utils/atoms';
import { ARTICLE_PER_PAGE_LIMIT } from '@/utils/constants';
import TitleBar from '@/components/TitleBar';

export const Route = createFileRoute('/_authed/')({ component: App });

function App() {
  const [mineFilter, setMineFilter] = useAtom(mineFilterAtom);
  const { user } = Route.useRouteContext();
  const [searchTitle, setSearchTitle] = useState('');
  const [title, setTitle] = useAtom(titleKeywordAtom);
  const handleSearch = useDebounceCallback(setTitle, undefined, {
    leading: true,
  });
  const fetchArticles = useCallback(
    async ({ pageParam: lastID }: { pageParam: string }) => {
      const response = await defaultAPI.articlesGet({
        lastID,
        limit: ARTICLE_PER_PAGE_LIMIT,
        ...(mineFilter && { author: user?.email }),
        ...(title && { title }),
      });
      return response;
    },
    [mineFilter, title, user?.email],
  );
  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['articles', mineFilter, title],
    queryFn: fetchArticles,
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextID,
  });
  return (
    <>
      <TitleBar
        title="Article List"
        titleAppend={
          <Button className="md:mr-auto mx-3" size="sm" asChild>
            <Link to="/article/create">
              <FilePlusCorner /> Create
            </Link>
          </Button>
        }
      >
        <div className="flex items-center">
          {status === 'pending' ? (
            <Spinner className="mr-2" />
          ) : (
            <Checkbox
              id="only-mine"
              className="mr-2"
              defaultChecked={mineFilter}
              onCheckedChange={(checked: boolean) => {
                setMineFilter(checked);
              }}
            />
          )}
          <Label {...(status !== 'pending' && { htmlFor: 'only-mine' })}>
            Show only my articles
          </Label>
        </div>
        <div className="mx-3 h-8 sm:block hidden">
          <Separator orientation="vertical" />
        </div>
        <InputGroup className="w-65">
          <InputGroupInput
            id="search-title"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSearchTitle(event.target.value)
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (status === 'pending') return;
              if (e.key === 'Enter') {
                handleSearch(searchTitle);
              }
            }}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {searchTitle && (
              <InputGroupButton
                variant="outline"
                className="rounded-full"
                size="icon-xs"
                onClick={() => {
                  setSearchTitle('');
                  handleSearch('');
                }}
              >
                <X />
              </InputGroupButton>
            )}
            {status === 'pending' ? <Spinner /> : <Kbd>⏎</Kbd>}
          </InputGroupAddon>
        </InputGroup>
      </TitleBar>
      <main className="mt-2 px-6 pb-6">
        {status === 'pending' ? (
          <ArticlesLoading />
        ) : status === 'error' ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            {data?.pages[0].articles.length === 0 && !hasNextPage ? (
              <NoArticles searchTitle={searchTitle} />
            ) : (
              <Articles
                list={data.pages}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            )}
            {hasNextPage ? (
              <Button
                className="my-2"
                onClick={() => {
                  if (!isFetchingNextPage) fetchNextPage();
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
            ) : (
              <Button className="my-2" disabled>
                All loaded
              </Button>
            )}
          </>
        )}
      </main>
    </>
  );
}
