import { Article } from '@workspace/api';
import { Button } from '@workspace/ui/components/button';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemActions,
  ItemDescription,
} from '@workspace/ui/components/item';
import { Badge } from '@workspace/ui/components/badge';
import { Link, useNavigate, useRouteContext } from '@tanstack/react-router';
import { SquarePen } from 'lucide-react';
import { MouseEvent, Ref } from 'react';
import HighlightText from '../HighlightText';
import { useAtom } from 'jotai';
import { titleKeywordAtom } from '@/utils/atoms';
import DeleteButton from './DeleteButton';

interface IArticle {
  article: Article;
  style: Record<string, string | number>;
  ref: Ref<Element>;
}
export default function ArticleItem({
  article: { id, title, userEmail, tags },
  ref,
  style,
  ...props
}: IArticle) {
  const { user } = useRouteContext({ from: '__root__' });
  const navigate = useNavigate();
  const [titleKeyword] = useAtom(titleKeywordAtom);
  return (
    <Item
      variant="outline"
      className="my-2 flex-nowrap"
      ref={ref}
      style={style}
      asChild
      {...props}
    >
      <Link
        to={`/article/$articleID`}
        params={{
          articleID: id,
        }}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          if ((event.target as HTMLElement).tagName === 'BUTTON') {
            event.preventDefault();
          }
        }}
      >
        <ItemContent>
          <ItemTitle className="lg:h-5 gap-0">
            <HighlightText text={title} keywords={[titleKeyword]} />
          </ItemTitle>
          <ItemDescription className="lg:h-5.5">
            {userEmail}{' '}
            {tags.map(({ name, id }) => (
              <Badge key={id} variant="secondary" className="ml-2 mt-2 lg:mt-0">
                {name}
              </Badge>
            ))}
          </ItemDescription>
        </ItemContent>
        {(userEmail === user?.email || user?.isAdmin) && (
          <ItemActions>
            <ButtonGroup className="flex-wrap sm:flex-nowrap gap-y-2 w-auto! sm:w-fit">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate({
                    to: '/article/$articleID/edit',
                    params: {
                      articleID: id,
                    },
                  });
                }}
              >
                <SquarePen />
                Edit
              </Button>
              <DeleteButton articleTitle={title} />
            </ButtonGroup>
          </ItemActions>
        )}
      </Link>
    </Item>
  );
}
