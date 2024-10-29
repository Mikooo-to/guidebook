import {
  Attribute,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
  AutoGenerateAttribute,
  Entity,
  INDEX_TYPE,
} from '@typedorm/common';

@Entity({
  name: 'section',
  primaryKey: {
    partitionKey: 'SECTION',
    sortKey: 'SECTION#ID#{{id}}',
  },
  indexes: {
    LSI1: {
      sortKey: 'SECTION#NAME#{{name}}',
      type: INDEX_TYPE.LSI,
    },
  },
})
export class Section {
  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.KSUID,
  })
  id: string;

  @Attribute({ unique: true })
  name: string;

  @Attribute()
  status: string;
}
