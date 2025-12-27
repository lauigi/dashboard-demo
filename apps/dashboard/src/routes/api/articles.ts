import { createFileRoute } from '@tanstack/react-router';
import { articleList } from './-mockUtils';
import { ArticlesGet200Response } from '@workspace/api';

export const Route = createFileRoute('/api/articles')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get('limit'));
        const lastID = url.searchParams.get('lastID') as string;
        const author = url.searchParams.get('author') as string;
        let startIndex = 0;
        if (lastID) {
          startIndex = Math.max(
            articleList.findIndex((tag) => tag.id === lastID) + 1,
            0,
          );
        }
        let targetArticles = [...articleList];
        if (author) {
          targetArticles = articleList.filter(
            ({ username }) => username === author,
          );
        }
        const currentPageOfArticles = targetArticles.slice(
          startIndex,
          limit ? startIndex + limit : targetArticles.length,
        );
        const res: ArticlesGet200Response = {
          articles: currentPageOfArticles,
          hasMore: currentPageOfArticles.length < targetArticles.length,
          lastID: currentPageOfArticles[currentPageOfArticles.length - 1].id,
        };
        return Response.json(res);
      },
    },
  },
});
