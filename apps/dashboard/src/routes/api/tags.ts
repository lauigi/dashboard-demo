import { createFileRoute } from '@tanstack/react-router';
import { TagsGet200Response } from '@workspace/api';

import { delay, tagList } from './-mockUtils';

export const Route = createFileRoute('/api/tags')({
  server: {
    handlers: {
      async GET({ request }) {
        await delay(0.5);
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

        const endingIndex = limit ? startIndex + limit : targetTags.length;
        const currentPageOfTags = targetTags.slice(startIndex, endingIndex);
        const res: TagsGet200Response = {
          tags: currentPageOfTags,
          nextID: targetTags[endingIndex]?.id ?? null,
        };
        return Response.json(res);
      },
    },
  },
});
