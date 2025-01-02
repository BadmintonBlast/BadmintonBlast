import { IEnvironment} from "../interfaces/i-environment";

export const environment: IEnvironment = {
  production: true,
   apiUrl: 'https://localhost:7231/api/',
  // apiUrl: 'https://badmintonblast.azurewebsites.net/api/',
  ZeroBounce: {
    apiKey: '0d0981ba02824535a6287fba47adec46',
  },
  ssrIgnoresSsl: false,
  
};
