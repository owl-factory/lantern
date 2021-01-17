import { Min, Max } from "class-validator";

export class Options {
  @Min(0)
  skip = 0;

  @Min(1)
  @Max(50)
  limit = 25;

  sort?: Record<string, (1 | -1)>;
}