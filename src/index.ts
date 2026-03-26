import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnit } from '@aws-lambda-powertools/metrics';
import type { Context } from 'aws-lambda';

const logger = new Logger({ serviceName: 'triage-5134' });
const metrics = new Metrics({ serviceName: 'triage-5134', namespace: 'Triage5134' });

export const handler = async (event: unknown, context: Context) => {
  logger.addContext(context);
  logger.info('Processing request', { event });

  metrics.addMetric('InvocationCount', MetricUnit.Count, 1);
  metrics.publishStoredMetrics();

  return {
    statusCode: 200,
    body: JSON.stringify('Hello, World!'),
  };
};
