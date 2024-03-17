import { WebhookMessage, bindTelegramWebhook, handleMessage } from "./telegram";
import { Env } from "./env";

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname == "/") {
			return await bindTelegramWebhook(env, url);
		}
		const data = await request.json<WebhookMessage>();
		await handleMessage(env, data);
		return new Response(url.pathname);
	},
};
