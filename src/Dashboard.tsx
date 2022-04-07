import { Grid, Paper, Typography } from "@mui/material";

export default function DashBoard() {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Open Tickets Reported By You
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Open Tickets Reported By You
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <h1>wenny</h1>
                </Paper>
            </Grid>
        </Grid>
    )
}