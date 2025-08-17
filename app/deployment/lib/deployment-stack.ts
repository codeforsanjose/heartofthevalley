import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { HeartOfTheValleyBucket } from "./HeartOfTheValleyBucket";
import path from "path";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new HeartOfTheValleyBucket(this, "HeartOfValleyBucket");

    const table = new cdk.aws_dynamodb.Table(this, "HeartOfValleyTable", {
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

    new cdk.aws_apigatewayv2.HttpApi(this, "HeartOfValleyApi", {
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
  }
}
