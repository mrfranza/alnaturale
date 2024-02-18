"use client";
import {
  Paper,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
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

export default function TablePrint({ timbrature }: TableProps) {
  const [rows, setRows] = useState<TableRow[]>([]);

  useEffect(() => {
    // Quando cambia la prop timbrature, aggiorna le righe
    setRows(
      timbrature.map((timbratura, index) => ({
        id: index + 1,
        ...timbratura,
      }))
    );
  }, [timbrature]);

  const [userFilter, setUserFilter] = useState<string | null>(null);

  const updateFilteredRows = () => {
    let filteredData = timbrature;
    console.log("UserFilter: " + userFilter);

    if (userFilter) {
      filteredData = filteredData.filter(
        (row) => row.codiceDipendente === userFilter
      );
    }
    console.log(filteredData);

    setRows(
      filteredData.map((filterRow, index) => {
        // Raggruppa le timbrature per giorno
        const timbratureDelGiorno = filteredData.filter(
          (row) => row.data === filterRow.data
        );

        let tempoDiLavoroTotale = 0;
        let errore = "";

        // Calcola il tempo di lavoro per ogni turno
        for (let i = 0; i < timbratureDelGiorno.length; i += 2) {
          const entrata = timbratureDelGiorno[i];
          const uscita = timbratureDelGiorno[i + 1];

          if (
            entrata &&
            uscita &&
            entrata.tipoOperazione === "Entrata" &&
            uscita.tipoOperazione === "Uscita"
          ) {
            const oraEntrata = parseInt(entrata.ora);
            const minutiEntrata = parseInt(entrata.minuti);

            const oraUscita = parseInt(uscita.ora);
            const minutiUscita = parseInt(uscita.minuti);

            const tempoDiLavoroInMinuti =
              (oraUscita - oraEntrata) * 60 + (minutiUscita - minutiEntrata);
            tempoDiLavoroTotale += tempoDiLavoroInMinuti;
          } else {
            if (!entrata || (entrata && entrata.tipoOperazione !== "Entrata")) {
              errore = "SENZA ENTRATA";
            } else if (
              !uscita ||
              (uscita && uscita.tipoOperazione !== "Uscita")
            ) {
              errore = "SENZA USCITA";
            }
            break;
          }
        }

        let tempoDiLavoro = errore
          ? errore
          : `${Math.floor(tempoDiLavoroTotale / 60)} ore e ${
              tempoDiLavoroTotale % 60
            } minuti`;

        return {
          id: index + 1,
          tempoDiLavoro:
            errore || filterRow.tipoOperazione === "Uscita"
              ? tempoDiLavoro
              : "",
          ...filterRow,
        };
      })
    );
  };

  const columns: GridColDef[] = [
    { field: "codiceDipendente", headerName: "Codice Dipendente", flex: 1 },
    { field: "tipoOperazione", headerName: "Tipo Operazione", flex: 1 },
    { field: "data", headerName: "Data Timbratura", flex: 1 },
    { field: "ora", headerName: "Ora", flex: 1 },
    { field: "minuti", headerName: "Minuti", flex: 1 },
  ];

  if (userFilter) {
    columns.push({
      field: "tempoDiLavoro",
      headerName: "Tempo di Lavoro",
      flex: 1,
    });
  }

  const handleDownloadExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Timbrature");

    // Aggiungi l'intestazione alla foglio Excel con stile
    columns.forEach((column, columnIndex) => {
      const cell = worksheet.getCell(1, columnIndex + 1);

      // Verifica se column ha la chiave headerName
      if (column.headerName) {
        cell.value = column.headerName;
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" },
        }; // Colore di sfondo giallo
        cell.border = { bottom: { style: "thin", color: { argb: "000000" } } }; // Bordo inferiore sottile
        cell.alignment = { vertical: "middle", horizontal: "center" }; // Allineamento al centro

        // Imposta la larghezza della colonna in base al contenuto più lungo
        const columnWidth = column.headerName.length * 2; // Puoi regolare questo fattore di moltiplicazione secondo le tue esigenze
        worksheet.getColumn(columnIndex + 1).width = columnWidth;
      }
    });

    // Aggiungi dati alle righe del foglio Excel con stile
    rows.forEach((row, rowIndex) => {
      const excelRow = worksheet.addRow(row);
      columns.forEach((column, columnIndex) => {
        const cell = excelRow.getCell(columnIndex + 1);
        cell.value = row[column.field as keyof TableRow];
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = { bottom: { style: "thin", color: { argb: "000000" } } };
      });
    });

    // Salva il foglio Excel
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        "table.xlsx"
      );
    });
  };

  const uniqueCodiciDipendente = Array.from(
    new Set(timbrature.map((row) => row.codiceDipendente))
  );

  return (
    <Paper
      elevation={3}
      style={{
        padding: "20px",
        margin: "20px",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        borderRadius: "15px",
      }}
    >
      <FormControl style={{ marginBottom: "10px" }}>
        <InputLabel id="user-filter-label">Filtro Utente</InputLabel>
        <Select
          labelId="user-filter-label"
          id="user-filter"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value as string)}
        >
          {/* Aggiungi gli utenti dalla tabella senza duplicati */}
          {uniqueCodiciDipendente.map((codiceDipendente) => (
            <MenuItem key={codiceDipendente} value={codiceDipendente}>
              {codiceDipendente}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "10px", marginBottom: "20px" }}
        onClick={() => {
          updateFilteredRows();
        }}
      >
        Applica Filtri
      </Button>

      <Button
        variant="contained"
        color="secondary"
        style={{ marginBottom: "20px" }}
        onClick={() => {
          setUserFilter(null);
          updateFilteredRows();
        }}
      >
        Rimuovi Filtri
      </Button>

      <DataGrid rows={rows} columns={columns} />

      <Button
        variant="contained"
        color="success"
        style={{ marginTop: "10px" }}
        onClick={handleDownloadExcel}
      >
        Scarica Excel
      </Button>
    </Paper>
  );
}
