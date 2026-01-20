export {};

declare global {
  interface Window {
    __SITE_KEY__?: string;

    onCaptchaOk?: (token: string) => void;
    onCaptchaExpired?: () => void;

    grecaptcha?: {
      render: (container: HTMLElement | string, parameters: Record<string, any>) => number;
      getResponse: (opt_widget_id?: number) => string;
      reset: (opt_widget_id?: number) => void;
    };
  }
}
