'use client';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Grid, Paper, TextField, Button, Typography, Box } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TimbraturaParser from '../calculator/parser';
import { Timbratura } from '../calculator/timbratura';

interface UploadProps {
  setTimbrature: Dispatch<SetStateAction<Timbratura[]>>;
}

const Upload = ({ setTimbrature, }: UploadProps) => {
  const [fileContent, setFileContent] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: any[]) => {
    const isTextFile = acceptedFiles.every(file => file.type === 'text/plain');
    if (!isTextFile) {
      console.error('Sono consentiti solo file di testo (.txt)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const content = reader.result as string;
      setFileContent(content);

      const parsedTimbrature = await TimbraturaParser.parseFileContent(content);
      setTimbrature(parsedTimbrature);
    };
    reader.readAsText(acceptedFiles[0]);
  }, [setTimbrature]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop
  });

  const handleTextFieldChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFileContent = event.target.value;
    setFileContent(newFileContent);

    const parsedTimbrature = await TimbraturaParser.parseFileContent(newFileContent);
    setTimbrature(parsedTimbrature);
  };

  return (
    <Paper
      elevation={3}
      style={{
        padding: '20px',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        borderRadius: '15px',
      }}
    >
      <Box
        {...getRootProps()}
        style={{
          width: '100%',
          height: '10vh',
          border: '1px grey dashed',
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        mx="auto"
        my={2}
      >
        <CloudUploadIcon style={{ fontSize: 34, marginTop: '10px' }} />
        <Typography variant="body2" color="textSecondary" m={1}>
          Rilascia qui il file di testo o clicca per selezionare un file (.txt)
        </Typography>
      </Box>
      <input {...getInputProps()} />
      <TextField
        label="Inserisci i codici manualmente..."
        fullWidth
        variant="outlined"
        multiline
        rows={10}
        placeholder="Inserisci il testo qui..."
        style={{ marginTop: '20px' }}
        value={fileContent}
        autoFocus
        onChange={handleTextFieldChange}
      />
    </Paper>
  );
}

export default Upload;
