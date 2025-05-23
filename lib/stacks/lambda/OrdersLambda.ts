import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Duration } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

export class OrdersLambdaStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    gtw: apigateway.RestApi,
    bucketName: string,
    tableName: string,
    role: iam.Role,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const orders = new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "orders.handler",
      code: lambda.Code.fromAsset("./lambda"),
      timeout: Duration.seconds(20),
      role: role,
      memorySize: 256,
      environment: {
        BUCKET_NAME: bucketName,
        DYNAMO_DB_TABLE_NAME: tableName,
        AWS_COGNITO_USER_POOL_ID: process.env.AWS_COGNITO_USER_POOL_ID || "",
      },
    });

    const ordersIntegration = new apigateway.LambdaIntegration(orders);
    const ordersResource = gtw.root.addResource("orders");
    ordersResource.addMethod("POST", ordersIntegration);
    ordersResource.addMethod("GET", ordersIntegration);

    const orderResource = ordersResource.addResource("{id}");
    orderResource.addMethod("GET", ordersIntegration);
  }
}
