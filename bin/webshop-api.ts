#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import {
  ApiGatewayStack,
  GenerateLambdaStack,
  ImagesLambdaStack,
  ProductsLambdaStack,
  DynamoDbGeneralStack,
  DynamoDbProductsStack,
  S3BucketGeneralStack,
  GenerateLambdaRoleStack,
  GetImagesLambdaRoleStack,
  GetProductsLambdaRoleStack,
  DynamoDbOrdersStack,
  OrdersLambdaStack,
  PostOrdersLambdaRoleStack,
  BackGroundLambdaStack,
} from "../lib/stacks";
require("dotenv").config();

const app = new cdk.App();

const generateLambdaRole = new GenerateLambdaRoleStack(
  app,
  "generate-lambda-role"
);

const getImageLambdaRole = new GetImagesLambdaRoleStack(
  app,
  "get-image-lambda-role"
);

const getProductsLambdaRole = new GetProductsLambdaRoleStack(
  app,
  "get-products-lambda-role"
);

const postOrdersLambdaRole = new PostOrdersLambdaRoleStack(
  app,
  "post-orders-lambda-role"
);

const gtw = new ApiGatewayStack(app, "api-gateway");

const s3Bucket = new S3BucketGeneralStack(app, "s3-bucket-general");

const dydbgig = new DynamoDbGeneralStack(
  app,
  "dynamodb-generated-images-general"
);

const dydbp = new DynamoDbProductsStack(app, "dynamodb-products");

const dydbo = new DynamoDbOrdersStack(app, "dynamodb-orders");

const generateLambda = new GenerateLambdaStack(
  app,
  "generate-lambda",
  gtw.gtw,
  s3Bucket.s3Bucket.bucketName,
  dydbgig.dydbGeneralImages.tableName,
  generateLambdaRole.role
);

const getImageLambda = new ImagesLambdaStack(
  app,
  "get-image-lambda",
  gtw.gtw,
  s3Bucket.s3Bucket.bucketName,
  dydbgig.dydbGeneralImages.tableName,
  getImageLambdaRole.role
);

const getProductsLambda = new ProductsLambdaStack(
  app,
  "get-products-lambda",
  gtw.gtw,
  dydbp.dydbproducts.tableName,
  getProductsLambdaRole.role
);

const postOrdersLambda = new OrdersLambdaStack(
  app,
  "post-orders-lambda",
  gtw.gtw,
  s3Bucket.s3Bucket.bucketName,
  dydbo.dynamodb.tableName,
  postOrdersLambdaRole.role
);

const backgroundLambda = new BackGroundLambdaStack(
  app,
  "background-lambda",
  gtw.gtw
);
