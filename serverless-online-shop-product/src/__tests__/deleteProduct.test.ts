import { handler } from '../deleteProduct';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('deleteProduct', () => {
  it('should delete a product successfully', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { id: 'existing-id' },
    } as any;

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.id).toBe('existing-id');
  });
}); 