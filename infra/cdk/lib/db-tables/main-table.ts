import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { projectName } from '../const';

export class MainDynamoDbTable extends Construct {
  public table: dynamodb.Table;
  constructor(
    scope: Construct,
    public resourceId = `${projectName}-main-table`,
  ) {
    super(scope, resourceId);

    this.table = new dynamodb.Table(this, resourceId, {
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      maxReadRequestUnits: 5,
      maxWriteRequestUnits: 10,
    });

    this.table.addLocalSecondaryIndex({
      indexName: 'LSI1',
      sortKey: { name: 'LSI1SK', type: dynamodb.AttributeType.STRING },
    });
    this.table.addLocalSecondaryIndex({
      indexName: 'LSI2',
      sortKey: { name: 'LSI2SK', type: dynamodb.AttributeType.STRING },
    });
  }
}
