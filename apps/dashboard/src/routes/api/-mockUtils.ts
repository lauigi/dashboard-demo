import { faker } from '@faker-js/faker';
import { Article, Tag } from '@workspace/api';
import { formatISO } from 'date-fns';
import { tz } from '@date-fns/tz';

export const STATUS_CODES = {
  badRequest: 400,
  Unauthorized: 401,
  notFound: 404,
};

export const GENERAL_MESSAGE = {
  [STATUS_CODES.badRequest]: 'Bad request',
  [STATUS_CODES.Unauthorized]: 'Unauthorized',
  [STATUS_CODES.notFound]: 'Not found',
};

faker.seed(42);

const pickOne = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const pickNUnique = <T>(list: T[], n: number) => {
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

const generateTag = (): Tag => ({
  id: faker.string.nanoid(),
  name: faker.lorem.word(),
});

export const userList = [
  'admin@example.com',
  'aaa@example.com',
  'bbb@example.com',
].map((email, index) => ({
  email,
  id: faker.string.nanoid(),
  isAdmin: index === 0,
}));

const generateArticle = (): Article => {
  const { email: username, id: userID } = pickOne(userList);
  return {
    id: faker.string.nanoid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    username,
    userID,
    tags: pickNUnique(tagList, Math.floor(Math.random() * 5)),
    createTime: formatISO(faker.date.past(), { in: tz('America/Toronto') }),
    updateTime: formatISO(faker.date.recent(), { in: tz('America/Toronto') }),
    isDeleted: false,
  };
};

export const tagList = Array.from({ length: 1000 }, () => generateTag());
export const articleList = Array.from({ length: 1000 }, () =>
  generateArticle(),
);
