import { readFileSync } from "fs";

export function getGitCommitId() {
  const revision = readFileSync(".git/HEAD").toString().trim();
  if (revision.indexOf(":") === -1) {
    return revision;
  } else {
    return readFileSync(".git/" + revision.substring(5))
      .toString()
      .trim();
  }
}
