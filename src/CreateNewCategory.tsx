import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useState, ChangeEvent } from "react";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./EnvironmentVariables";
import { Category } from "./utils/Types";

export default function CreateNewCategory({
  setCategories,
}: {
  setCategories: (category: Category[]) => void;
}) {
  const [fields, setFields] = useState({
    name: "",
    description: "",
  });

  const handleTextFieldChange =
    (key: string) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields({ ...fields, [key]: event.target.value });
    };

  const handleSubmit = () => {
    fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    }).then(() => {
      fetch(`${API_BASE_URL}/categories?archived=false`)
        .then((response) => response.json())
        .then((data: Category[]) => setCategories(data));
    });
  };

  useNavigate();

  return (
    <Grid>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Create new category
        </Typography>
        <TextField
          value={fields.name}
          onChange={handleTextFieldChange("name")}
          id="outlined-basic"
          label="Name"
          variant="outlined"
        />
        <TextField
          value={fields.description}
          onChange={handleTextFieldChange("description")}
          margin="normal"
          id="outlined-basic"
          label="Description"
          variant="outlined"
        />
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            mt: 2,
          }}
          fullWidth
        >
          Create Categories
        </Button>
      </Paper>
    </Grid>
  );
}
