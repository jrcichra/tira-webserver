import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridInputSelectionModel,
  GridRenderCellParams,
  GridSelectionModel,
  GridToolbar,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import React from 'react';
import ProfilePicture from '../components/ProfilePicture';
import { API_BASE_URL } from '../EnvironmentVariables';
import { getLocalTime } from '../utils/TimeUtils';
import { User } from '../utils/Types';

const columns: GridColDef[] = [
  {
    field: 'username',
    headerName: 'Username',
    flex: 1,
    renderCell: (params: GridRenderCellParams<string, User>) => {
      return (
        <>
          <ProfilePicture user={params.row} />
          <span style={{ marginLeft: 10 }}>{params.row.username}</span>
        </>
      );
    },
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    valueGetter: (params: GridValueGetterParams<string, User>) =>
      `${params.row.first_name} ${params.row.last_name}`,
  },
  {
    field: 'email_address',
    headerName: 'Email Address',
    flex: 1,
    renderCell: (params: GridValueGetterParams<string, User>) => (
      <a href={'mailto:' + params.value}>{params.value}</a>
    ),
  },
  {
    field: 'created',
    headerName: 'Created',
    flex: 1,
    valueGetter: (params: GridValueGetterParams<string, User>) =>
      getLocalTime(params.row.created),
  },
];

export default function UsersTable({
  checkboxSelection,
  selectionModel,
  onSelectionModelChange,
  autoHeight,
  error,
  setError,
}: {
  checkboxSelection?: boolean;
  selectionModel?: GridInputSelectionModel;
  onSelectionModelChange?: (
    selectionModel: GridSelectionModel,
    details: GridCallbackDetails
  ) => void;
  autoHeight?: boolean;
  error?: number;
  setError: (newError?: number) => void;
}) {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const retrieveUsers = async () => {
      setError(undefined);
      try {
        const response = await fetch(`${API_BASE_URL}/users`);

        if (response.ok) {
          const data: User[] = await response.json();
          setUsers(data);
          setLoading(false);
        } else {
          setError(1);
          setLoading(false);
        }
      } catch (e) {
        setError(1);
        setLoading(false);
      }
    };

    retrieveUsers();
  }, []);

  return (
    <DataGrid
      rows={users}
      columns={columns}
      loading={loading}
      error={error}
      checkboxSelection={checkboxSelection}
      selectionModel={selectionModel}
      onSelectionModelChange={onSelectionModelChange}
      components={{ Toolbar: GridToolbar }}
      autoHeight={autoHeight}
    />
  );
}
