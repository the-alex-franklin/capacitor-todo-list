import { model, Schema } from "mongoose";

const TaskSchema = new Schema({
	value: { type: String, required: true, trim: true },
	completed: { type: Boolean, default: false },
	user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const Task = model("Task", TaskSchema);
