import { handler } from '../updateProduct';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('updateProduct', () => {
  it('should update a product successfully', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        pname: 'Updated Product',
      }),
      pathParameters: { id: 'existing-id' },
    } as any;

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data.pname).toBe('Updated Product');
  });
}); 