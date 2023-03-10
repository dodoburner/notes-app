import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, selected: false },
  password: { type: String, required: true, selected: false },
})

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);