import { bytesToReadable } from "../bytes";

test("bytesToReadable", () => {
  const bytes = bytesToReadable(500);
  const kilobytes = bytesToReadable(2048);
  const terrabytes = bytesToReadable(1024 * 1024 * 1024 * 1024);

  expect(bytes).toBe("500 B");
  expect(kilobytes).toBe("2 KB");
  expect(terrabytes).toBe("1 TB");
});
