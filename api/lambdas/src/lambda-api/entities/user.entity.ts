import {
  Attribute,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
  AutoGenerateAttribute,
  Entity,
  INDEX_TYPE,
} from '@typedorm/common';

@Entity({
  name: 'user',
  primaryKey: {
    partitionKey: 'USER',
    sortKey: 'USER#ID#{{id}}',
  },
  indexes: {
    LSI1: {
      sortKey: 'USER#EMAIL#{{email}}',
      type: INDEX_TYPE.LSI,
    },
  },
})
export class User {
  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.KSUID,
  })
  id: string;

  /**
   * In TypeDORM, when you mark an attribute as unique: true, it automatically creates an additional record in DynamoDB to maintain uniqueness constraints. This is because DynamoDB doesn't have built-in unique constraints like traditional SQL databases.
   * This additional record serves as a unique index to ensure that no two sections can have the same name. The format DRM_GEN_SECTION.NAME#sectionN2 is TypeDORM's internal way of maintaining these unique constraints.
   */
  @Attribute({ unique: true })
  email: string;

  @Attribute()
  role: string;

  @Attribute()
  password: string;
}
