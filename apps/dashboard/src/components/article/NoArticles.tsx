import { Link } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@workspace/ui/components/empty';
import { FilePlusCorner } from 'lucide-react';

export default function NoArticles({ searchTitle }: { searchTitle: string }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FilePlusCorner />
        </EmptyMedia>
        <EmptyTitle>No Article Yet</EmptyTitle>
        <EmptyDescription>
          {searchTitle
            ? `No articles were found with this title. Would you like to create one?`
            : `You haven't created any articles yet. Get started by creating
          your first article.`}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <Link to="/article/create" search={{ presetTitle: searchTitle }}>
            Create Article
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
