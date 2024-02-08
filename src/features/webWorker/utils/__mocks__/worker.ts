import { Ok } from "utils/results";

const mockWorker = {};

export const buildWorker = jest.fn(() => Ok(mockWorker));
