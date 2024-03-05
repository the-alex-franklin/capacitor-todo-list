import { model, Schema } from "mongoose";

export const Task = model(
	"Task",
	new Schema({
		value: { type: String, required: true },
		completed: { type: Boolean, required: true },
	}, { timestamps: true }),
);
