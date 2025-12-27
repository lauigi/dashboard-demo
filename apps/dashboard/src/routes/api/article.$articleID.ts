import { createFileRoute } from '@tanstack/react-router';
import { articleList, GENERAL_MESSAGE, STATUS_CODES } from './-mockUtils';

export const Route = createFileRoute('/api/article/$articleID')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const articleID = params.articleID;
        if (!articleID) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.badRequest] },
            { status: STATUS_CODES.badRequest },
          );
        }
        const article = articleList.find(({ id }) => id === articleID);
        if (!article) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.notFound] },
            { status: STATUS_CODES.notFound },
          );
        }
        return new Response(JSON.stringify({ message: `Hello!` }));
      },
    },
  },
});
