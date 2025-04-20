import React, { useState, useEffect } from 'react';
import InvestigatingOfficerType from '../types/InvestigatingOfficerType';
import {getInvestigatingOfficers, saveInvestigatingOfficer} from '../services/backend-services';
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

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'contact', headerName: 'Contact', width: 120},
  { field: 'role', headerName: 'role', width: 150},
  { field: 'dept', headerName: 'Department', width: 160},];
const paginationModel = { page: 0, pageSize: 5 };

function InvestigatingOfficer() {
  const [investigatingOfficers, setInvestigatingOfficers] = useState<InvestigatingOfficerType[]>([]);
  useEffect(() => {
    fetchInvestigatingOfficers();
  }, []);
  const fetchInvestigatingOfficers = async () => {
    try {
      const data = await getInvestigatingOfficers();
      setInvestigatingOfficers(data);
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
  const [contact, setContact] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [dept, setDept] = useState<string>('');
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleChangeContact = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContact(event.target.value);
  };
  const handleChangeDept = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDept(event.target.value as string);
  };
    
  const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value as string);
  };
  return (
      <div className="App">
        <div style={{ display: 'flex'}}>
          <div style={{ flexGrow: 1}}>
            <h1>Investigating Officers</h1>
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
                const officer = {
                  name: formJson.name,
                  contact: formJson.contact,
                  role: formJson.role,
                  dept: formJson.dept
                }
                saveInvestigatingOfficer(officer)
                .then((response) => {
                  console.log('response', response) 
                  handleClose();
                  setName('');
                  setContact('');
                  setRole('');
                  setDept('');
                  fetchInvestigatingOfficers();
                });
              },
            },
          }}
        >
          <DialogTitle>Add Investigating Officer</DialogTitle>
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
              id="contact"
              name="contact"
              value={contact}
              onChange={handleChangeContact}
              label="Contact"
              type="contact"
              fullWidth
              variant="standard"
              style={{ marginBottom: 15 }}
            />
            <TextField
              id="role"
              name="role"
              value={role}
              onChange={handleChangeRole}
              label="Role"
              type="role"
              fullWidth
              variant="standard"
              style={{ marginBottom: 15 }}
            />
            <TextField
              id="dept"
              name="dept"
              value={dept}
              onChange={handleChangeDept}
              label="Dept"
              type="dept"
              fullWidth
              variant="standard"
              style={{ marginBottom: 15 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Register</Button>
          </DialogActions>
        </Dialog>
        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={investigatingOfficers}
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
  export default InvestigatingOfficer;  