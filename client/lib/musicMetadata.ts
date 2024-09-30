// @ts-ignore
import jsmediatags from 'jsmediatags-web';

const base64ToBlob = (base64: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(base64.split(',')[1]); // Decode base64, remove the data:image/ part
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  // Return a Blob with the correct content type (e.g., 'image/png')
  return new Blob(byteArrays, { type: contentType });
};

export const decodeMetaData = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    jsmediatags.read(file, {
      onSuccess({ tags }: any) {
        resolve(tags);
      },
      onError(error: Error) {
        console.error("Error decoding metadata", error);
        reject(new Error("Error decoding metadata"));
      }
    });
  });
}

export const decodeMetaDataToBlob = (file: File): Promise<Blob | null> => {
  return new Promise((resolve, reject) => {
    jsmediatags.read(file, {
      onSuccess({ tags }: any) {
        const picture = tags.picture;
        if (picture) {
          let base64String = "";
          for (let i = 0; i < picture.data.length; i++) {
            base64String += String.fromCharCode(picture.data[i]);
          }
          // Create the base64 image URI
          const imageUri = "data:" + picture.format + ";base64," + window.btoa(base64String);

          // Convert base64 image URI to a Blob
          const musicBlob = base64ToBlob(imageUri, picture.format);
          resolve(musicBlob); // Resolve with the Blob
        } else {
          console.warn("No picture available in the metadata.");
          resolve(null)
        }
      },
      onError(error: Error) {
        console.error("Error decoding metadata", error);
        reject(new Error("Error decoding metadata"));
      }
    });
  });
};