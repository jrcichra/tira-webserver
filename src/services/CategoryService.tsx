import { Category } from '../utils/Types';

export const createCategory = async (props: {
  name: string;
  description: string;
}) => {
  const response = await fetch('/api/categories', {
    method: 'POST',
    body: JSON.stringify(props),
  });

  if (!response.ok) {
    throw 'Failed to add category';
  }
};

export const fetchCategories = async (props?: { archived?: boolean }) => {
  const url = new URL('/api/categories', window.location.href);

  if (props != undefined) {
    if (props.archived != undefined) {
      url.searchParams.append('archived', String(props.archived));
    }
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw 'Failed to retrieve categories';
  }

  const data: Category[] = await response.json();

  return data;
};
