import { faker } from '@faker-js/faker';
import { createFileRoute } from '@tanstack/react-router';
import { Article, ArticlePostRequest } from '@workspace/api';
import { formatISO } from 'date-fns';

import { useAppSession } from '@/utils/session';

import {
  APP_TZ,
  articleList,
  delay,
  GENERAL_MESSAGE,
  STATUS_CODES,
  tagList,
} from './-mockUtils';

export const Route = createFileRoute('/api/article/{-$articleID}')({
  server: {
    handlers: {
      async GET({ params }) {
        await delay(0.5);
        const { articleID } = params;
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

        return Response.json(article);
      },
      async PUT({ request, params }) {
        await delay(0.5);
        const { articleID } = params;
        if (!articleID) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.badRequest] },
            { status: STATUS_CODES.badRequest },
          );
        }

        const articleIndex = articleList.findIndex(
          ({ id }) => id === articleID,
        );
        if (articleIndex === -1) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.notFound] },
            { status: STATUS_CODES.notFound },
          );
        }

        const session = await useAppSession();
        let article = articleList[articleIndex];
        if (
          article.userEmail !== session.data.userEmail &&
          !session.data.isAdmin
        ) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.unauthorized] },
            { status: STATUS_CODES.unauthorized },
          );
        }

        const { title, content, tags } =
          (await request.json()) as ArticlePostRequest;
        if (!title || !content) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.badRequest] },
            { status: STATUS_CODES.badRequest },
          );
        }

        article = {
          ...article,
          title,
          content,
          tags: tags
            .map(({ id: tagID }) => tagList.find(({ id }) => id === tagID))
            .filter((tag) => Boolean(tag)),
        };
        articleList.splice(articleIndex, 1, article);
        return Response.json(article);
      },
      async POST({ request }) {
        await delay(0.5);
        const session = await useAppSession();
        if (!session.data.userEmail) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.unauthorized] },
            { status: STATUS_CODES.unauthorized },
          );
        }

        const { title, content, tags } =
          (await request.json()) as ArticlePostRequest;
        const now = formatISO(Date.now(), { in: APP_TZ });
        const article: Article = {
          id: faker.string.nanoid(),
          title,
          content,
          tags: tags
            .map(({ id: tagID }) => tagList.find(({ id }) => id === tagID))
            .filter((tag) => Boolean(tag)),
          userEmail: session.data.userEmail,
          userID: session.data.id!,
          createTime: now,
          updateTime: now,
          isDeleted: false,
        };
        articleList.unshift(article);
        return Response.json(article);
      },
    },
  },
});
