export interface IEnvironment {
  production: boolean;
  apiUrl: string;
  ssrIgnoresSsl: boolean;
  ZeroBounce: {
    apiKey: string;
  };
}
