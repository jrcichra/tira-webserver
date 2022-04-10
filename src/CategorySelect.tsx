import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { Category } from "./utils/Types";

export default function CategorySelect({categories, selectedIndex, onChange}: {categories: Category[], selectedIndex: number, onChange: (event: SelectChangeEvent<number>) => void}) {
    const categoryElements = categories.map((c: Category) => (
        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
    ));

    categoryElements.unshift(
        <MenuItem key={0} value={0}>N/A</MenuItem>
    )
    
    return (
        <FormControl margin="normal" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
                value={selectedIndex}
                label='Category'
                onChange={onChange}
            >
                {categoryElements}
            </Select>
        </FormControl>
    )
}