import type { Context, Next } from "hono/mod.ts";
import { z } from "zod";

const body_validator = z.object({
	value: z.string().trim().min(1).optional(),
	completed: z.boolean().optional(),
});

export type PatchValidationKV = {
	Variables: {
		body: {
			value?: string;
			completed?: boolean;
		};
	};
};

export const patchValidationMiddleware = async (c: Context<PatchValidationKV>, next: Next) => {
	const body = await c.req.json();
	const validation_result = body_validator.safeParse(body);
	if (!validation_result.success) return c.json({ message: validation_result.error.message }, 400);

	c.set("body", validation_result.data);
	await next();
};
