import { Field, ObjectType } from "type-graphql";

/**
 * The response from running a deletion in a format that is returnable via graphql
 *
 * @var ok If the deletion was ok, or if an error occured.
 * @var n The number of documents matching the criteria
 * @var deletedCount The number of documents deleted
 */
@ObjectType()
export class DeleteResponse {
  @Field({ nullable: true })
  ok?: number;

  @Field({ nullable: true })
  n?: number;

  @Field({ nullable: true })
  deletedCount?: number;
}

/**
 * The response from running a deletion in a format that is returnable via graphql
 *
 * @var ok If the deletion was ok, or if an error occured.
 * @var n The number of documents matching the criteria
 * @var deletedCount The number of documents deleted
 */
@ObjectType()
export class UpdateResponse {
  @Field({ nullable: true })
  ok?: number;

  @Field({ nullable: true })
  n?: number;

  @Field({ nullable: true })
  nModified?: number;
}
