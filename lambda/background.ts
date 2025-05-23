const Replicate = require("replicate");
import {
  IMAGE_FETCHING_ERROR,
  IMAGE_GENERATION_ERROR,
  LambdaResponse,
  MISSING_IMAGE_ERROR,
  MISSING_PROMPT_ERROR,
} from "./utils/index.js";
import { APIGatewayProxyEvent } from "aws-lambda";

const replicate = new Replicate();

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.body) return handleImageBackgroundRemoval(event.body);
  else return LambdaResponse(400, MISSING_IMAGE_ERROR);
};
const handleImageBackgroundRemoval = async (image?: string) => {
  try {
    const imageBuffer = image ? Buffer.from(image, "base64") : null;
    if (!imageBuffer) return LambdaResponse(400, MISSING_PROMPT_ERROR);

    const response = await removeBackground(imageBuffer);
    const newImageBuffer = await fetchImage(response);

    return LambdaResponse(
      200,
      "data:image/jpeg;base64," + newImageBuffer.toString("base64")
    );
  } catch (error) {
    return LambdaResponse(500, (error as Error).message);
  }
};

const removeBackground = async (image: Buffer) => {
  try {
    const response = await replicate.run(
      //"fofr/sticker-maker:4acb778eb059772225ec213948f0660867b2e03f277448f18cf1800b96a65a1a",
      "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
      {
        input: {
          image: "data:image/png;base64," + image.toString("base64"),
        },
      }
    );

    return response;
  } catch (error) {
    throw new Error(
      IMAGE_GENERATION_ERROR +
        (error as Error).message +
        image.toString("base64")
    );
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
