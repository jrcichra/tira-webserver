import { DataGrid, GridCallbackDetails, GridColDef, GridInputSelectionModel, GridSelectionModel, GridToolbar, GridValueGetterParams } from "@mui/x-data-grid";
import { User } from "../utils/Types";

const columns: GridColDef<User>[] = [
    { field: 'username', headerName: 'Username', width: 130 },
    {
        field: 'name',
        headerName: 'Name',
        width: 130,
        valueGetter: (params: GridValueGetterParams<string, User>) => `${params.row.first_name} ${params.row.last_name}`,
    },
    {
        field: 'email_address',
        headerName: 'Email Address',
        width: 130,        
        renderCell: (params: GridValueGetterParams<string, User>) => (
            <a href={"mailto:" + params.value}>{params.value}</a>
        ),
    },
    { field: 'created', headerName: 'Created', width: 230 },
]

export default function UsersTable({users, checkboxSelection, selectionModel, onSelectionModelChange, autoHeight}: {users: User[], checkboxSelection?: boolean, selectionModel?: GridInputSelectionModel, onSelectionModelChange?: (selectionModel: GridSelectionModel, details: GridCallbackDetails) => void, autoHeight?: boolean}) {
    return (
        <DataGrid
            rows={users}
            columns={columns}
            checkboxSelection={checkboxSelection}
            selectionModel={selectionModel}
            onSelectionModelChange={onSelectionModelChange}
            components={{ Toolbar: GridToolbar }}
            autoHeight={autoHeight}
        />
    )
}