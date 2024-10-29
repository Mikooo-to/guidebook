import { INDEX_TYPE, Table } from '@typedorm/common';

type TGuidebookTableParams = { tableName: string };

const guidebookTable = ({ tableName }: TGuidebookTableParams) => {
  console.log('[guidebookTable]', tableName);
  return new Table({
    name: tableName,
    partitionKey: 'PK',
    sortKey: 'SK',
    indexes: {
      LSI1: {
        type: INDEX_TYPE.LSI,
        sortKey: 'LSI1SK',
      },
      LSI2: {
        type: INDEX_TYPE.LSI,
        sortKey: 'LSI2SK',
      },
    },
  });
};

export { guidebookTable };
