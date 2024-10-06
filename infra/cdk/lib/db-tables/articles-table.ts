import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ArticlesDynamoDbTable extends Construct {
  public table: dynamodb.Table;
  constructor(scope: Construct, public resourceId = 'articles-table') {
    super(scope, resourceId);

    this.table = new dynamodb.Table(this, resourceId, {
      partitionKey: {
        name: 'partitionId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      maxReadRequestUnits: 5,
      maxWriteRequestUnits: 10,
    });

    this.table.addLocalSecondaryIndex({
      indexName: 'user',
      sortKey: { name: 'user', type: dynamodb.AttributeType.STRING },
    });
    this.table.addLocalSecondaryIndex({
      indexName: 'section',
      sortKey: { name: 'section', type: dynamodb.AttributeType.STRING },
    });
  }
}
