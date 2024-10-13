import { INDEX_TYPE, Table } from '@typedorm/common';

const guidebookTable = new Table({
  name: 'guidebookTable',
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

export { guidebookTable };
