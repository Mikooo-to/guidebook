import { INDEX_TYPE, Table } from '@typedorm/common';

type TMainParams = { tableName: string };

const mainTable = ({ tableName }: TMainParams) => {
  console.log('[mainTable]', tableName);
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

export { mainTable };
