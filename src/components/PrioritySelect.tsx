import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";

export default function PrioritySelect({
  priority,
  onChange,
}: {
  priority: string;
  onChange: (event: SelectChangeEvent) => void;
}) {
  return (
    <FormControl margin="normal" fullWidth>
      <InputLabel>Priority</InputLabel>
      <Select value={priority} label="Priority" onChange={onChange}>
        <MenuItem value={"Low"}>Low</MenuItem>
        <MenuItem value={"Medium"}>Medium</MenuItem>
        <MenuItem value={"High"}>High</MenuItem>
      </Select>
    </FormControl>
  );
}
