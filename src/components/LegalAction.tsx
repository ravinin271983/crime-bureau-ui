import React, { useState, useEffect } from 'react';
import {getCases, getLegalActions, saveCase, saveLegalAction, deleteLegalAction} from '../services/backend-services';
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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import CaseType from '../types/CaseType';
import LegalActionType from '../types/LegalActionType';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const paginationModel = { page: 0, pageSize: 5 };

function LegalAction() {
  const [legalActions, setLegalActions] = useState<LegalActionType[]>([]);
  const [cases, setCases] = useState<CaseType[]>([]);
  useEffect(() => {
    fetchLegalActions();
    fetchCases();
  }, []);
  const fetchLegalActions = async () => {
    try {
      const data = await getLegalActions();
      setLegalActions(data);
    } catch (error) {
      console.error('Error fetching LegalActions:', error);
    }
  };
  const fetchCases = async () => {
    try {
      const data = await getCases();
      setCases(data);
      // console.log('cases', data)
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setActionTaken('');
    setId('');
    setCaseId('-1');
    setCaseObj({} as CaseType);
    setOpen(true);
  };
  const columns: GridColDef[] = [
    { field: 'actionTaken', headerName: 'Action Taken', width: 250 },
    { field: 'dateAction', headerName: 'Date Action', width: 180, valueGetter: (dateAction: number) => getDateAction(dateAction),},
    { field: 'id',
      headerName: 'Case',
      width: 160,
      valueGetter: (legalActionId: number) => getCaseName(legalActionId),
    }, {
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
  const handleEdit = (row: LegalActionType) => {
    // Populate the form with the selected row's data for editing
    setActionTaken(row.actionTaken);
    setId(row.id?.toString() || '');
    const mappedCase = cases.find((c) => c.legalActionId === row.id);
    if (mappedCase) {
      setCaseId(mappedCase.id?.toString() || '');
      setCaseObj(mappedCase);
    }
    setOpen(true); // Open the dialog for editing
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await deleteLegalAction(id); // Call the delete API (you need to implement this in your backend service)
        fetchLegalActions(); // Refresh the list of cases
      } catch (error) {
        console.error('Error deleting case:', error);
      }
    }
  };
  const getDateAction = (dateAction: number) => {
    const timestamp = new Date(Number(dateAction));
    // console.log('getDateAction::timestamp', timestamp)
    if(!timestamp) return 'Not Available'; 
    return timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
  }
  const getCaseName = (legalActionId: number) => {
    const assignedCase = cases.find((c) => c.legalActionId === legalActionId);
    if(!assignedCase || !assignedCase.description) return 'Not Available'; 
    return assignedCase.description;
  }
  const handleClose = () => {
    setOpen(false);
  };
  const [actionTaken, setActionTaken] = useState<string>('');
  const [caseObj, setCaseObj] = useState<CaseType>({} as CaseType);
  const [caseId, setCaseId] = useState<string>('-1');
  const [id, setId] = useState<string>('-1');
  const handleChangeActionTaken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActionTaken(event.target.value);
  };
  const handleChangeCaseObj = (event: SelectChangeEvent) => {
    // console.log('cases', cases, 'event.target.value', event.target.value)
    const selectedCase = cases.find((c) => c.id === Number(event.target.value));
    setCaseId(event.target.value);
    // console.log('selectedCase', selectedCase)
    if (selectedCase) {
      setCaseId(selectedCase.id?.toString() || '');
      setCaseObj(selectedCase);
    }
  };
  return (
    <div className="App">
      <div style={{ display: 'flex'}}>
        <div style={{ flexGrow: 1}}>
          <h1>Legal Actions</h1>
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
              // console.log('filteredCases', filteredCases)
              const legalAction = {
                id: id? Number(id) : undefined,
                caseId: caseId?caseId : undefined,
                actionTaken: formJson.actionTaken,
                dateAction: new Date(),
              }

              saveLegalAction(legalAction)
              .then((response) => {
                // console.log('response', response) 
                handleClose();
                setActionTaken('');
                fetchLegalActions();
                fetchCases();
              });
            },
          },
        }}
      >
        <DialogTitle>{!id || id === '-1'?'Add Legal Action':'Modify Legal Action'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            id="actionTaken"
            name="actionTaken"
            value={actionTaken}
            onChange={handleChangeActionTaken}
            label="Action Taken"
            type="actionTaken"
            fullWidth
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
              // Map through the investigating officers and create a MenuItem for each one
              cases.map((c) => (
                <MenuItem key={c.id?.toString()} value={c.id?.toString()}>
                  {c.description}
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
          rows={legalActions}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 25]}
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
export default LegalAction; 