import { Grid, Paper, Typography } from '@mui/material';
import { GridSelectionModel } from '@mui/x-data-grid';
import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import CreateTicketTextFields from '../components/CreateTicketTextFields';
import Heading from '../components/Heading';
import { API_BASE_URL } from '../EnvironmentVariables';
import UsersTable from '../tables/UsersTable';
import { Category, TicketAssignment } from '../utils/Types';

export default function CreateTicketPage({
  categories,
  setCategories,
  editMode,
}: {
  categories: Category[];
  setCategories: (newCategories: Category[]) => void;
  editMode?: boolean;
}) {
  const [assigneeIds, setAssigneeIds] = React.useState<GridSelectionModel>([]);
  const [assigneeIdsHasError, setAssigneeIdsHasError] = React.useState<
    number | undefined
  >(1);

  const [formError, setFormError] = useState('');

  const params = useParams();

  let ticketId: number | undefined;

  React.useEffect(() => {
    async function getAssignees() {
      if (!editMode || !ticketId) {
        return;
      }

      try {
        const assigneesResponse = await fetch(
          `${API_BASE_URL}/tickets/${ticketId}/assignments`
        );

        if (!assigneesResponse.ok) {
          throw new Error('Error retrieving ticket assignments');
        }

        const assigneeIds: number[] = [];

        const assigneesData: TicketAssignment[] =
          await assigneesResponse.json();
        assigneesData.forEach((assignee: TicketAssignment) => {
          assigneeIds.push(assignee.assignee_id);
        });

        setAssigneeIds(assigneeIds);
      } catch (e) {
        setAssigneeIdsHasError(1);
      }
    }

    getAssignees();
  }, [editMode, ticketId]);

  if (editMode) {
    const ticketIdStr = params.ticketId;

    if (!ticketIdStr) {
      return <h1>Error: ticketId not found</h1>;
    }

    ticketId = parseInt(ticketIdStr, 10);
  }

  const handleAssigneesChange = (newAssigneeIds: GridSelectionModel) => {
    setAssigneeIds(newAssigneeIds);
  };

  const actionLabel = editMode ? 'Edit Ticket' : 'Create Ticket';

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
        <CreateTicketTextFields
          categories={categories}
          setCategories={setCategories}
          editMode={editMode}
          ticketId={ticketId}
          assigneeIds={assigneeIds}
          assigneeIdsHasError={assigneeIdsHasError}
          actionLabel={actionLabel}
          setFormError={setFormError}
        />
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
      </Paper>
    </Grid>
  );
}
