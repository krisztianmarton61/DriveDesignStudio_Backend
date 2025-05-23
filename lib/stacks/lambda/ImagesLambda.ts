import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Duration } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

export class ImagesLambdaStack extends cdk.Stack {
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

    const images = new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "images.handler",
      code: lambda.Code.fromAsset("./lambda"),
      timeout: Duration.seconds(15),
      role: role,
      environment: {
        BUCKET_NAME: bucketName,
        DYNAMO_DB_TABLE_NAME: tableName,
      },
    });

    const imageIntegration = new apigateway.LambdaIntegration(images);
    const imageResource = gtw.root.addResource("images");
    imageResource.addMethod("GET", imageIntegration);
    imageResource.addMethod("POST", imageIntegration);
  }
}
