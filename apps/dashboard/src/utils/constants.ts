export const TAGS_LENGTH_LIMIT = 5;
export const ARTICLE_PER_PAGE_LIMIT = 20;
export const TAG_PER_PAGE_LIMIT = 30;
export const EDITOR_LIMIT = {
  title: { max: 100, min: 10 },
  content: { max: 10000, min: 20 },
};

export const STATUS_CODES = {
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  conflict: 409,
};

export const GENERAL_MESSAGE = {
  [STATUS_CODES.badRequest]: 'Bad request',
  [STATUS_CODES.unauthorized]: 'Unauthorized',
  [STATUS_CODES.notFound]: 'Not found',
  [STATUS_CODES.conflict]: 'Conflict',
};
