import type { Context, Next } from "hono/mod.ts";
import { z } from "zod";

const body_validator = z.object({
	value: z.string().trim().min(1),
});

export type BodyValidationKV = {
	Variables: {
		body: {
			value: string;
		};
	};
};

export const bodyValidationMiddleware = async (c: Context<BodyValidationKV>, next: Next) => {
	const body = await c.req.json();
	const validation_result = body_validator.safeParse(body);
	if (!validation_result.success) return c.json({ message: validation_result.error.message }, 400);

	c.set("body", validation_result.data);
	await next();
};
