export const uploadImage = async (filename: string, file: File) => {
  const response = await fetch(`/api/images/${filename}`, {
    method: 'POST',
    body: file,
  });

  if (!response.ok) {
    throw 'Failed to upload image';
  }
};
