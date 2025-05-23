import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class ApiGatewayStack extends cdk.Stack {
  public readonly gtw: apigateway.RestApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const gtw = new apigateway.RestApi(this, id, {
      restApiName: 'ApiGateway',
      defaultCorsPreflightOptions: {
        allowOrigins: ["http://localhost:5173"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    this.gtw = gtw;
  }
}