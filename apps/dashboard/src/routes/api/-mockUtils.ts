import { faker } from '@faker-js/faker';
import { Article, Tag } from '@workspace/api';
import { formatISO } from 'date-fns';
import { tz } from '@date-fns/tz';

export { STATUS_CODES, GENERAL_MESSAGE } from '@/utils/constants';

export const APP_TZ = tz('America/Toronto');

faker.seed(42);

const pickOne = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const pickNUnique = <T>(list: T[], n: number) => {
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

const generateTags = (): Tag[] => {
  const names = new Set(Array.from({ length: 500 }, () => faker.lorem.word()));
  return [...names].map((name) => ({
    id: faker.string.nanoid(),
    name,
  }));
};

export const userList = [
  'admin@example.com',
  'aaa@example.com',
  'bbb@example.com',
].map((userEmail, index) => ({
  userEmail,
  id: faker.string.nanoid(),
  isAdmin: index === 0,
}));

const generateArticle = (): Article => {
  const { userEmail, id: userID } = pickOne(userList);
  return {
    id: faker.string.nanoid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    userEmail,
    userID,
    tags: pickNUnique(tagList, Math.floor(Math.random() * 5)),
    createTime: formatISO(faker.date.past(), { in: APP_TZ }),
    updateTime: formatISO(faker.date.recent(), { in: APP_TZ }),
    isDeleted: false,
  };
};

export const tagList = generateTags();
export const articleList = Array.from({ length: 1000 }, () =>
  generateArticle(),
);

export const delay = (s: number) => {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
};
