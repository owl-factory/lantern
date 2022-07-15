export type OnMessage = (
  ((this: WindowEventHandlers, ev: MessageEvent<any>) => any) &
  ((this: Window, ev: MessageEvent<any>) => any)
) | null;

export interface SandboxWorkerMethods {
  onmessage: OnMessage,
}

