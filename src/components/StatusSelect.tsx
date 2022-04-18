import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

export default function StatusSelect({
  status,
  onChange,
}: {
  status: string;
  onChange: (event: SelectChangeEvent) => void;
}) {
  return (
    <FormControl margin='normal' fullWidth>
      <InputLabel>Status</InputLabel>
      <Select value={status} label='Status' onChange={onChange}>
        <MenuItem value={'Backlog'}>Backlog</MenuItem>
        <MenuItem value={'In Progress'}>In Progress</MenuItem>
        <MenuItem value={'In Review'}>In Review</MenuItem>
        <MenuItem value={'Done'}>Done</MenuItem>
        <MenuItem value={'Closed'}>Closed</MenuItem>
      </Select>
    </FormControl>
  );
}
