import { MockGameServer } from "tests/client/server/MockGameServer";



describe(`Assume Host`, () => {
  const gameServer = new MockGameServer();
  test(`assumed host`, () => {
    // gameServer.assume
  });
});

describe(`CalculateHostPriority`, () => {
  const gameServer = new MockGameServer();
  test(`Initial Host Priority is empty`, () => {
    expect(gameServer.hostPriority).toBeUndefined();
  });

  test(`Non-Host Priority`, () => {
    gameServer.calculateHostPriority();
    expect(gameServer.hostPriority).toBeDefined();
    expect(gameServer.hostPriority.peerID).toBe("test-id");
    expect(gameServer.hostPriority.priority).toBe(1);
    expect(gameServer.hostPriority.isHost).toBeFalsy();
  });

  test(`Non-Host Priority`, () => {
    gameServer.gameState.host = "test-id";
    gameServer.calculateHostPriority();
    expect(gameServer.hostPriority).toBeDefined();
    expect(gameServer.hostPriority.peerID).toBe("test-id");
    expect(gameServer.hostPriority.priority).toBe(1);
    expect(gameServer.hostPriority.isHost).toBeTruthy();
  });
});

describe 
