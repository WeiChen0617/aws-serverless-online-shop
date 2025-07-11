import { handler } from '../getProductList';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('getProductList', () => {
  it('should get a list of products successfully', async () => {
    const event: APIGatewayProxyEvent = {} as any;

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(Array.isArray(body.data)).toBe(true);
  });
}); 