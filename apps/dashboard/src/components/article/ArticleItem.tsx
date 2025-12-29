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
import { SquarePen, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { MouseEvent } from 'react';
import DeleteConfirmBtn from './DeleteConfirmBtn';

interface IArticle {
  article: Article;
}
export default function ArticleItem({
  article: { id, title, userEmail, tags },
}: IArticle) {
  const { user } = useRouteContext({ from: '__root__' });
  const navigate = useNavigate();
  return (
    <Item variant="outline" className="my-2 flex-nowrap" asChild>
      <Link
        to={`/article/$articleID`}
        params={{
          articleID: id,
        }}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          if ((event.target as HTMLElement).tagName === 'BUTTON') {
            event.preventDefault();
          }
          debugger;
        }}
      >
        <ItemContent>
          <ItemTitle className="whitespace-nowrap text-ellipsis overflow-hidden">
            {title}
          </ItemTitle>
          <ItemDescription className="line-clamp-1">
            {userEmail}{' '}
            {tags.map(({ name, id }) => (
              <Badge key={id} variant="secondary">
                {name}
              </Badge>
            ))}
          </ItemDescription>
        </ItemContent>
        {userEmail === user?.email && (
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
              <AlertDialog
                onClick={(event) => {
                  debugger;
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Deleting - {title}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <DeleteConfirmBtn />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ButtonGroup>
          </ItemActions>
        )}
      </Link>
    </Item>
  );
}
