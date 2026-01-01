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
import { MouseEvent } from 'react';
import HighlightText from '../HighlightText';
import { useAtom } from 'jotai';
import { titleKeywordAtom } from '@/utils/atoms';
import DeleteButton from './DeleteButton';

interface IArticle {
  article: Article;
  style: Record<string, string | number>;
}
export default function ArticleItem({
  article: { id, title, userEmail, tags },
  style,
}: IArticle) {
  const { user } = useRouteContext({ from: '__root__' });
  const navigate = useNavigate();
  const [titleKeyword] = useAtom(titleKeywordAtom);
  return (
    <Item variant="outline" className="my-2 flex-nowrap" style={style} asChild>
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
          <ItemTitle className="whitespace-nowrap text-ellipsis overflow-hidden h-5 gap-0">
            <HighlightText text={title} keywords={[titleKeyword]} />
          </ItemTitle>
          <ItemDescription className="line-clamp-1 h-5.5">
            {userEmail}{' '}
            {tags.map(({ name, id }) => (
              <Badge key={id} variant="secondary" className="ml-2">
                {name}
              </Badge>
            ))}
          </ItemDescription>
        </ItemContent>
        {(userEmail === user?.email || user?.isAdmin) && (
          <ItemActions>
            <ButtonGroup>
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
