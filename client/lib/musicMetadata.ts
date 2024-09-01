
export const showImageFromFirebase = async (fileUrl: string): Promise<string | null> => {
  try {
    // Fetch the file from the Firebase URL
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch the image. Status: ${response.status}`);
    }

    // Convert the response to a Blob
    const blob = await response.blob();

    // Convert the Blob into an Object URL
    const objectUrl = URL.createObjectURL(blob);
    console.log("Object url is",objectUrl);
    
    return objectUrl;

  } catch (error) {
    console.error("Error fetching or displaying the image:", error);
    return null; // Return null in case of an error
  }
};

