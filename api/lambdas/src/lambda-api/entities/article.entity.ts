import {
  Attribute,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
  AutoGenerateAttribute,
  Entity,
  INDEX_TYPE,
} from '@typedorm/common';

@Entity({
  name: 'article',
  primaryKey: {
    partitionKey: 'ARTICLE',
    sortKey: 'ARTICLE#ID#{{id}}',
  },
  indexes: {
    LSI1: {
      sortKey: 'ARTICLE#USER#{{user}}',
      type: INDEX_TYPE.LSI,
    },
    LSI2: {
      sortKey: 'ARTICLE#SECTION#{{section}}',
      type: INDEX_TYPE.LSI,
    },
  },
})
export class Article {
  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.KSUID,
  })
  id: string;

  @Attribute()
  name: string;

  @Attribute()
  user?: string;

  @Attribute()
  section: string;

  @Attribute()
  content: string;

  @Attribute()
  status: string;

  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
    autoUpdate: true, // this will make this attribute and any indexes referencing it auto update for any write operation
  })
  updatedAt: number;
}
