import { TextField, Box, SelectChangeEvent, Button } from '@mui/material';
import { GridSelectionModel } from '@mui/x-data-grid';
import React, { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category, CreatedTicket, ErrorMessage, Ticket } from '../utils/Types';
import Wysiwyg from '../Wysiwyg';
import CategorySelect from './CategorySelect';
import PrioritySelect from './PrioritySelect';
import StatusSelect from './StatusSelect';

export default function CreateTicketTextFields({
  categories,
  setCategories,
  editMode,
  ticketId,
  assigneeIds,
  assigneeIdsHasError,
  actionLabel,
  setFormError,
}: {
  categories: Category[];
  setCategories: (newCategories: Category[]) => void;
  editMode: boolean | undefined;
  ticketId: number | undefined;
  assigneeIds: GridSelectionModel;
  assigneeIdsHasError: number | undefined;
  actionLabel: string;
  setFormError: (newFormError: string) => void;
}) {
  const [subject, setSubject] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [categoryId, setCategoryId] = React.useState(0);
  const [priority, setPriority] = React.useState('Medium');
  const [status, setStatus] = React.useState('Backlog');

  const [subjectError, setSubjectError] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    async function getTicketInfo() {
      if (!editMode || !ticketId) {
        return;
      }

      try {
        const ticketResponse = await fetch(`/api/tickets/${ticketId}`);

        if (!ticketResponse.ok) {
          throw new Error('Failed to retrieve users');
        }

        const ticketData: Ticket = await ticketResponse.json();

        setSubject(ticketData.subject);
        setDescription(ticketData.description);
        setCategoryId(ticketData.category ? ticketData.category.id : 0);
        setPriority(ticketData.priority);
        setStatus(ticketData.status);
      } catch (err) {
        if (err instanceof Error) {
          setFormError(err.message);
        }
      }
    }

    getTicketInfo();
  }, [editMode, setFormError, ticketId]);

  const handleSubjectChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newUsername = event.target.value;
    setSubjectError(newUsername === '');
    setSubject(newUsername);
  };

  const handleCategorySelectChange = (event: SelectChangeEvent<number>) => {
    let newCategoryId = event.target.value;
    if (typeof newCategoryId === 'string') {
      newCategoryId = parseInt(newCategoryId);
    }

    if (!isNaN(newCategoryId)) {
      setCategoryId(newCategoryId);
      return;
    }

    setFormError('Category Id is not a number');
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriority(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const validateFields = () => {
    if (!subject || assigneeIdsHasError) {
      setSubjectError(!subject);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    const ticket = {
      category_id: categoryId === 0 ? null : categoryId,
      subject,
      description,
      status,
      priority,
      assignee_ids: assigneeIds,
    };

    try {
      if (editMode) {
        const response = await fetch(`/api/tickets/${ticketId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticket),
        });

        if (response.ok) {
          navigate(`/tickets/${ticketId}`);
        } else {
          const data: ErrorMessage = await response.json();
          setFormError(data.message);
        }
      } else {
        ticket.status = 'Backlog';

        const response = await fetch(`/api/tickets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticket),
        });

        if (response.ok) {
          const data: CreatedTicket = await response.json();
          navigate(`/tickets/${data.id}`);
        } else {
          const data: ErrorMessage = await response.json();
          setFormError(data.message);
        }
      }
    } catch (e) {
      console.error(e);

      if (typeof e === 'string') {
        setFormError(e);
      }
    }
  };

  const subjectHelperText = subjectError ? 'Subject is required' : undefined;

  return (
    <>
      <TextField
        value={subject}
        onChange={handleSubjectChange}
        error={subjectError}
        helperText={subjectHelperText}
        margin='normal'
        id='outlined-basic'
        label='Subject'
        variant='outlined'
      />
      <Box sx={{ mt: 1, mb: 1 }}>
        <Wysiwyg
          value={description}
          onChange={setDescription}
          placeholder='Description'
        />
      </Box>
      <CategorySelect
        categories={categories}
        setCategories={setCategories}
        selectedIndex={categoryId}
        onChange={handleCategorySelectChange}
      />
      <PrioritySelect priority={priority} onChange={handlePriorityChange} />
      {editMode && (
        <StatusSelect status={status} onChange={handleStatusChange} />
      )}
      <Button
        onClick={handleSubmit}
        variant='contained'
        color='primary'
        sx={{
          mt: 2,
        }}
        fullWidth
      >
        {actionLabel}
      </Button>
    </>
  );
}
