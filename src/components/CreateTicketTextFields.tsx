import { TextField, Box, SelectChangeEvent, Button } from '@mui/material';
import { GridSelectionModel } from '@mui/x-data-grid';
import React, { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createTicket,
  retrieveTicketById,
  updateTicket,
} from '../services/TicketService';
import { Category } from '../utils/Types';
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
  categories?: Category[];
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
        const ticketToEdit = await retrieveTicketById(ticketId);

        setSubject(ticketToEdit.subject);
        setDescription(ticketToEdit.description);
        setCategoryId(ticketToEdit.category ? ticketToEdit.category.id : 0);
        setPriority(ticketToEdit.priority);
        setStatus(ticketToEdit.status);
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
      categoryId: categoryId === 0 ? null : categoryId,
      subject,
      description,
      status,
      priority,
      assigneeIds: assigneeIds.map((row) =>
        typeof row === 'string' ? parseInt(row) : row
      ),
    };

    try {
      if (editMode && ticketId) {
        try {
          await updateTicket(ticketId, ticket);
          navigate(`/tickets/${ticketId}`);
        } catch (error) {
          if (typeof error === 'string') {
            setFormError(error);
          }
        }
      } else {
        ticket.status = 'Backlog';

        try {
          const createdTicketId = await createTicket(ticket);
          navigate(`/tickets/${createdTicketId}`);
        } catch (error) {
          if (typeof error === 'string') {
            setFormError(error);
          }
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
