import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Duration } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

export class ProductsLambdaStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    gtw: apigateway.RestApi,
    tableName: string,
    role: iam.Role,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const getImage = new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "products.handler",
      code: lambda.Code.fromAsset("./lambda"),
      timeout: Duration.seconds(10),
      role: role,
      environment: {
        DYNAMO_DB_TABLE_NAME: tableName,
      },
    });

    const getImageIntegration = new apigateway.LambdaIntegration(getImage);
    const getImageResource = gtw.root.addResource("products");
    getImageResource.addMethod("GET", getImageIntegration);
  }
}
