import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { InternalServerError } from 'ts-http-errors';
import { v4 as uuidv4 } from 'uuid';
const headers = {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
}
const TABLE = 'voucher-table';
const dynamoDBClient = new DynamoDBClient({ region: 'eu-west-2' });
// tslint:disable-next-line: max-line-length
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const body = JSON.parse(event.body || '{}');
      const item = marshall({
            id: uuidv4(),
            vname: body?.vname,
            description: body?.description,
            price: body?.price,
            expiration: body?.expiration,
      });
      const params = {
            TableName: TABLE,
            Item: item,
            ReturnConsumedCapacity: 'TOTAL',
      };
      console.log(params)
      try {
            await dynamoDBClient.send(new PutItemCommand(params));
            return {
                  statusCode: 200,
                  headers,
                  body: JSON.stringify({ data: unmarshall(item) }),
            };
      } catch (error: any) {
            console.log('Dynamodb Error: ', error)
            throw new InternalServerError('Internal Server Error.');
      }
};
