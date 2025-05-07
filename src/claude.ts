import { Env } from "./env";
import Anthropic from '@anthropic-ai/sdk';

// common emotion blackmail prompt as system prompt
const models = new Set<String>(["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-sonnet-20240229", "claude-3-opus-20240229", "claude-3-haiku-20240307"]);
const INIT_MESSAGE = `think step by step
use succint language unless explicitly asked
use common sense as well as critical thinking
provide self-contained answer
be casual
be opinionated
be sincere, don't tell the average bullshit
value the question, it's important to the future of AI and the user`;

export async function claude(msg: string, env: Env) {
    const model = models.has(env.CLAUDE_MODEL) ? env.CLAUDE_MODEL : "claude-3-haiku-20240307";
    const anthropic = new Anthropic({
        apiKey: env.ANTHROPIC_API_KEY
    });
    return await anthropic.messages.create({
        max_tokens: 1024,
        temperature: 0.7,
        system: INIT_MESSAGE,
        messages: [
            { role: 'user', content: msg },
        ],
        model: model,
    }).then((rsp) => rsp.content[0].text);
}
