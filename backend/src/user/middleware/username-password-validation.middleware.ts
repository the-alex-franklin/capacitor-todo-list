import type { Context, Next } from "hono/mod.ts";
import { z } from "zod";

const sign_up_sign_in_body_schema = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
});

export type UsernamePasswordKV = {
	Variables: {
		username: string;
		password: string;
	};
};

export const usernamePasswordValidator = async (c: Context<UsernamePasswordKV>, next: Next) => {
	const raw_body: unknown = await c.req.json();
	const parsed_body = sign_up_sign_in_body_schema.safeParse(raw_body);
	if (!parsed_body.success) return c.json({ message: parsed_body.error.message }, 400);

	const { username, password } = parsed_body.data;
	c.set("username", username);
	c.set("password", password);

	await next();
};
