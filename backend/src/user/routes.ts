import { Hono } from "hono/mod.ts";
import type { Context } from "hono/mod.ts";
import jwt from "jsonwebtoken";
import { User } from "./model.ts";
import { Try } from "../utils/functions/try.ts";
import { AuthenticationKV, authenticationMiddleware } from "../middleware/authentication.middleware.ts";
import { UsernamePasswordKV, usernamePasswordValidator } from "./middleware/username-password-validation.middleware.ts";

const user_routes = new Hono();

user_routes.post("/signup", usernamePasswordValidator, async (c: Context<UsernamePasswordKV>) => {
	const username = c.get("username");
	const password = c.get("password");

	const result = await Try(() => User.create({ username, password }));
	if (result.failure) return c.json({ message: result.error.message }, 500);
	return c.json(result.data);
});

user_routes.post("/login", usernamePasswordValidator, async (c: Context<UsernamePasswordKV>) => {
	const username = c.get("username");
	const password = c.get("password");

	const find_result = await Try(() => User.findOne({ username }).exec());
	if (find_result.failure) return c.json({ message: find_result.error.message }, 500);
	if (find_result.data === null) return c.json({ message: "User not found" }, 400);
	const user = find_result.data;

	const compare_result = await Try(() => user.comparePassword(password));
	if (compare_result.failure) return c.json({ message: "Unauthorized" }, 401);
	if (compare_result.data === false) return c.json({ message: "Unauthorized" }, 401);

	const token_gen_result = Try(() => {
		const access_token = jwt.sign({ user_id: user._id }, "super-secret-key", { expiresIn: "1h" });
		const refresh_token = jwt.sign({ user_id: user._id }, "super-secret-key", { expiresIn: "7d" });
		return [access_token, refresh_token];
	});
	if (token_gen_result.failure) return c.json({ message: token_gen_result.error.message }, 500);
	const [access_token, refresh_token] = token_gen_result.data;

	return c.json({ access_token, refresh_token });
});

user_routes.get("/me", authenticationMiddleware, async (c: Context<AuthenticationKV>) => {
	const user_id = c.get("user_id");
	const user = await Try(() => User.findById(user_id).exec());
	if (user.failure) return c.json({ message: user.error.message }, 500);
	if (!user.data) return c.json({ message: "User not found" }, 400);
	return c.json(user.data);
});

export { user_routes };
