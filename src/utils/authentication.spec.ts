import "jest";
import { isBadPassword } from "utils/authentication";

test("isBadPassword function returns false if provided password meets requirements.", () => {
  const result = isBadPassword("lanterndevpassword!");
  expect(result).toBe(false);
});

test("isBadPassword function returns true if provided password is '1234'.", () => {
  const result = isBadPassword("1234");
  expect(result).toBe(true);
});

test("isBadPassword function returns true if provided password is 'password'.", () => {
  const result = isBadPassword("1234");
  expect(result).toBe(true);
});

test("isBadPassword function returns true if provided password is too long.", () => {
  const result = isBadPassword(
    "hjkljlij878^&^7878976asdjhgkjkhGTYHjkhjkhauyhukahsjhdjkahsdkjhaksu"
  );
  expect(result).toBe(true);
});

test("isBadPassword function returns true if provided password is too short.", () => {
  const result = isBadPassword("Hi!");
  expect(result).toBe(true);
});
