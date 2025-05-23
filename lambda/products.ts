import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import {
  DYNAMO_DB_GET_IMAGES_ERROR,
  LambdaResponse,
  METHOD_NOT_ALLOWED,
  PRODUCT_NOT_FOUND_ERROR,
} from "./utils/index.js";

const dydbClient = new DynamoDBClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { id } = extractQueryParams(event);

  switch (event.httpMethod) {
    case "GET":
      if (id) return handleGetProduct(id);
      else return handleGetProducts();
    default:
      return LambdaResponse(405, METHOD_NOT_ALLOWED);
  }
};

const extractQueryParams = (event: APIGatewayProxyEvent) => {
  const id = event.queryStringParameters?.id;
  return { id };
};

const handleGetProduct = async (id: string) => {
  try {
    const command = new GetItemCommand({
      TableName: process.env.DYNAMO_DB_TABLE_NAME,
      Key: { id: { S: id } },
    });

    const response = await dydbClient.send(command);

    if (response.Item) {
      return LambdaResponse(200, JSON.stringify(response.Item));
    } else {
      return LambdaResponse(404, PRODUCT_NOT_FOUND_ERROR);
    }
  } catch (error) {
    return LambdaResponse(
      500,
      (error as Error).message || DYNAMO_DB_GET_IMAGES_ERROR
    );
  }
};

const handleGetProducts = async () => {
  return LambdaResponse(200, "Get all products, Currently not implemented");
};
