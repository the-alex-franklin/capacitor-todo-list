import type { Context, Next } from "hono/mod.ts";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { Try } from "../utils/functions/try.ts";

const jwt_payload_schema = z.object({
	user_id: z.string().min(1),
});

type JwtPayload = z.infer<typeof jwt_payload_schema>;

export type AuthenticationKV = {
	Variables: JwtPayload;
};

export const authenticationMiddleware = async (c: Context<AuthenticationKV>, next: Next) => {
	const authHeader = c.req.header("Authorization");
	if (!authHeader) return c.json({ message: "Unauthorized" }, 401);

	const token = authHeader.match(/^Bearer (.+)$/)?.[1];
	if (!token) return c.json({ message: "Token is missing" }, 401);

	const unknown_payload = Try(() => jwt.verify(token, "super-secret-key"));
	if (!unknown_payload.success) return c.json({ message: "Invalid token" }, 401);

	const parsed_payload = jwt_payload_schema.safeParse(unknown_payload.data);
	if (!parsed_payload.success) return c.json({ message: "Malformed Jwt" }, 401);

	const payload = parsed_payload.data;
	c.set("user_id", payload.user_id);

	await next();
};
