import mongo from "mongoose";
import { getModel } from "../helpers/models";

const characterSchema = new mongo.Schema({
  name: String,
});

export default getModel("Character", characterSchema, "character");
