import { Article } from '../types/Article';

export const getArticles = async () => {
  const key = process.env.REACT_APP_APIGATEWAY_KEY;
  const apiUrl = process.env.REACT_APP_API_URL;
  if (!key || !apiUrl) {
    throw new Error('api key or url not found');
  }

  const init: RequestInit = {
    method: 'GET',
    headers: {
      'x-api-key': key,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin,      
    },
  };
  const response = await fetch(`${apiUrl}/articles`, init);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = (await response.json()).items as Article[];

  return json;
};
