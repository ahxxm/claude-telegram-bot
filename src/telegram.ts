import { Env, webhookPath } from "./env";

interface From {
    id: number
}

interface Chat {
    id: number
    first_name: string
    type: string
}

interface Message {
    message_id: number
    from: From
    chat: Chat
    date: number
    text: string
}

export interface WebhookMessage {
    update_id: number
    message: Message
}


export async function handleMessage(env: Env, msg: WebhookMessage) {
    if (env.ALLOW_USERS.indexOf(msg.message.from.id) === -1) {
        return;
    }
    const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const params = {
        chat_id: msg.message.chat.id,
        text: msg.message.text, // FIXME: echo back now
        reply_parameters: {
            message_id: msg.message.message_id,
        }
    }
    const rspText = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    }).then((rsp) => rsp.text());
    console.log(`reply to ${msg.message.chat.id} with rep ${rspText}`);
}

export async function bindTelegramWebhook(env: Env, url: URL): Promise<Response> {
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