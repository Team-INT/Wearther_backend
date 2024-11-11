import { registerAs } from '@nestjs/config';

export default registerAs('openai', () => ({
  apiKey: process.env.OPENAI_SECRET_KEY,
  organization: process.env.OPENAI_ORGANIZATION_KEY,
  assistantId: process.env.OPENAI_ASSISTANT_ID,
}));
