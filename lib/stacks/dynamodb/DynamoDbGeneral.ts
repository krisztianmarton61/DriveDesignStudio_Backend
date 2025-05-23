import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DynamoDbGeneralStack extends cdk.Stack {
  public readonly dydbGeneralImages: dynamodb.TableV2;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const generalImagesTable = new dynamodb.TableV2(this, id, {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "generated-images-general-asd",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.dydbGeneralImages = generalImagesTable;
  }
}
