// @ts-ignore
import jsmediatags from 'jsmediatags-web';

export const decodeMetaData = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    jsmediatags.read(file, {
      onSuccess({ tags }: any) {
        const picture = tags.picture;
        if (picture) {
          let base64String = "";
          for (let i = 0; i < picture.data.length; i++) {
            base64String += String.fromCharCode(picture.data[i]);
          }
          const imageUri = "data:" + picture.format + ";base64," + window.btoa(base64String);
          resolve(imageUri);
        } else {
          resolve("No picture available");
        }
      },
      onError(error: Error) {
        console.error("Error decoding metadata", error);
        reject("Error decoding metadata");
      }
    });
  });
};
