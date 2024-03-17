
export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;

	TELEGRAM_BOT_TOKEN: String,
}

const webhookPath = "/telegram";

async function bindTelegramWebhook(env: Env, url: URL): Promise<Response> {
	const bindURL = `https://${url.host}${webhookPath}`;
	const text = await fetch(
		`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setWebhook`,
		{
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
			url: bindURL,
		  }),
		},
	).then((rsp) => rsp.text());
	const rsp = `${text} \n the bind URL is: ${bindURL}`;
	return new Response(rsp);
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname == "/") {
			return await bindTelegramWebhook(env, url);
		}
		return new Response(url.pathname);
	},
};
