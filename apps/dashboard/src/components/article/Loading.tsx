import { ArticlesGet200Response } from '@workspace/api';
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
      {Array.from({ length: 20 }, (_, k) => (
        <Item variant="outline" key={k} className="my-2">
          <ItemContent>
            <ItemTitle>
              <Skeleton className="h-4 w-[250px]" />
            </ItemTitle>
            <ItemDescription>
              <Skeleton className="h-4 w-[300px] mt-2.5" />
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
