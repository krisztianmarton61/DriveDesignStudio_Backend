import {
  LambdaResponse,
  METHOD_NOT_ALLOWED,
  ORDER_CANNOT_BE_PROCESSED,
  ORDER_NOT_FOUND_ERROR,
} from "./utils/index.js";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import {
  AttributeValue,
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { IOrder, IOrderStatus } from "./types/index.js";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({});
const dydbClient = new DynamoDBClient({});

export const handler = async (event: APIGatewayProxyEvent) => {
  switch (event.httpMethod) {
    case "POST":
      if (event.body) return handleSaveOrder(event.body);
      else return LambdaResponse(400, ORDER_CANNOT_BE_PROCESSED);
    case "GET":
      if (event.pathParameters && event.pathParameters.id) {
        return handleGetOrderById(event.pathParameters.id);
      } else {
        return handleGetOrders();
      }
    default:
      return LambdaResponse(405, METHOD_NOT_ALLOWED);
  }
};

const handleGetOrders = async () => {
  try {
    const response = await dydbClient.send(
      new ScanCommand({
        TableName: process.env.DYNAMO_DB_TABLE_NAME,
      })
    );

    const orders = response.Items?.map((item) => {
      return {
        id: item.id.S,
        email: item.email.S,
        billingInformation: item.billingInformation.M,
        shippingInformation: item.shippingInformation.M,
        products: item.products.L,
        status: item.status.S,
        timestamp: item.timestamp.N,
      };
    });

    return LambdaResponse(200, JSON.stringify(orders));
  } catch (error) {
    return LambdaResponse(500, (error as Error).message);
  }
};

const handleGetOrderById = async (orderId: string) => {
  try {
    const response = await dydbClient.send(
      new ScanCommand({
        TableName: process.env.DYNAMO_DB_TABLE_NAME,
        FilterExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": { S: orderId },
        },
      })
    );

    if (response.Items && response.Items.length > 0) {
      const item = response.Items[0];
      const order = {
        id: item.id.S,
        email: item.email.S,
        billingInformation: item.billingInformation.M,
        shippingInformation: item.shippingInformation.M,
        products: item.products.L,
        status: item.status.S,
        timestamp: item.timestamp.N,
      };

      return LambdaResponse(200, JSON.stringify(order));
    } else {
      return LambdaResponse(404, ORDER_NOT_FOUND_ERROR);
    }
  } catch (error) {
    return LambdaResponse(500, (error as Error).message);
  }
};

const handleSaveOrder = async (body: string) => {
  try {
    const order: IOrder = JSON.parse(body);
    if (order.password)
      await createUser(
        order.email,
        order.password,
        order.billingInformation.firstName,
        order.billingInformation.lastName,
        order.billingInformation.phone
      );
    const orderId = await saveOrder(order);

    return LambdaResponse(200, JSON.stringify(orderId));
  } catch (error) {
    return LambdaResponse(500, (error as Error).message);
  }
};

const saveOrder = async (order: IOrder): Promise<string> => {
  try {
    const orderId = uuidv4();

    const item: Record<string, AttributeValue> = {
      id: { S: orderId },
      email: { S: order.email },
      billingInformation: { M: {} },
      shippingInformation: { M: {} },
      products: { L: [] },
      status: { S: IOrderStatus.PENDING },
      timestamp: { N: new Date().getTime().toString() },
    };

    Object.entries(order.billingInformation).forEach(([key, value]) => {
      item.billingInformation.M = item.billingInformation.M || {};
      item.billingInformation.M[key] = { S: value };
    });

    if (order.shippingInformation) {
      Object.entries(order.shippingInformation).forEach(([key, value]) => {
        item.shippingInformation.M = item.shippingInformation.M || {};
        item.shippingInformation.M[key] = { S: value };
      });
    }

    order.products.forEach((product, index) => {
      const productItem: AttributeValue = {
        M: {
          productId: { S: product.productId },
          quantity: { N: product.quantity.toString() },
          imageId: { S: product.imageId },
        },
      };

      item.products.L = item.products.L || [];
      item.products.L.push(productItem);
    });

    await dydbClient.send(
      new PutItemCommand({
        TableName: process.env.DYNAMO_DB_TABLE_NAME,
        Item: item,
      })
    );

    return orderId;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const createUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string
) => {
  const createUserParams = {
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    Username: email,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "email_verified", Value: "true" },
      { Name: "custom:role", Value: "user" },
      { Name: "Family Name", Value: firstName },
      { Name: "Given Name", Value: lastName },
      { Name: "phone_number", Value: phoneNumber },
    ],
  };

  const setPasswordParams = {
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    Username: email,
    Password: password,
    Permanent: true,
  };

  try {
    const createUserCommand = new AdminCreateUserCommand(createUserParams);
    const createUserResponse = await cognitoClient.send(createUserCommand);

    const sub = createUserResponse.User?.Attributes?.find(
      (attr) => attr?.Name === "sub"
    )?.Value;

    const setPasswordCommand = new AdminSetUserPasswordCommand(
      setPasswordParams
    );
    await cognitoClient.send(setPasswordCommand);

    return sub;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
