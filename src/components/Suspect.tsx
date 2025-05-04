import React, { useState, useEffect } from 'react';
import {getCases, getSuspects, saveSuspect, deleteSuspect} from '../services/backend-services';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';  
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import PlusIcon from '@mui/icons-material/Add';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import CaseType from '../types/CaseType';
import SuspectType from '../types/SuspectType';


function Suspect() {
  const [suspects, setSuspects] = useState<SuspectType[]>([]);
  const [cases, setCases] = useState<CaseType[]>([]);
  useEffect(() => {
    fetchSuspect();
    fetchCases();
  }, []);
  const fetchSuspect = async () => {
    try {
      const data = await getSuspects();
      setSuspects(data);
    } catch (error) {
      console.error('Error fetching Suspect:', error);
    }
  };
  const fetchCases = async () => {
    try {
      const data = await getCases();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [crimeHistory, setCrimeHistory] = useState<string>('');
  const [caseId, setCaseId] = useState<string>('-1');
  const [id, setId] = useState<string>('-1');
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleChangeGender = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };
  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };
  const handleChangeAge = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAge(event.target.value);
  };
  const handleChangeCrimeHistory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCrimeHistory(event.target.value);
  };
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'age', headerName: 'Age', width: 120},
    { field: 'gender', headerName: 'Gender', width: 120},
    { field: 'address', headerName: 'Address', width: 250},
    { field: 'crimeHistory', headerName: 'Crime History', width: 250},
    { field: 'caseId',
        headerName: 'Case',
        width: 160,
        valueGetter: (caseId: number) => getCaseName(caseId),
    },{
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 10 }}
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
  const handleEdit = (row: SuspectType) => {
      // Populate the form with the selected row's data for editing
      setName(row.name || '');
      setGender (row.gender);
      setAddress(row.address || '');
      setAge(row.age || '');
      setCrimeHistory(row.crimeHistory || '');
      setId(row.id?.toString() || '');
      if (row.caseId) {
        setCaseId(row.caseId?.toString() || '');
      }
      setOpen(true); // Open the dialog for editing
    };
    const handleDelete = async (id: string) => {
      if (window.confirm('Are you sure you want to delete this case?')) {
        try {
          await deleteSuspect(id); // Call the delete API (you need to implement this in your backend service)
          fetchSuspect(); // Refresh the list of cases
        } catch (error) {
          console.error('Error deleting case:', error);
        }
      }
    };
  const getCaseName = (caseId: number) => {
    console.log('caseId', caseId)
    const suspectCase = cases.find((c) => c.id === caseId);
    if(!suspectCase) return 'Not Assigned';
    return suspectCase?.description;
  }
  const paginationModel = { page: 0, pageSize: 5 };
  
  return (
    <div className="App">
      <div style={{ display: 'flex'}}>
        <div style={{ flexGrow: 1}}>
          <h1>Suspects</h1>
        </div>
        <div style={{ flexGrow: 0, marginTop: 15, marginRight: 15}}>
          <IconButton color="primary" onClick={handleClickOpen}>
            <PlusIcon />
          </IconButton>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const suspect = {
                id: id? Number(id) : undefined,
                caseId: caseId? Number(caseId) : undefined,
                name: formJson.name,
                gender: formJson.gender,
                address: formJson.address,
                age: formJson.age,
                crimeHistory: formJson.crimeHistory
              }

              saveSuspect(suspect)
              .then((response) => {
                console.log('response', response) 
                handleClose();
                setName('');
                setGender('');
                setAge('');
                setAddress('');
                setCrimeHistory('');
                setCaseId('-1');
                setId('-1');
                fetchSuspect();
              });
            },
          },
        }}
      >
        <DialogTitle>{!id || id==='-1'?'Add Suspect':'Modify Suspect'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            id="name"
            name="name"
            value={name}
            onChange={handleChangeName}
            label="Name"
            type="name"
            fullWidth
            variant="standard"
            style={{ marginBottom: 15 }}
          />
          <TextField
            id="gender"
            name="gender"
            value={gender}
            onChange={handleChangeGender}
            label="Gender"
            type="gender"
            fullWidth
            variant="standard"
            style={{ marginBottom: 15 }}
          />
          <TextField
            id="age"
            name="age"
            value={age}
            onChange={handleChangeAge}
            label="Age"
            type="age"
            fullWidth
            variant="standard"
            style={{ marginBottom: 15 }}
          />
          <TextField
            id="address"
            name="address"
            value={address}
            onChange={handleChangeAddress}
            label="Address"
            type="address"
            fullWidth
            multiline
            variant="standard"
            style={{ marginBottom: 15 }}
          />
          <TextField
            id="crimeHistory"
            name="crimeHistory"
            value={crimeHistory}
            onChange={handleChangeCrimeHistory}
            label="Crime History"
            type="crimeHistory"
            fullWidth
            multiline
            variant="standard"
            style={{ marginBottom: 15 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={suspects}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
export default Suspect; 