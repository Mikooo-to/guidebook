import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
export const mainHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('[mainHandler params]', event.body);
  console.log('[event.path]', event.path);
  console.log('[event.pathParameters]', event.pathParameters);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify('mainHandler response 200'),
  };
};
