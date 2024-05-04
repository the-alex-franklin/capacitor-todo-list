import { Hono } from "hono/mod.ts";
import type { Context, Next } from "hono/mod.ts";
import { Try } from "../utils/functions/try.ts";
import { User } from "./model.ts";
import jwt from "https://esm.sh/jsonwebtoken@9.0.2";
import type { JwtPayload } from "https://esm.sh/jsonwebtoken@9.0.2";
import { z } from "zod";

const payload_schema = z.object({
	id: z.string(),
});

type Payload = z.infer<typeof payload_schema>;

type KV = {
	Variables: {
		user_id: string;
	};
};

const authenticate = async (c: Context<KV>, next: Next) => {
	const authHeader = c.req.header("Authorization");
	if (!authHeader) return c.json({ message: "Unauthorized" }, 401);

	const token = authHeader.match(/^Bearer (.+)$/)?.[1];
	if (!token) return c.json({ message: "Token is missing" }, 401);

	const unknown_payload = Try(() => jwt.verify(token, "super-secret-key"));
	if (!unknown_payload.success) return c.json({ message: "Invalid token" }, 401);

	const parsed_payload = payload_schema.safeParse(unknown_payload.data);
	if (!parsed_payload.success) return c.json({ message: "Malformed Jwt" }, 401);

	const payload = parsed_payload.data;
	c.set("user_id", payload.id);

	await next();
};

const user_routes = new Hono<KV>();

user_routes.post("/signup", async (c) => {
	const { username, password } = await c.req.json();
	const result = await Try(() => User.create({ username, password }));
	if (result.failure) return c.json({ message: result.error.message }, 500);
	return c.json(result.data);
});

user_routes.post("/login", async (c) => {
	const { username, password } = await c.req.json();

	const find_result = await Try(() => User.findOne({ username }).exec());
	if (find_result.failure) return c.json({ message: find_result.error.message }, 500);
	if (!find_result.data) return c.json({ message: "User not found" }, 400);
	const user = find_result.data;

	const compare_result = await Try(() => user.comparePassword(password));
	if (compare_result.failure) return c.json({ message: "Invalid password" }, 500);
	if (compare_result.data === false) return c.json({ message: "Unauthorized" }, 401);

	const token_gen_result = Try(() => {
		const access_token = jwt.sign({ id: user._id }, "super-secret-key", { expiresIn: "1h" });
		const refresh_token = jwt.sign({ id: user._id }, "super-secret-key", { expiresIn: "7d" });

		return [access_token, refresh_token];
	});
	if (token_gen_result.failure) return c.json({ message: token_gen_result.error.message }, 500);
	const [access_token, refresh_token] = token_gen_result.data;

	return c.json({ access_token, refresh_token });
});

user_routes.get("/me", authenticate, async (c) => {
	const user_id = c.get("user_id");
	const user = await Try(() => User.findById(user_id).exec());
	if (user.failure) return c.json({ message: user.error.message }, 500);
	if (!user.data) return c.json({ message: "User not found" }, 400);
	return c.json(user.data);
});

export { user_routes };
