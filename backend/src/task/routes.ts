import { Hono } from "hono/mod.ts";
import { Task } from "./model.ts";
import { Try } from "../utils/functions/try.ts";
import { bodyValidationMiddleware } from "./middleware/body-validation.middleware.ts";
import type { AuthenticationKV } from "../middleware/authentication.middleware.ts";

const task_routes = new Hono<AuthenticationKV>();

task_routes.get("/", async (c) => {
	const user_id = c.get("user_id");
	const tasks = await Try(() => Task.find({ user_id }).exec());
	if (!tasks.success) return c.json({ message: tasks.error.message }, 500);
	return c.json(tasks.data);
});

task_routes.get("/:id", async (c) => {
	const user_id = c.get("user_id");
	const _id = c.req.param("id");
	const task = await Try(() => Task.find({ _id, user_id }).exec());

	if (!task.success) return c.json({ message: task.error.message }, 500);
	if (!task.data) return c.json({ message: "Task not found" }, 404);
	return c.json(task.data);
});

task_routes.post("/", bodyValidationMiddleware, async (c) => {
	const user_id = c.get("user_id");
	const body = c.get("body");
	const new_task = await Try(() => Task.create({ ...body, user_id }));

	if (!new_task.success) return c.json({ message: new_task.error.message }, 500);
	return c.json(new_task.data);
});

task_routes.patch("/:id", bodyValidationMiddleware, async (c) => {
	const user_id = c.get("user_id");
	const _id = c.req.param("id");
	const body = c.get("body");
	const patched_task = await Try(() => (
		Task.findOneAndUpdate({ _id, user_id }, body, { new: true }).exec()
	));

	if (!patched_task.success) return c.json({ message: patched_task.error.message }, 500);
	if (!patched_task.data) return c.json({ message: "Task not found" }, 404);
	return c.json(patched_task.data);
});

task_routes.delete("/:id", async (c) => {
	const user_id = c.get("user_id");
	const _id = c.req.param("id");
	const deleted_task = await Try(() => Task.findOneAndDelete({ _id, user_id }).exec());

	if (!deleted_task.success) return c.json({ message: deleted_task.error.message }, 500);
	if (!deleted_task.data) return c.json({ message: "Task not found" }, 404);
	return c.json({ message: "Task deleted successfully" });
});

export { task_routes };
