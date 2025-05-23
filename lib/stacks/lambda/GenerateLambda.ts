import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Duration } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

export class GenerateLambdaStack extends cdk.Stack {
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

    const products = new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "generate.handler",
      code: lambda.Code.fromAsset("./lambda"),
      timeout: Duration.seconds(120),
      role: role,
      environment: {
        BUCKET_NAME: bucketName,
        DYNAMO_DB_TABLE_NAME: tableName,
        REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN || "",
      },
    });

    const productsIntegration = new apigateway.LambdaIntegration(products);
    const productsResource = gtw.root.addResource("generate");
    productsResource.addMethod("GET", productsIntegration);
  }
}
