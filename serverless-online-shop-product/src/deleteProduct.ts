import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, } from 'aws-lambda';
import { BadRequestError, InternalServerError } from 'ts-http-errors';
const headers = {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
}
const TABLE = 'product-table';
const dynamoDBClient = new DynamoDBClient({ region: 'eu-west-2' });

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const { id } = event.pathParameters || { id: '' };
      if (!id) { throw new BadRequestError('Bad Request Error.'); }
      const params = {
            TableName: TABLE,
            Key: marshall({ id }),
            ReturnConsumedCapacity: 'TOTAL',
      };
      try {
            await dynamoDBClient.send(new DeleteItemCommand(params));
            return {
                  statusCode: 200,
                  headers,
                  body: JSON.stringify({ id }),
            };
      } catch (error) {
            console.log('Dynamodb Error: ', error)
            throw new InternalServerError('Internal Server Error.');
      }
};
