import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DynamoDbProductsStack extends cdk.Stack {
  public readonly dydbproducts: dynamodb.TableV2;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const products = new dynamodb.TableV2(this, id, {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "products-webshop-ai-asd",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.dydbproducts = products;
  }
}
