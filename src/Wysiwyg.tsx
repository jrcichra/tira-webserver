import ReactQuill from 'react-quill';
import React from 'react';
import { uploadImage } from './services/ImageService';

export default function Wysiwyg({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const quillObj = React.useRef<ReactQuill | null>(null);

  const handleImageUpload = async () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (quillObj.current) {
        const range = quillObj.current.getEditorSelection();

        if (range) {
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
              await uploadImage(filename, file);

              quillObj.current
                .getEditor()
                .insertEmbed(range.index, 'image', `/api/images/${filename}`);
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
    };
  };

  return (
    <ReactQuill
      ref={(el) => {
        quillObj.current = el;
      }}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      modules={{
        toolbar: {
          container: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' },
            ],
            ['link', 'image'],
            ['clean'],
          ],
          handlers: {
            image: handleImageUpload,
          },
        },
      }}
    />
  );
}
