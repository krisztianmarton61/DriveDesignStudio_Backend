import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";

export class GetImagesLambdaRoleStack extends cdk.Stack {
  public readonly role: iam.Role;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this, id, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      roleName: "GetImageLambdaRole",
    });

    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "s3:GetObject",
          "s3:ListBucket",
          "S3:PostObject",
          "S3:PutObject",
          "S3:DeleteObject",
        ],
        resources: ["*"],
      })
    );

    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Scan"],
        resources: ["*"],
      })
    );

    this.role = role;
  }
}
