import { API_BASE_URL } from '../EnvironmentVariables';

export const uploadImage = async (
  onSuccess: (uploadedImageUrl: String) => void
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

      const response = await fetch(`${API_BASE_URL}/images/${filename}`, {
        method: 'POST',
        body: file,
      });

      if (response.ok) {
        onSuccess(`${API_BASE_URL}/images/${filename}`);
      }
    }
  };
};
