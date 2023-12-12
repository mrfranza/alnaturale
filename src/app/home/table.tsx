import { Grid, Paper, TableRow, Button } from "@mui/material";
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { Timbratura } from "../calculator/timbratura";

interface TableRow {
  id: number;
  codiceDipendente: string;
  tipoOperazione: string;
  data: string;
  ora: string;
  minuti: string;
}

interface TableProps {
  timbrature: Timbratura[];
}

export default function TablePrint({timbrature}:TableProps) {
  const rows: TableRow[] = timbrature.map((timbratura, index) => ({
    id: index + 1,
    ...timbratura,
  }));
    
  const columns: GridColDef[] = [
    { field: 'codiceDipendente', headerName: 'Codice Dipendente', flex: 1 },
    { field: 'tipoOperazione', headerName: 'Tipo Operazione', flex: 1 },
    { field: 'data', headerName: 'Data Timbratura', flex: 1 },
    { field: 'ora', headerName: 'Ora', flex: 1 },
    { field: 'minuti', headerName: 'Minuti', flex: 1 },
  ];

  const handleDownloadExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Timbrature');
  
    // Aggiungi l'intestazione alla foglio Excel con stile
    columns.forEach((column, columnIndex) => {
      const cell = worksheet.getCell(1, columnIndex + 1);
  
      // Verifica se column ha la chiave headerName
      if (column.headerName) {
        cell.value = column.headerName;
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } }; // Colore di sfondo giallo
        cell.border = { bottom: { style: 'thin', color: { argb: '000000' } } }; // Bordo inferiore sottile
        cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Allineamento al centro
  
        // Imposta la larghezza della colonna in base al contenuto più lungo
        const columnWidth = column.headerName.length * 2; // Puoi regolare questo fattore di moltiplicazione secondo le tue esigenze
        worksheet.getColumn(columnIndex + 1).width = columnWidth;
      }
    });
  
    // Aggiungi dati alle righe del foglio Excel con stile
    rows.forEach((row, rowIndex) => {
      const excelRow = worksheet.addRow(row); // Passa l'oggetto row direttamente al metodo addRow
      columns.forEach((column, columnIndex) => {
        const cell = excelRow.getCell(columnIndex + 1);
        cell.value = row[column.field as keyof TableRow];
        cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Allineamento al centro
        cell.border = { bottom: { style: 'thin', color: { argb: '000000' } } }; // Bordo inferiore sottile
        // Puoi personalizzare ulteriormente lo stile delle celle a seconda delle tue esigenze
      });
    });
  
    // Salva il foglio Excel
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'table.xlsx');
    });
  };

    return (
        <Grid item xs={12} sm={6.85} mx={'auto'} my={1} >
            <Paper         
            elevation={3}
            style={{
              padding: '20px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              borderRadius: '15px',
            }}>
            {/* Aggiungi la tua tabella */}
            <DataGrid
                rows={rows}
                columns={columns}
            />

            {/* Aggiungi il tasto per scaricare la tabella */}
            <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: '10px' }}
                onClick={handleDownloadExcel}
            >
                Scarica Excel
            </Button>
            </Paper>
        </Grid>
    );
}
