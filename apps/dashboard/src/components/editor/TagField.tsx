import { Tag } from '@workspace/api';
import {
  ChangeEvent,
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FieldLabel, Field, FieldSet } from '@workspace/ui/components/field';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { Card } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import {
  ChevronsUpDown,
  CircleCheck,
  CirclePlus,
  SearchIcon,
  X,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@workspace/ui/components/input-group';
import { useDebounceValue } from 'usehooks-ts';
import { Spinner } from '@workspace/ui/components/spinner';
import { defaultAPI } from '@/utils/fetcher';
import { Item, ItemGroup } from '@workspace/ui/components/item';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Skeleton } from '@workspace/ui/components/skeleton';
import HighlightText from '../HighlightText';
import { cn } from '@workspace/ui/lib/utils';
import { TAG_PER_PAGE_LIMIT } from '@/utils/constants';

interface ITagField {
  tags: Tag[];
  addTag: (tag: Tag) => void;
  removeTag: (tag: Tag) => void;
}

const TagField = memo(function ({ tags, addTag, removeTag }: ITagField) {
  const [searchingTagName, setSearchingTagName] = useState('');
  const [debouncedSearchingTagName, setDebouncedSearchingTabName] =
    useDebounceValue(searchingTagName, 500, { leading: true });

  const fetchTags = useCallback(
    async ({ pageParam: lastID }: { pageParam: string }) => {
      console.log('call fetch tags', debouncedSearchingTagName);
      const response = await defaultAPI.tagsGet({
        lastID,
        limit: TAG_PER_PAGE_LIMIT,
        ...(debouncedSearchingTagName && { name: debouncedSearchingTagName }),
      });
      return response;
    },
    [debouncedSearchingTagName],
  );

  const createNewTag = () => {};

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
    gap: 4,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (!lastItem) {
      return;
    }
    console.log('call fetch effect');
    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      console.log('call fetch next');
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
    <FieldSet>
      <Field>
        <FieldLabel>Tags</FieldLabel>
        <Popover>
          <PopoverAnchor asChild>
            <Card className="py-2 w-120 max-w-120">
              <div className="flex px-2 flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag.id} className="text-center pl-5">
                    {tag.name}
                    <Button
                      size="icon-sm"
                      className="rounded-full"
                      onClick={() => removeTag(tag)}
                    >
                      <X />
                    </Button>
                  </Badge>
                ))}
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="rounded-full ml-auto">
                    <ChevronsUpDown />
                  </Button>
                </PopoverTrigger>
              </div>
            </Card>
          </PopoverAnchor>
          <PopoverContent
            className="w-100 p-2"
            side="right"
            align="start"
            alignOffset={-150}
          >
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
                  {Array.from({ length: 5 }, (_, k) => (
                    <Item key={k} className="p-1 my-1" asChild>
                      <Skeleton />
                    </Item>
                  ))}
                </ItemGroup>
              ) : status === 'error' ? (
                <span>Error: {error.message}</span>
              ) : (
                <>
                  {data?.pages[0].tags.length === 0 && !hasNextPage ? (
                    <Button onClick={createNewTag}>
                      <CirclePlus className="mr-1" />
                      Create {searchingTagName} tag
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
                          <Item className="p-1 my-1" asChild>
                            <a
                              key={tag.id}
                              href="#"
                              onClick={(
                                event: MouseEvent<HTMLAnchorElement>,
                              ) => {
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
          </PopoverContent>
        </Popover>
      </Field>
    </FieldSet>
  );
});

export default TagField;
