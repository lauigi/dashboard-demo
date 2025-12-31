import {
  AuthedApi,
  Configuration,
  DefaultApi,
  ResponseContext,
} from '@workspace/api';

const config = new Configuration({
  basePath: '/api',
  middleware: [
    {
      post: async (context: ResponseContext) => {
        const response = context.response;
        if (!response.ok) {
          const errorBody = await response.clone().json();
          console.error('API Error:', errorBody);
        }

        return response;
      },
    },
  ],
});

export const defaultAPI = new DefaultApi(config);
export const authedAPI = new AuthedApi(config);
