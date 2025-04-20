import React, { useState, useEffect } from 'react';
import {getCases, getSuspects, saveSuspect} from '../services/backend-services';
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

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'age', headerName: 'Age', width: 120},
  { field: 'gender', headerName: 'Gender', width: 120},
  { field: 'address', headerName: 'Address', width: 250},
  { field: 'crimeHistory', headerName: 'Crime History', width: 250},
  { field: 'caseObj',
      headerName: 'Case',
      width: 160,
      valueGetter: (row: SuspectType) => getCaseName(row),
    },
];
const getCaseName = (row: SuspectType) => {
  console.log('row', row)
  if(!row || !row.caseObj) return 'Not Assigned'; 
  return row.caseObj?.description;
}
const paginationModel = { page: 0, pageSize: 5 };

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

  const [caseObj, setCaseObj] = useState<CaseType>({} as CaseType);
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
  const handleChangeCaseObj = (event: SelectChangeEvent) => {
    const selectedCase = cases.find((caseObj) => caseObj.id === Number(event.target.value));
    if (selectedCase)
      setCaseObj(selectedCase);
  };
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
                setCaseObj({} as CaseType);
                fetchSuspect();
              });
            },
          },
        }}
      >
        <DialogTitle>Add Suspect</DialogTitle>
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
          <InputLabel id="case-label">Case</InputLabel>
          <Select
            labelId="case-label"
            id="caseObj"
            name="caseObj"
            value={caseObj?.id?.toString()}
            label="Case"
            fullWidth
            onChange={handleChangeCaseObj}
            style={{ marginBottom: 15 }}
          >
            {
              // Map through the cases and create a MenuItem for each one
              cases.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))
            }
          </Select>
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
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
export default Suspect; 