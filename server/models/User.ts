import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  profileImageUrl?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<UserDocument>("User", UserSchema);
