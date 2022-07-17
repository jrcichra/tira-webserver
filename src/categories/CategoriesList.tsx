import { StarBorder } from '@mui/icons-material';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { fetchCategories } from '../services/CategoryService';
import { Category } from '../utils/Types';

export default function CategoriesList({
  open,
  categories,
  setCategories,
}: {
  open: boolean;
  categories: Category[];
  setCategories: (category: Category[]) => void;
}) {
  React.useEffect(() => {
    async function refreshCategories() {
      const categories = await fetchCategories({
        archived: false,
      });

      setCategories(categories);
    }

    refreshCategories();
  }, [setCategories]);

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
      <List component='div' disablePadding>
        {categoryElements}
      </List>
    </Collapse>
  );
}
