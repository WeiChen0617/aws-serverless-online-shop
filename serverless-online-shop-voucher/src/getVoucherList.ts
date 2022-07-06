import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { BadRequestError, InternalServerError } from 'ts-http-errors';
const headers = {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
}
const TABLE = 'voucher-table';
const dynamoDBClient = new DynamoDBClient({ region: 'eu-west-2' });
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const params = {
            TableName: TABLE,
            ReturnConsumedCapacity: 'TOTAL',
            Limit: 20,
            // ExclusiveStartKey: event.body.LastEvaluatedKey || undefined,
      };
      try {
            const data = await dynamoDBClient.send(new ScanCommand(params));
            return {
                  statusCode: 200,
                  headers,
                  body: JSON.stringify({ data: data?.Items?.map((i) => unmarshall(i)) }),
            };
      } catch (error) {
            console.log('Dynamodb Error: ', error)
            throw new InternalServerError('Internal Server Error.');
      }
};
