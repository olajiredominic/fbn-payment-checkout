export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MINAMOUNT: number;
      MAXAMOUNT: number;
      AESKEY: string;
      TESTAPIURL:string
      LIVEAPIURL:string
      TESTFRAMEURL:string
      LIVEFRAMEURL:string
    }
  }
}