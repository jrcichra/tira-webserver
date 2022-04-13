import { StarBorder } from "@mui/icons-material"
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { useEffect } from "react"
import { API_BASE_URL } from "../EnvironmentVariables";
import { Category } from "../utils/Types";

export default function CategoriesList({ open, categories, setCategories }: { open: boolean, categories: Category[], setCategories: (category: Category[]) => void }) {
    useEffect(() => {
        fetch(`${API_BASE_URL}/categories?archived=false`)
            .then(response => response.json())
            .then((data: Category[]) => setCategories(data))
    }, []);

    const categoryElements = categories.map((c: Category) => (
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