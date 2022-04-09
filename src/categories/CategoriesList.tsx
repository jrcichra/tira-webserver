import { StarBorder } from "@mui/icons-material"
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { useEffect, useState } from "react"
import { API_BASE_URL } from "../EnvironmentVariables";

export default function CategoriesList({ open }: { open: boolean }) {
    let [categories, setCategories] = useState<any[]>([])

    useEffect(() => {
        fetch(`${API_BASE_URL}/categories?archived=false`)
            .then(response => response.json())
            .then(data => setCategories(data))
    }, []);

    const categoryElements = categories.map((c: any) => (
        <ListItemButton key={c.id} sx={{ pl: 4 }}>
            <ListItemIcon>
                <StarBorder />
            </ListItemIcon>
            <ListItemText primary={c.name} />
        </ListItemButton>
    ));

    return (
        <Collapse in={open} timeout='auto' unmountOnExit>
            <List component="div" disablePadding>
                {categoryElements}
            </List>
        </Collapse >
    )
}