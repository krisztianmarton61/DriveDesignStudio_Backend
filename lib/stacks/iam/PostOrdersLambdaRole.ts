import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";

export class PostOrdersLambdaRoleStack extends cdk.Stack {
  public readonly role: iam.Role;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this, id, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      roleName: "PostOrdersLambdaRole",
    });

    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "dynamodb:PutItem",
          "dynamodb:Scan",
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminSetUserPassword",
        ],

        resources: ["*"],
      })
    );

    this.role = role;
  }
}
