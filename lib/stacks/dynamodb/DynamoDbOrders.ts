import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DynamoDbOrdersStack extends cdk.Stack {
  public readonly dynamodb: dynamodb.TableV2;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const orders = new dynamodb.TableV2(this, id, {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "timestamp", type: dynamodb.AttributeType.NUMBER },
      tableName: "orders-webshop-ai-asd",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.dynamodb = orders;
  }
}
