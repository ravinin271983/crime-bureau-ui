import React, { useState, useEffect } from 'react';
import {getCases, getVictims, saveVictim, deleteVictim} from '../services/backend-services';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';  
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import PlusIcon from '@mui/icons-material/Add';
import CaseType from '../types/CaseType';
import VictimType from '../types/VictimType';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Victim() {
  const [victims, setVictims] = useState<VictimType[]>([]);
  const [cases, setCases] = useState<CaseType[]>([]);
  useEffect(() => {
    fetchVictims();
    fetchCases();
  }, []);
  const fetchVictims = async () => {
    try {
      const data = await getVictims();
      setVictims(data);
    } catch (error) {
      console.error('Error fetching victims:', error);
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
    setCaseId('-1');
    setName('');
    setContactNo('');
    setAddress('');
    setId('-1');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [name, setName] = useState<string>('');
  const [contactNo, setContactNo] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [caseId, setCaseId] = useState<string>('-1');
  const [id, setId] = useState<string>('-1');
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleChangeContactNo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContactNo(event.target.value);
  };
  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'contactNo', headerName: 'Contact No', width: 120},
    { field: 'address', headerName: 'Address', width: 250},
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
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  const handleEdit = (row: VictimType) => {
    // Populate the form with the selected row's data for editing
    setName(row.name || '');
    setAddress(row.address || '');
    setContactNo(row.contactNo || '');
    setId(row.id?.toString() || '');
    setCaseId(row.caseId?.toString() || '');
    setOpen(true); // Open the dialog for editing
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this victim?')) {
      try {
        await deleteVictim(id); // Call the delete API (you need to implement this in your backend service)
        fetchVictims(); // Refresh the list of victims
      } catch (error) {
        console.error('Error deleting victim:', error);
      }
    }
  };
  const getCaseName = (caseId: number) => {
    const victimCase = cases.find((c) => c.id === caseId);
    if(!victimCase) return 'Not Assigned';
    return victimCase?.description;
  }
  const paginationModel = { page: 0, pageSize: 5 };
  
  return (
    <div className="App">
      <div style={{ display: 'flex'}}>
        <div style={{ flexGrow: 1}}>
          <h1>Victims</h1>
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
              const victim = {
                id: id? Number(id) : undefined,
                caseId: caseId? Number(caseId) : undefined,
                name: formJson.name,
                contactNo: formJson.contactNo,
                address: formJson.address
              }

              saveVictim(victim)
              .then((response) => {
                // console.log('response', response) 
                handleClose();
                setName('');
                setContactNo('');
                setAddress('');
                setCaseId('-1');
                setId('-1');
                fetchVictims();
              });
            },
          },
        }}
      >
        <DialogTitle>{id === '-1'?'Add Victim':'Modify Victim'}</DialogTitle>
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
            id="contactNo"
            name="contactNo"
            value={contactNo}
            onChange={handleChangeContactNo}
            label="Contact No"
            type="contactNo"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={victims}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
export default Victim; 