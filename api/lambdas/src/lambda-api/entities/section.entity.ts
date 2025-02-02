import {
  Attribute,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
  AutoGenerateAttribute,
  Entity,
} from '@typedorm/common';

@Entity({
  name: 'section',
  primaryKey: {
    partitionKey: 'SECTION',
    sortKey: 'SECTION#ID#{{id}}',
  },
})
export class Section {
  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.KSUID,
  })
  id: string;

  /**
   * In TypeDORM, when you mark an attribute as unique: true, it automatically creates an additional record in DynamoDB to maintain uniqueness constraints. This is because DynamoDB doesn't have built-in unique constraints like traditional SQL databases.
   * This additional record serves as a unique index to ensure that no two sections can have the same name. The format DRM_GEN_SECTION.NAME#sectionN2 is TypeDORM's internal way of maintaining these unique constraints.
   */
  @Attribute({ unique: true })
  name: string;

  @Attribute()
  status: string;
}
