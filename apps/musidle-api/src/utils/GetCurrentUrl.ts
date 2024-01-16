import { server } from '../index';

export const getCurrentUrl = () => {
  const address = server.address();
  let port = 5000;
  if (address && typeof address !== 'string') {
    port = address.port;
  }

  return process.env.NODE_ENV == 'production' ? process.env.API_URL : `http://localhost:${port}`;
};
