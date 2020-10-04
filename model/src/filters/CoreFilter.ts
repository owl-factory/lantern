import { InputType, Field, ID } from "type-graphql";

@InputType()
export class CoreFilter {
  // _id filters
  @Field(() => ID, { nullable: true})
  _id_eq?: string;

  @Field(() => ID, { nullable: true })
  _id_neq?: string;

  // Name filters
  @Field({ nullable: true })
  name_eq?: string;

  @Field({ nullable: true })
  name_neq?: string;

  @Field({ nullable: true })
  name_like?: string;

  // Alias Filters
  @Field({ nullable: true })
  alias_eq?: string;

  @Field({ nullable: true })
  alias_neq?: string;

  @Field({ nullable: true })
  alias_like?: string;

  // Owned by filters
  @Field(() => ID, { nullable: true})
  ownedBy_eq?: string;

  @Field(() => ID, { nullable: true })
  ownedBy_neq?: string;

  // CreateBy filters
  @Field(() => ID, { nullable: true})
  createdBy_eq?: string;

  @Field(() => ID, { nullable: true })
  createdBy_neq?: string;

  // CreatedAt filters
  @Field(() => Date, { nullable: true})
  createdAt_eq?: Date;

  @Field(() => Date, { nullable: true })
  createdAt_neq?: Date;

  @Field(() => Date, { nullable: true })
  createdAt_gt?: Date;

  @Field(() => Date, { nullable: true })
  createdAt_gte?: Date;

  @Field(() => Date, { nullable: true })
  createdAt_lt?: Date;

  @Field(() => Date, { nullable: true })
  createdAt_lte?: Date;

  // UpdatedBy filters
  @Field(() => ID, { nullable: true})
  updatedBy_eq?: string;

  @Field(() => ID, { nullable: true })
  updatedBy_neq?: string;

  // UpdatedAt filters
  @Field(() => Date, { nullable: true})
  updatedAt_eq?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt_neq?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt_gt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt_gte?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt_lt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt_lte?: Date;

  // DeletedBy filters
  @Field(() => ID, { nullable: true})
  deletedBy_eq?: string;

  @Field(() => ID, { nullable: true })
  deletedBy_neq?: string;

  // DeletedAt filters
  @Field(() => Date, { nullable: true})
  deletedAt_eq?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt_neq?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt_gt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt_gte?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt_lt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt_lte?: Date;
}