import { createFileRoute } from '@tanstack/react-router';
import { delay, GENERAL_MESSAGE, STATUS_CODES, tagList } from './-mockUtils';
import { Tag, TagPostRequest } from '@workspace/api';
import { useAppSession } from '@/utils/session';
import { faker } from '@faker-js/faker';

export const Route = createFileRoute('/api/tag/{-$tagID}')({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        await delay(0.5);
        const tagID = params.tagID;
        if (!tagID) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.badRequest] },
            { status: STATUS_CODES.badRequest },
          );
        }
        const tag = tagList.find(({ id }) => id === tagID);
        if (!tag) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.notFound] },
            { status: STATUS_CODES.notFound },
          );
        }
        const session = await useAppSession();
        if (!session.data.isAdmin) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.Unauthorized] },
            { status: STATUS_CODES.Unauthorized },
          );
        }
        const { name } = (await request.json()) as TagPostRequest;

        if (!name) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.badRequest] },
            { status: STATUS_CODES.badRequest },
          );
        }
        tag.name = name;
        return Response.json(tag);
      },
      POST: async ({ request }) => {
        await delay(0.5);
        const session = await useAppSession();
        if (!session.data.userEmail) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.Unauthorized] },
            { status: STATUS_CODES.Unauthorized },
          );
        }
        const { name } = (await request.json()) as TagPostRequest;
        if (!name) {
          return Response.json(
            { message: GENERAL_MESSAGE[STATUS_CODES.badRequest] },
            { status: STATUS_CODES.badRequest },
          );
        }
        const tag: Tag = {
          name,
          id: faker.string.nanoid(),
        };
        tagList.push(tag);
        return Response.json(tag);
      },
    },
  },
});
