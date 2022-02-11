import { getSession } from "@owl-factory/auth/session";
import { rest } from "@owl-factory/https/rest";

const maxImageSize = 1000000;
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
