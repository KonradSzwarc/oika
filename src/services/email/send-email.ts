import { render, toPlainText } from '@react-email/components';
import { createTransport } from 'nodemailer';
import { type ComponentProps, createElement } from 'react';
import type { Email } from '@/common/models/email';
import { serverEnv } from '@/services/env/server';
import * as Templates from './templates';

type EmailAddress = Email | { name: string; address: Email };

type TemplateName = keyof typeof Templates;

type Options = { to: EmailAddress | EmailAddress[] } & {
  [T in TemplateName]: { template: T; props: ComponentProps<(typeof Templates)[T]> };
}[TemplateName];

const transporter = createTransport(serverEnv.EMAIL_SERVER_URL, {
  from: serverEnv.EMAIL_FROM,
  secure: serverEnv.VITE_APP_ENV !== 'local',
});

export async function sendEmail(options: Options) {
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: code runs server-side and doesn't need bundle optimization.
  const template = Templates[options.template];

  const element = createElement(template, options.props);
  const html = await render(element);
  const text = toPlainText(html);
  const title = html.match(/<title.*>(?<title>.*?)<\/title>/)?.groups?.title;

  if (!title) {
    throw new Error(`Title is required for email ${options.template}`);
  }

  await transporter.sendMail({ to: options.to, subject: title, text, html });
}
