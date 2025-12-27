import { createFileRoute } from '@tanstack/react-router';
import { TagsGet200Response } from '@workspace/api';
import { tagList } from './-mockUtils';

export const Route = createFileRoute('/api/tags')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get('limit'));
        const lastID = url.searchParams.get('lastID') as string;
        const searchQuery = url.searchParams.get('name') as string;
        let startIndex = 0;
        if (lastID) {
          startIndex = Math.max(
            tagList.findIndex((tag) => tag.id === lastID) + 1,
            0,
          );
        }
        let targetTags = [...tagList];
        if (searchQuery) {
          targetTags = tagList.filter(({ name }) => name.includes(searchQuery));
        }
        const currentPageOfTags = targetTags.slice(
          startIndex,
          limit ? startIndex + limit : targetTags.length,
        );
        const res: TagsGet200Response = {
          tags: currentPageOfTags,
          hasMore: currentPageOfTags.length < targetTags.length,
          lastID: currentPageOfTags[currentPageOfTags.length - 1].id,
        };
        return Response.json(res);
      },
    },
  },
});
