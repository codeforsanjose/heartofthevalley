import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class HeartOfTheValleyBucket extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new cdk.aws_s3.Bucket(this, "HeartOfValleyBucket", {
      blockPublicAccess: new cdk.aws_s3.BlockPublicAccess({
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
    });

    bucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [bucket.arnForObjects("mural_images/*")],
        principals: [new cdk.aws_iam.AnyPrincipal()],
        effect: cdk.aws_iam.Effect.ALLOW,
      })
    );
  }
}
