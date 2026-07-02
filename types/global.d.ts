declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

type EmailJsClient = {
  init: (publicKey: string) => void;
  send: (serviceId: string, templateId: string, templateParams: Record<string, string | number>) => Promise<unknown>;
};

type PaystackSetupOptions = {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref: string;
  metadata?: Record<string, unknown>;
  callback: (response: { reference: string; status?: string; trans?: string }) => void;
  onClose?: () => void;
};

type PaystackClient = {
  setup: (options: PaystackSetupOptions) => { openIframe: () => void };
};

interface Window {
  emailjs?: EmailJsClient;
  PaystackPop?: PaystackClient;
}
