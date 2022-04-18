import {
  Box,
  Button,
  Grid,
  Paper,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { GridSelectionModel } from '@mui/x-data-grid';
import React from 'react';
import { useState, ChangeEvent } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import CategorySelect from '../components/CategorySelect';
import Heading from '../components/Heading';
import PrioritySelect from '../components/PrioritySelect';
import StatusSelect from '../components/StatusSelect';
import { API_BASE_URL } from '../EnvironmentVariables';
import { MemoizedUsersTable, UsersTable } from '../tables/UsersTable';
import {
  Category,
  CreatedTicket,
  ErrorMessage,
  Ticket,
  TicketAssignment,
} from '../utils/Types';
import Wysiwyg from '../Wysiwyg';

export default function CreateTicketPage({
  categories,
  setCategories,
  editMode,
}: {
  categories: Category[];
  setCategories: (newCategories: Category[]) => void;
  editMode?: boolean;
}) {
  let ticketId: number | undefined;

  if (editMode) {
    let params = useParams();
    let ticketIdStr = params.ticketId;

    if (!ticketIdStr) {
      return <h1>Error: ticketId not found</h1>;
    }

    ticketId = parseInt(ticketIdStr, 10);
  }

  const [subject, setSubject] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [categoryId, setCategoryId] = React.useState(0);
  const [priority, setPriority] = React.useState('Medium');
  const [status, setStatus] = React.useState('Backlog');
  const [assigneeIds, setAssigneeIds] = React.useState<GridSelectionModel>([]);

  const [subjectError, setSubjectError] = React.useState(false);
  const [assigneeIdsHasError, setAssigneeIdsHasError] = React.useState<
    number | undefined
  >(1);
  const [formError, setFormError] = useState('');

  let navigate = useNavigate();

  React.useEffect(() => {
    async function getTicketInfo() {
      if (!editMode || !ticketId) {
        return;
      }

      let ticketResponse = await fetch(`${API_BASE_URL}/tickets/${ticketId}`);
      if (!ticketResponse.ok) {
        return;
      }

      let ticketData: Ticket = await ticketResponse.json();

      setSubject(ticketData.subject);
      setDescription(ticketData.description);
      setCategoryId(ticketData.category_id ? ticketData.category_id : 0);
      setPriority(ticketData.priority);
      setStatus(ticketData.status);

      let assigneesResponse = await fetch(
        `${API_BASE_URL}/tickets/${ticketId}/assignments`
      );
      if (!assigneesResponse.ok) {
        return;
      }

      let assignees: number[] = [];
      let assigneesData: TicketAssignment[] = await assigneesResponse.json();
      assigneesData.forEach((assignee: TicketAssignment) => {
        assignees.push(assignee.assignee_id);
      });

      setAssigneeIds(assignees);
    }

    getTicketInfo();
  }, []);

  const handleSubjectChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newUsername = event.target.value;
    setSubjectError(newUsername === '');
    setSubject(newUsername);
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
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
    // TODO Add category id errner
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriority(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const handleAssigneesChange = (newAssigneeIds: GridSelectionModel) => {
    setAssigneeIds(newAssigneeIds);
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
      status: 'Backlog',
      priority,
      assignee_ids: assigneeIds,
    };

    try {
      if (editMode) {
        let response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticket),
        });

        if (response.ok) {
          navigate(`/tickets/${ticketId}`);
        } else {
          let data: ErrorMessage = await response.json();
          setFormError(data.message);
        }
      } else {
        let response = await fetch(`${API_BASE_URL}/tickets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticket),
        });

        if (response.ok) {
          let data: CreatedTicket = await response.json();
          navigate(`/tickets/${data.id}`);
        } else {
          let data: ErrorMessage = await response.json();
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

  const actionLabel = editMode ? 'Edit Ticket' : 'Create Ticket';
  const subjectHelperText = subjectError ? 'Subject is required' : '';

  return (
    <Grid>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Heading gutterBottom>{actionLabel}</Heading>
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
            onChange={handleDescriptionChange}
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
        <UsersTable
          autoHeight
          checkboxSelection
          selectionModel={assigneeIds}
          onSelectionModelChange={handleAssigneesChange}
          error={assigneeIdsHasError}
          setError={setAssigneeIdsHasError}
        />
        {formError && (
          <Typography
            align='center'
            component='h2'
            variant='h6'
            color='error'
            sx={{ mt: 2 }}
          >
            ERROR: {formError}
          </Typography>
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
      </Paper>
    </Grid>
  );
}
