import { Grid, Paper, TextField, Typography } from "@mui/material";
import { Editor, EditorState } from 'draft-js';
import { useState, useRef, useEffect } from "react";

export default function CreateTicketPage() {

    const [editorState, setEditorState] = useState(
        EditorState.createEmpty()
    );

    const editor = useRef<Editor>(null);

    function focusEditor() {
        if(editor.current) {
            editor.current.focus();
        }
    }

    useEffect(() => {
        focusEditor()
    }, []);

    return (
        <Grid>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Create new ticket
                </Typography>
                <Editor
                    ref={editor}
                    editorState={editorState}
                    onChange={editorState => setEditorState(editorState)}
                />
                <TextField id="outlined-basic" label="Subject" variant="outlined" />
            </Paper>
        </Grid>
    )
}