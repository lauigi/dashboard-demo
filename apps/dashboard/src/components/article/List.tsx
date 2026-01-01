import { ArticlesGet200Response } from '@workspace/api';
import { ItemGroup } from '@workspace/ui/components/item';
import ArticleItem from './ArticleItem';
import { useEffect, useRef } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useElementScrollRestoration } from '@tanstack/react-router';

interface IArticles {
  list: ArticlesGet200Response[];
  fetchNextPage: Function;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}
export default function Articles({
  list,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: IArticles) {
  const listRef = useRef<HTMLDivElement>(null);
  const scrollEntry = useElementScrollRestoration({
    getElement: () => window,
  });
  const allRows = list ? list.flatMap((d) => d.articles) : [];

  const rowVirtualizer = useWindowVirtualizer({
    count: allRows.length,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    estimateSize: () => 80,
    overscan: 5,
    gap: 16,
    initialOffset: scrollEntry?.scrollY,
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
    <ItemGroup
      ref={listRef}
      style={{
        height: `${rowVirtualizer.getTotalSize() + 16}px`,
        width: '100%',
        position: 'relative',
      }}
    >
      {rowVirtualizer.getVirtualItems().map((item) => (
        <ArticleItem
          key={item.key}
          article={allRows[item.index]}
          data-index={item.index}
          ref={rowVirtualizer.measureElement}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            // height: `${item.size}px`,
            transform: `translateY(${
              item.start - rowVirtualizer.options.scrollMargin
            }px)`,
          }}
        />
      ))}
    </ItemGroup>
  );
}
