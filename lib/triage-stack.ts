import { CfnOutput, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import type { Construct } from 'constructs';

export class TriageStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fnName = 'TriageFn';
    const logGroup = new LogGroup(this, 'MyLogGroup', {
      logGroupName: `/aws/lambda/${fnName}`,
      removalPolicy: RemovalPolicy.DESTROY,
      retention: RetentionDays.ONE_DAY,
    });
    const fn = new NodejsFunction(this, 'MyFunction', {
      functionName: fnName,
      logGroup,
      runtime: Runtime.NODEJS_22_X,
      entry: './src/index.ts',
      handler: 'handler',
      bundling: {
        minify: false,
        mainFields: ['main'],
        sourceMap: false,
        format: OutputFormat.CJS,
        externalModules: ['@aws-lambda-powertools/*'],
        commandHooks: {
          beforeBundling: () => [],
          beforeInstall: () => [],
          afterBundling: (_inputDir: string, outputDir: string) => [
            `mkdir -p ${outputDir}/node_modules/@aws-lambda-powertools ${outputDir}/node_modules/@aws`,
            `cp -r node_modules/@aws-lambda-powertools/. ${outputDir}/node_modules/@aws-lambda-powertools/`,
            `cp -r node_modules/@aws/. ${outputDir}/node_modules/@aws/`,
          ],
        },
      },
    });

    new CfnOutput(this, 'FunctionArn', {
      value: fn.functionArn,
    });
  }
}
