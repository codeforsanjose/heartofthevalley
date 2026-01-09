import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { HeartOfTheValleyBucket } from "./HeartOfTheValleyBucket";
import path from "path";

export class HeartOfTheValleyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new HeartOfTheValleyBucket(this, "HeartOfValleyBucketOld");

    const table = new cdk.aws_dynamodb.Table(this, "HeartOfValleyTableOld", {
      partitionKey: { name: "PK", type: cdk.aws_dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: cdk.aws_dynamodb.AttributeType.STRING },
      deletionProtection: true,
    });

    const apiHandler = new cdk.aws_lambda.Function(
      this,
      "HeartOfValleyApiHandler",
      {
        runtime: cdk.aws_lambda.Runtime.PROVIDED_AL2023,
        code: cdk.aws_lambda.Code.fromAsset(
          path.resolve(__dirname, "../dist/backend")
        ),
        handler: "bootstrap",
        layers: [
          cdk.aws_lambda.LayerVersion.fromLayerVersionArn(
            this,
            "LambdaAdapterLayerX86",
            cdk.Arn.format(
              {
                partition: cdk.Stack.of(this).partition,
                service: "lambda",
                region: cdk.Stack.of(this).region,
                account: "753240598075",
                resource: "layer",
                resourceName: "LambdaAdapterLayerX86:25",
                arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
              },
              cdk.Stack.of(this)
            )
          ),
        ],
        environment: {
          TABLE_NAME: table.tableName,
        },
      }
    );

    table.grantReadWriteData(apiHandler);

    const frontendBucket = new cdk.aws_s3.Bucket(
      this,
      "HeartOfValleyFrontendBucket",
      {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        websiteIndexDocument: "index.html",
        publicReadAccess: true,
        blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ACLS_ONLY,
      }
    );

    new cdk.aws_cloudfront.Distribution(this, "HeartOfValleyFrontendCdn", {
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3StaticWebsiteOrigin(
          frontendBucket
        ),
        viewerProtocolPolicy:
          cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
      },
    });

    const api = new cdk.aws_apigatewayv2.HttpApi(this, "HeartOfValleyApi", {
      defaultIntegration:
        new cdk.aws_apigatewayv2_integrations.HttpLambdaIntegration(
          "HeartOfValleyIntegration",
          apiHandler,
          {
            payloadFormatVersion:
              cdk.aws_apigatewayv2.PayloadFormatVersion.VERSION_2_0,
            timeout: cdk.Duration.seconds(29),
          }
        ),
    });

    new cdk.aws_iam.Role(this, "HeartOfTheValleyGithubActionsRole", {
      assumedBy: new cdk.aws_iam.WebIdentityPrincipal(
        "arn:aws:iam::253016134262:oidc-provider/token.actions.githubusercontent.com",
        {
          StringLike: {
            "token.actions.githubusercontent.com:sub": [
              `repo:codeforsanjose/heartofthevalley:ref:refs/heads/main`,
              `repo:codeforsanjose/heartofthevalley:ref:refs/heads/infinite-scroll`,
              `repo:codeforsanjose/heartofthevalley:ref:refs/heads/staging`,
            ],
          },
          "ForAllValues:StringEquals": {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
            "token.actions.githubusercontent.com:iss":
              "https://token.actions.githubusercontent.com",
          },
        }
      ),
      managedPolicies: [
        cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AdministratorAccess"
        ),
      ],
      inlinePolicies: {
        DenyExpensiveServiceAccess: new cdk.aws_iam.PolicyDocument({
          statements: [
            new cdk.aws_iam.PolicyStatement({
              effect: cdk.aws_iam.Effect.DENY,
              actions: [
                "ec2:*",
                "glue:*",
                "sagemaker:*",
                "athena:*",
                "emr:*",
                "redshift:*",
                "kinesis:*",
                "redshift:*",
                "rds:*",
                "dynamodb:*",
              ],
              resources: ["*"],
            }),
          ],
        }),
      },
    });

    new cdk.CfnOutput(this, "FrontendBucketName", {
      value: frontendBucket.bucketName,
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.apiEndpoint,
    });
  }
}
