import { handler } from '../createProduct';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('createProduct', () => {
  it('should create a product successfully', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        pname: 'Test Product',
        category: 'Test Category',
        price: 100,
        quantity: 10,
      }),
      pathParameters: null,
    } as any;

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data.pname).toBe('Test Product');
  });
}); 