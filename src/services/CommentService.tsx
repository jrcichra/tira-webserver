export const updateComment = async (
  commentId: number,
  props: { content: string }
) => {
  const requestBody = {
    content: props.content,
  };

  const response = await fetch(`/api/comments/${commentId}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw `Failed to update comment #${commentId}`;
  }
};
