import { handler } from '../getProduct';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('getProduct', () => {
  it('should get a product successfully', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { id: 'existing-id' },
    } as any;

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data.id).toBe('existing-id');
  });
}); 