export interface DataEngineAPI {
  load: (id: string, referrer: string) => Promise<boolean>;
  free: (id: string, referrer: string) => boolean;
}
