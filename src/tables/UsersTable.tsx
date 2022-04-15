import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridInputSelectionModel,
  GridSelectionModel,
  GridToolbar,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import React from "react";
import { API_BASE_URL } from "../EnvironmentVariables";
import { ErrorMessage, User } from "../utils/Types";

const columns: GridColDef<User>[] = [
  { field: "username", headerName: "Username", width: 130 },
  {
    field: "name",
    headerName: "Name",
    width: 130,
    valueGetter: (params: GridValueGetterParams<string, User>) =>
      `${params.row.first_name} ${params.row.last_name}`,
  },
  {
    field: "email_address",
    headerName: "Email Address",
    width: 130,
    renderCell: (params: GridValueGetterParams<string, User>) => (
      <a href={"mailto:" + params.value}>{params.value}</a>
    ),
  },
  { field: "created", headerName: "Created", width: 230 },
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
