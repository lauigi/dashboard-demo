import { createFileRoute } from '@tanstack/react-router';
import { ArticlesGet200Response } from '@workspace/api';

import { articleList, delay } from './-mockUtils';

export const Route = createFileRoute('/api/articles')({
  server: {
    handlers: {
      async GET({ request }) {
        await delay(0.5);
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get('limit'));
        const lastID = url.searchParams.get('lastID') as string;
        const author = url.searchParams.get('author') as string;
        const searchTitle = url.searchParams.get('title') as string;
        let startIndex = 0;
        if (lastID) {
          startIndex = Math.max(
            articleList.findIndex((tag) => tag.id === lastID) + 1,
            0,
          );
        }

        let targetArticles = [...articleList];
        if (searchTitle) {
          targetArticles = articleList.filter(({ title }) =>
            title.includes(searchTitle),
          );
        }

        if (author) {
          targetArticles = targetArticles.filter(
            ({ userEmail }) => userEmail === author,
          );
        }

        const endingIndex = limit ? startIndex + limit : targetArticles.length;
        const currentPageOfArticles = targetArticles.slice(
          startIndex,
          endingIndex,
        );
        const res: ArticlesGet200Response = {
          articles: currentPageOfArticles,
          nextID: targetArticles[endingIndex]?.id ?? null,
        };
        return Response.json(res);
      },
    },
  },
});
