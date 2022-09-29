import "reflect-metadata";
import { NextApiRequest } from "next";
import { HTTPHandler, createEndpoint } from "@owl-factory/https/backend";
import sass from "sass";

/**
 * Compiles SCSS or SASS code into CSS
 */
async function compileSass(this: HTTPHandler, req: NextApiRequest) {
  const compiled = sass.compileString(req.body.sass);
  this.returnSuccess({ css: compiled.css });
}

export default createEndpoint({POST: compileSass});
