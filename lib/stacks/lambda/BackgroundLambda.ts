import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Duration } from "aws-cdk-lib";

export class BackGroundLambdaStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    gtw: apigateway.RestApi,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const background = new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "background.handler",
      code: lambda.Code.fromAsset("./lambda"),
      timeout: Duration.seconds(20),
      environment: {
        REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN || "",
      },
    });

    const backgroundIntegration = new apigateway.LambdaIntegration(background);
    const backgroundResource = gtw.root.addResource("background");
    backgroundResource.addMethod("POST", backgroundIntegration);
  }
}
