import "jest";
import { ping } from "hooks/useOnlineStatus";
import { OkResult } from "types/functional";

global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve("pong"),
    ok: true,
    status: 200,
  })
) as jest.Mock;

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
});

test("ping returns ok result with undefined data", async () => {
  const result = await ping();
  await expect(result.ok).toBe(true);
  await expect((result as OkResult<undefined>).data).toBe(undefined);
});
