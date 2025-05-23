const S3_BUCKET_SAVE_IMAGE_ERROR = "Error saving image to S3 bucket";

const DYNAMO_DB_SAVE_IMAGE_DATA_ERROR = "Error saving image data to DynamoDB";
const DYNAMO_DB_GET_IMAGES_ERROR = "Error getting images from DynamoDB";

const IMAGE_GENERATION_ERROR = "Error generating image";
const IMAGE_FETCHING_ERROR = "Error fetching image";
const IMAGE_NOT_FOUND_ERROR = "Image not found";
const IMAGE_SAVE_ERROR_TO_S3 = "Error saving image to S3 bucket";
const IMAGE_SAVING_CANNOT_BE_PROCESSED = "Image saving cannot be processed";

const MISSING_PROMPT_ERROR = "Missing text prompt!";
const MISSING_ID_ERROR = "Missing image ID!";
const MISSING_IMAGE_ERROR = "Missing image!";

const PRODUCT_NOT_FOUND_ERROR = "Product not found";

const ORDER_CANNOT_BE_PROCESSED = "Order cannot be processed";
const ORDER_NOT_FOUND_ERROR = "Order not found";

const METHOD_NOT_ALLOWED = "Method not allowed";

export {
  S3_BUCKET_SAVE_IMAGE_ERROR,
  DYNAMO_DB_SAVE_IMAGE_DATA_ERROR,
  DYNAMO_DB_GET_IMAGES_ERROR,
  IMAGE_GENERATION_ERROR,
  IMAGE_FETCHING_ERROR,
  IMAGE_NOT_FOUND_ERROR,
  IMAGE_SAVE_ERROR_TO_S3,
  IMAGE_SAVING_CANNOT_BE_PROCESSED,
  MISSING_PROMPT_ERROR,
  MISSING_ID_ERROR,
  MISSING_IMAGE_ERROR,
  PRODUCT_NOT_FOUND_ERROR,
  ORDER_CANNOT_BE_PROCESSED,
  ORDER_NOT_FOUND_ERROR,
  METHOD_NOT_ALLOWED,
};
