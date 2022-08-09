import { uploadImage } from '../services/ImageService';

export const uploadImageUtil = async (
  onSuccess: (uploadedImageUrl: string) => void
) => {
  const input = document.createElement('input');

  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const files = input.files;
    if (files && files[0]) {
      const file = files[0];

      const currentdate = new Date();
      const fileNamePredecessor =
        currentdate.getDate().toString() +
        currentdate.getMonth().toString() +
        currentdate.getFullYear().toString() +
        currentdate.getTime().toString();
      const filename = fileNamePredecessor + file.name;

      try {
        uploadImage(filename, file);
        onSuccess(`/api/images/${filename}`);
      } catch (error) {
        console.error(error);
      }
    }
  };
};
