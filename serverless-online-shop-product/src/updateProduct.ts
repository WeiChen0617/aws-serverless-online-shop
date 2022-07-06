import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { BadRequestError, InternalServerError } from 'ts-http-errors';
const headers = {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
}
const TABLE = 'product-table';
const dynamoDBClient = new DynamoDBClient({ region: 'eu-west-2' });

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const data = JSON.parse(event.body || '{}');
      const id = event.pathParameters?.id || '';
      if (!id || !data) {
            throw new BadRequestError('Bad Request Error.');
      }
      // item.updatedAt = Date.now().toString();
      const params = {
            TableName: TABLE,
            Key: marshall({ id }),
            UpdateExpression:
                  'set ' + Object.keys(data).map((k) => `${k} = :${k}`).join(', '),
            ExpressionAttributeValues: Object.entries(data).reduce(
                  (acc, cur) => ({ ...acc, [`:${cur[0]}`]: { S: `${cur[1]}` } }), {}),
            ReturnValues: 'ALL_NEW',
            ReturnConsumedCapacity: 'TOTAL',
      };
      try {
            await dynamoDBClient.send(new UpdateItemCommand(params));
            return {
                  statusCode: 200,
                  headers,
                  body: JSON.stringify({ data }),
            };
      } catch (error) {
            console.log('Dynamodb Error: ', error)
            throw new InternalServerError('Internal Server Error.');
      }
};
