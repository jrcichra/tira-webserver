import ReactQuill from 'react-quill';
import { API_BASE_URL } from './EnvironmentVariables';
import React from 'react';

export default function Wysiwyg({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  let quillObj: ReactQuill | null;

  const handleImageUpload = async () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (quillObj) {
        const range = quillObj.getEditorSelection();

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

            const response = await fetch(`${API_BASE_URL}/images/${filename}`, {
              method: 'POST',
              body: file,
            });

            if (response.ok) {
              quillObj
                .getEditor()
                .insertEmbed(
                  range.index,
                  'image',
                  `${API_BASE_URL}/images/${filename}`
                );
            }
          }
        }
      }
    };
  };

  return (
    <ReactQuill
      ref={(el) => {
        quillObj = el;
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
