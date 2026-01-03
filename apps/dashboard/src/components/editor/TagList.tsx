import { useVirtualizer } from '@tanstack/react-virtual';
import { Tag } from '@workspace/api';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { Item, ItemGroup } from '@workspace/ui/components/item';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { cn } from '@workspace/ui/lib/utils';
import { CircleCheck, CirclePlus, SearchIcon, X } from 'lucide-react';
import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import HighlightText from '../HighlightText';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@workspace/ui/components/input-group';
import { Spinner } from '@workspace/ui/components/spinner';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { authedAPI, defaultAPI } from '@/utils/fetcher';
import { TAG_PER_PAGE_LIMIT } from '@/utils/constants';
import { useDebounceValue } from 'usehooks-ts';

interface ITagList {
  tags: Tag[];
  addTag: (tag: Tag) => void;
  removeTag: (tag: Tag) => void;
  presetSearch: string;
}

export default function TagList({
  tags,
  addTag,
  removeTag,
  presetSearch,
}: ITagList) {
  const [searchingTagName, setSearchingTagName] = useState(presetSearch);
  const [debouncedSearchingTagName, setDebouncedSearchingTabName] =
    useDebounceValue(searchingTagName, 500);
  const fetchTags = useCallback(
    async ({ pageParam: lastID }: { pageParam: string }) => {
      const response = await defaultAPI.tagsGet({
        lastID,
        limit: TAG_PER_PAGE_LIMIT,
        ...(debouncedSearchingTagName && { name: debouncedSearchingTagName }),
      });
      return response;
    },
    [debouncedSearchingTagName],
  );

  const queryClient = useQueryClient();

  const createNewTagMutation = useMutation({
    mutationFn: useCallback(async (newTagName: string) => {
      const response = await authedAPI.tagPost({
        tagPostRequest: { name: newTagName },
      });
      return response;
    }, []),
    onSuccess: (tag) => addTag(tag),
    onSettled: (tag) =>
      queryClient.invalidateQueries({ queryKey: ['tags', tag?.name] }),
  });

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['tags', debouncedSearchingTagName],
    queryFn: fetchTags,
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextID,
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const allRows = data ? data.pages.flatMap((d) => d.tags) : [];
  const rowVirtualizer = useVirtualizer({
    count: allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 30,
    overscan: 10,
    gap: 8,
    paddingStart: 4,
    paddingEnd: 4,
  });
  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (!lastItem) {
      return;
    }
    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);
  return (
    <>
      <InputGroup>
        <InputGroupInput
          placeholder="Search by tag name"
          value={searchingTagName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setSearchingTagName(event.target.value);
            setDebouncedSearchingTabName(event.target.value);
          }}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {status === 'pending' && <Spinner />}
          {searchingTagName && (
            <InputGroupButton
              variant="outline"
              className="rounded-full"
              size="icon-xs"
              onClick={() => {
                setSearchingTagName('');
              }}
            >
              <X />
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
      <Card className="mt-2 py-0 px-1 h-96 overflow-auto" ref={parentRef}>
        {status === 'pending' ? (
          <ItemGroup>
            {Array.from({ length: 10 }, (_, k) => (
              <Item key={k} className="p-1 my-1">
                <Skeleton className="h-5 w-80" />
              </Item>
            ))}
          </ItemGroup>
        ) : status === 'error' ? (
          <span>Error: {error?.message}</span>
        ) : (
          <>
            {data.pages[0].tags.length === 0 && !hasNextPage ? (
              <Button
                variant="link"
                className="mt-10 max-w-50 mx-auto whitespace-normal!"
                onClick={() => {
                  if (createNewTagMutation.isPending) return;
                  createNewTagMutation.mutate(debouncedSearchingTagName);
                }}
              >
                {createNewTagMutation.isPending ? (
                  <Spinner />
                ) : (
                  <CirclePlus className="mr-1" />
                )}
                Create tag: {debouncedSearchingTagName}
              </Button>
            ) : (
              <ItemGroup
                className="w-full relative"
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const tag = allRows[virtualRow.index];
                  const isSelected = tags.find(({ id }) => id === tag.id);
                  return (
                    <Item
                      className="p-1 my-1"
                      asChild
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      key={tag.id}
                    >
                      <a
                        href="#"
                        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                          event.preventDefault();
                          isSelected ? removeTag(tag) : addTag(tag);
                        }}
                        className={cn(
                          isSelected &&
                            'bg-gray-900! text-white hover:bg-gray-900 ',
                          'gap-0!',
                        )}
                      >
                        {isSelected ? (
                          <>
                            <CircleCheck size={16} className="mr-1" />
                            {tag.name}
                          </>
                        ) : (
                          <HighlightText
                            text={tag.name}
                            keywords={[debouncedSearchingTagName]}
                          />
                        )}
                      </a>
                    </Item>
                  );
                })}
              </ItemGroup>
            )}
            {hasNextPage && isFetchingNextPage && (
              <Button className="my-2">
                <Spinner />
                Loading
              </Button>
            )}
          </>
        )}
      </Card>
    </>
  );
}
