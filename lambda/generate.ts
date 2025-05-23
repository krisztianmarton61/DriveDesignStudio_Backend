import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
const Replicate = require("replicate");
import {
  DYNAMO_DB_SAVE_IMAGE_DATA_ERROR,
  IMAGE_FETCHING_ERROR,
  IMAGE_GENERATION_ERROR,
  LambdaResponse,
  MISSING_PROMPT_ERROR,
  S3_BUCKET_SAVE_IMAGE_ERROR,
} from "./utils/index.js";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { IStyle, styleMap } from "./types/style.js";

const replicate = new Replicate();
const s3Client = new S3Client();
const dydbClient = new DynamoDBClient({});

export const handler = async (event: APIGatewayProxyEvent) => {
  const prompt = event.queryStringParameters?.prompt || undefined;
  const style = event.queryStringParameters?.style || undefined;

  if (prompt) return handleImageGeneration(prompt, style);
  else return LambdaResponse(400, MISSING_PROMPT_ERROR);
};
const handleImageGeneration = async (prompt: string, style?: string) => {
  try {
    if (style) {
      if (Object.values(IStyle).includes(style as IStyle)) {
        const styleDescription = styleMap.get(style);
        prompt = styleDescription + " " + prompt;
      }
    }
    const response = await generateImage(prompt);
    const imageBuffer = await fetchImage(response[0]);
    const imageId = await saveImageToS3Bucket(imageBuffer);
    await saveImageDataToDynamoDB(imageId, prompt);

    return LambdaResponse(
      200,
      "data:image/jpeg;base64," + imageBuffer.toString("base64")
    );
  } catch (error) {
    return LambdaResponse(500, (error as Error).message);
  }
};

const generateImage = async (prompt: string) => {
  try {
    const response = await replicate.run(
      "bytedance/sdxl-lightning-4step:727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a",
      {
        input: {
          steps: 20,
          width: 1024,
          height: 1024,
          prompt: prompt,
          output_format: "png",
          output_quality: 100,
          number_of_images: 1,
        },
      }
    );

    return response;
  } catch (error) {
    throw new Error(IMAGE_GENERATION_ERROR + (error as Error).message);
  }
};

const fetchImage = async (url: string): Promise<Buffer> => {
  try {
    const response = await fetch(url);

    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    throw new Error(IMAGE_FETCHING_ERROR);
  }
};

const saveImageToS3Bucket = async (imageBuffer: Buffer): Promise<string> => {
  try {
    const imageId = uuidv4();

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `${imageId}.png`,
        Body: imageBuffer,
        ContentType: "image/png",
      })
    );

    return imageId;
  } catch (error) {
    throw new Error(S3_BUCKET_SAVE_IMAGE_ERROR);
  }
};

const saveImageDataToDynamoDB = async (imageId: string, prompt: string) => {
  try {
    const imageLink = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageId}.png${process.env.DYNAMODB_TABLE_NAME}`;
    const data = {
      TableName: process.env.DYNAMO_DB_TABLE_NAME,
      Item: {
        id: { S: imageId },
        prompt: { S: prompt },
        buyCounter: { N: "0" },
        favoriteCounter: { N: "0" },
        createdAt: { N: Date.now().toString() },
      },
    };

    await dydbClient.send(new PutItemCommand(data));
  } catch (error) {
    throw new Error(DYNAMO_DB_SAVE_IMAGE_DATA_ERROR);
  }
};
