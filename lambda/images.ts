import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import {
  DYNAMO_DB_GET_IMAGES_ERROR,
  IMAGE_FETCHING_ERROR,
  IMAGE_NOT_FOUND_ERROR,
  IMAGE_SAVE_ERROR_TO_S3,
  IMAGE_SAVING_CANNOT_BE_PROCESSED,
  LambdaResponse,
  METHOD_NOT_ALLOWED,
} from "./utils/index.js";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client();
const dydbClient = new DynamoDBClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { id, exclusiveStartKey, limit } = extractQueryParams(event);

  switch (event.httpMethod) {
    case "GET":
      if (id) return handleImageFetching(id);
      else return handleGetImages(exclusiveStartKey, limit);
    case "POST":
      if (event.body) return handleSaveImageToS3(event.body);
      else return LambdaResponse(400, IMAGE_SAVING_CANNOT_BE_PROCESSED);
    default:
      return LambdaResponse(405, METHOD_NOT_ALLOWED + event.httpMethod);
  }
};

const extractQueryParams = (event: APIGatewayProxyEvent) => {
  const id = event.queryStringParameters?.id;
  const exclusiveStartKey = event.queryStringParameters?.exclusiveStartKey;
  const limit = event.queryStringParameters?.limit
    ? parseInt(event.queryStringParameters.limit)
    : undefined;

  return { id, exclusiveStartKey, limit };
};

const handleImageFetching = async (id: string) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `${id}.png`,
    });
    const { Body } = await s3Client.send(command);

    if (Body) {
      const chunks: Buffer[] = [];
      const stream = Readable.from(Body as AsyncIterable<any>);

      stream.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      const buffer = await new Promise<Buffer>((resolve, reject) => {
        stream.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
        stream.on("error", reject);
      });

      const base64Image = "data:image/png;base64," + buffer.toString("base64");

      return LambdaResponse(200, JSON.stringify(base64Image));
    }
    return LambdaResponse(404, IMAGE_NOT_FOUND_ERROR);
  } catch (error) {
    return LambdaResponse(500, IMAGE_FETCHING_ERROR);
  }
};

const handleGetImages = async (exclusiveStartKey?: string, limit?: number) => {
  try {
    const command = new ScanCommand({
      TableName: process.env.DYNAMO_DB_TABLE_NAME,
      ExclusiveStartKey: exclusiveStartKey
        ? { id: { S: exclusiveStartKey } }
        : undefined,
      Limit: limit || 5,
    });

    const response = await dydbClient.send(command);
    return LambdaResponse(
      200,
      JSON.stringify({
        items: response.Items,
        count: response.Count,
        lastEvaluatedKey: response.LastEvaluatedKey,
      })
    );
  } catch (error) {
    return LambdaResponse(
      500,
      DYNAMO_DB_GET_IMAGES_ERROR + (error as Error).message
    );
  }
};

const handleSaveImageToS3 = async (image?: string) => {
  try {
    const imageBuffer = image ? Buffer.from(image, "base64") : null;

    if (!imageBuffer) {
      return LambdaResponse(400, IMAGE_SAVING_CANNOT_BE_PROCESSED);
    }

    const imageId = uuidv4();

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `${imageId}.png`,
        Body: imageBuffer,
        ContentType: "image/png",
      })
    );

    return LambdaResponse(200, JSON.stringify(imageId));
  } catch (error) {
    return LambdaResponse(500, (error as Error).message);
  }
};
