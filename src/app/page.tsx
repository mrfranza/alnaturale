"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SettingsIcon from "@mui/icons-material/Settings";
import { Grid, Link, Stack } from "@mui/material";
import TablePrint from "./home/table";
import Upload from "./home/upload";
import { Timbratura } from "./calculator/timbratura";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Home() {
  const [timbrature, setTimbrature] = useState<Timbratura[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Al Naturale - Convertitore di Timbrature
            </Typography>
            <Box>
              <Link href="/settings">
                <Button
                  key={"Account"}
                  sx={{ color: "#fff" }}
                  onClick={handleSettingsClick}
                >
                  <SettingsIcon />
                </Button>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Stack>
          <Upload setTimbrature={setTimbrature} />
          <TablePrint timbrature={timbrature} />
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
