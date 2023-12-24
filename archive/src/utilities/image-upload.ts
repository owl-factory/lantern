import { getSession } from "nodes/auth";
import { rest } from "nodes/https";

const maxImageSize = 10000000;
export const typeRegex = /image\/(jpeg|png|webp)/;

export async function uploadImage(file: File) {
  const owner = getSession()?.ref;
  const image = Math.floor((Math.random() * 10000000)).toString();
  const type = file.type;

  console.log(file);

  if (!typeRegex.test(type)) {
    return alert("Wrong file type.");
  }
  if (file.size > maxImageSize) {
    return alert("Image is loo large.");
  }

  const response: any = await rest.post("/api/get-upload-url", { owner, image, type });

  const result = await fetch(response.data.url, {
    method: "PUT",
    body: file,
  });

  return result.url.substring(0, result.url.indexOf("?"));
}
