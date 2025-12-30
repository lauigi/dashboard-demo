import {
  EmptyHeader,
  Empty,
  EmptyMedia,
  EmptyDescription,
  EmptyTitle,
  EmptyContent,
} from '@workspace/ui/components/empty';
import { FilePlusCorner } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

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
            : `You haven&apos;t created any articles yet. Get started by creating
          your first article.`}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create Article</Button>
      </EmptyContent>
    </Empty>
  );
}
