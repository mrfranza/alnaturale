'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';

interface Dipendente {
  codice: number;
  nome: string;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Settings() {
  const [dipendenti, setDipendenti] = useState<Dipendente[]>([]);

  // Carica i dati dal file JSON quando il componente si monta
  useEffect(() => {
    const loadData = async () => {
        try {
          const response = await fetch('/public/data/settings.json');
          const data: Dipendente[] = await response.json();
          setDipendenti(data);
        } catch (error) {
          console.error('Errore nel caricare i dati:', error);
        }}

    loadData();
  }, []);

  // Salva i dati in un file JSON ogni volta che 'dipendenti' cambia
  useEffect(() => {
    const saveData = async () => {
        try {
          const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dipendenti),
          });
      
          if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.status} - ${response.statusText}`);
          }
        } catch (error) {
          console.error('Errore nel salvare i dati:', error);
        }
      };

    saveData();
  }, [dipendenti]);

  const handleNameChange = (codice: number, nome: string) => {
    // Trova l'indice del dipendente con il codice specificato
    const index = dipendenti.findIndex((d) => d.codice === codice);

    // Aggiorna il nome del dipendente
    const updatedDipendenti = [...dipendenti];
    updatedDipendenti[index] = { ...updatedDipendenti[index], nome };

    // Aggiorna lo stato
    setDipendenti(updatedDipendenti);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              Al Naturale - Convertitore di Timbrature
            </Typography>
            <Box>
              <Button key={'Account'} sx={{ color: '#fff' }} onClick={undefined}>
                <SettingsIcon />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
          <Box sx={{ padding: 2 }}>
            <TableContainer>
              <Table>
                <TableBody>
                  {Array.from({ length: 99 }, (_, index) => {
                    const codice = index + 1;
                    const nome = dipendenti.find((d) => d.codice === codice)?.nome || '';
                    return (
                      <TableRow key={codice}>
                        <TableCell>{codice}</TableCell>
                        <TableCell>
                          <TextField
                            value={nome}
                            onChange={(e) => handleNameChange(codice, e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
      </Box>
    </ThemeProvider>
  );
}