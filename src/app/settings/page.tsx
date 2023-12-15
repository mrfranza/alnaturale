'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Stack, AppBar, CssBaseline, Link, Toolbar, Typography, Snackbar, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import MuiAlert from '@mui/material/Alert';
import React from 'react';

interface Employee {
  id: number;
  name: string;
}

interface Info {
  isError: boolean;
  message: string;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Settings: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployeeName, setNewEmployeeName] = useState<string>('');
  const [info, setInfo] = useState<Info | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get<Employee[]>('/api/settings');
      setEmployees(response.data);
    } catch (error) {
      setInfo({ isError: true, message: 'Error fetching data' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEmployee = async () => {
    try {
      const response = await axios.post('/api/settings', { name: newEmployeeName });
      setEmployees([...employees, { id: response.data.id, name: newEmployeeName }]);
      setNewEmployeeName('');
      setInfo({ isError: false, message: 'Employee added successfully' });
    } catch (error) {
      setInfo({ isError: true, message: 'Error adding employee' });
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedEmployeeData = employees.map((employee) => ({ id: employee.id, name: employee.name }));
      await axios.put('/api/settings', updatedEmployeeData);
      setEmployees(updatedEmployeeData);
      setInfo({ isError: false, message: 'Changes saved successfully' });
    } catch (error) {
      setInfo({ isError: true, message: 'Error saving changes' });
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      await axios.delete(`/api/settings?id=${id}`);
      setEmployees(employees.filter((employee) => employee.id !== id));
      setInfo({ isError: false, message: 'Employee deleted successfully' });
    } catch (error) {
      setInfo({ isError: true, message: 'Error deleting employee' });
    }
  };

  const handleNameChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index].name = event.target.value;
    setEmployees(updatedEmployees);
    setInfo({ isError: false, message: 'Employee modified successfully' });
  };

  const handleIdChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index].id = parseInt(event.target.value, 10);
    setEmployees(updatedEmployees);
    setInfo({ isError: false, message: 'Employee modified successfully' });
  };

  const handleCloseSnackbar = () => {
    setInfo(null);
  };


  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <CssBaseline />
        <AppBar component="nav" >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              Al Naturale - Convertitore di Timbrature
            </Typography>
            <Box>
              <Link href="/">
                <Button key={'Account'} sx={{ color: '#fff' }} >
                  <SettingsIcon />
                </Button>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Stack>
          <Box mt={3} p={3} bgcolor="background.paper" borderRadius={8} boxShadow={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Codice</TableCell>
                    <TableCell align="left">Nome</TableCell>
                    <TableCell align="left">Azioni</TableCell> {/* Aggiunto il titolo per l'ultima colonna */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          type="text"
                          value={employee.id}
                          onChange={(e) => handleIdChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="text"
                          value={employee.name}
                          onChange={(e) => handleNameChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" color="secondary" onClick={() => handleDeleteEmployee(employee.id)}>
                          Elimina
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button variant="contained" onClick={handleAddEmployee}>
                Aggiungi Dipendente
              </Button>
              <Button variant="contained" sx={{ backgroundColor: 'darkorange' }} onClick={handleSaveChanges}>
                Salva Modifiche
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
      <Snackbar
          open={info !== null}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          action={undefined}
        >
          <MuiAlert
            variant="filled"
            severity={info?.isError ? 'error' : 'success'}
            onClose={handleCloseSnackbar}
          >
            {info?.message}
          </MuiAlert>
        </Snackbar>
    </ThemeProvider>
  );
};


export default Settings;