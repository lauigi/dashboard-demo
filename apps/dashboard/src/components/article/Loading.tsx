import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@workspace/ui/components/item';
import { Skeleton } from '@workspace/ui/components/skeleton';

export default function ArticlesLoading() {
  return (
    <ItemGroup>
      {Array.from({ length: 8 }, (_, k) => (
        <Item variant="outline" key={k} className="my-2">
          <ItemContent>
            <ItemTitle>
              <Skeleton className="h-4 w-62.5" />
            </ItemTitle>
            <ItemDescription>
              <Skeleton className="h-4 w-75 mt-2.5" />
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
