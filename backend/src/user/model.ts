import { model, Schema } from "mongoose";
import * as bcrypt from "bcrypt";

type User = {
	username: string;
	password: string;
	comparePassword: (password: string) => Promise<boolean>;
};

const UserSchema = new Schema<User>({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true, select: false },
}, {
	timestamps: true,
	toJSON: {
		transform: (doc, ret) => {
			delete ret.password;
			return ret;
		},
	},
});

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
	const user = await User.findOne({ _id: this._id }).select("+password").exec();
	if (!user) throw new Error("User not found");

	return bcrypt.compareSync(password, user.password);
};

export const User = model<User>("User", UserSchema);
