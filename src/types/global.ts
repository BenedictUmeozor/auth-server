export interface User {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
}

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}
