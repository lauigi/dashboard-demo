import { AuthedApi, Configuration, DefaultApi } from '@workspace/api';

const config = new Configuration({
  basePath: 'http://localhost:3000/api',
});

export const defaultAPI = new DefaultApi(config);
export const authedAPI = new AuthedApi(config);
