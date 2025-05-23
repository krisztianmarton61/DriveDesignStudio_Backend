import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class S3BucketGeneralStack extends cdk.Stack {
  public s3Bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, id, {
      bucketName: "generated-images-general-asd", // Replace with your desired bucket name
      removalPolicy: cdk.RemovalPolicy.DESTROY, // This will destroy the bucket when the stack is deleted, use with caution in production
      autoDeleteObjects: true, // This will ensure that objects in the bucket are deleted when the stack is deleted
      versioned: true, // Enable versioning for the bucket
    });

    this.s3Bucket = s3Bucket;
  }
}
