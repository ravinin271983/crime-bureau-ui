import React, { useState, useEffect } from 'react';
import {getCases, getLegalActions, saveCase, saveLegalAction} from '../services/backend-services';
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
      console.log('cases', data)
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const columns: GridColDef[] = [
    { field: 'actionTaken', headerName: 'Action Taken', width: 250 },
    { field: 'dateAction', headerName: 'Date Action', width: 180, valueGetter: (dateAction: number) => getDateAction(dateAction),},
    { field: 'evidenceDetails', headerName: 'Evidence Details', width: 250},
    { field: 'id',
        headerName: 'Case',
        width: 160,
        valueGetter: (legalActionId: number) => getCaseName(legalActionId),
      },
  ];
  
  const getDateAction = (dateAction: number) => {
    const timestamp = new Date(Number(dateAction));
    console.log('getDateAction::timestamp', timestamp)
    if(!timestamp) return 'Not Available'; 
    return timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
  }
  const getCaseName = (legalActionId: number) => {
    const assignedCase = cases.find((c) => c.legalAction?.id === legalActionId);
    if(!assignedCase || !assignedCase.description) return 'Not Available'; 
    return assignedCase.description;
  }
  const handleClose = () => {
    setOpen(false);
  };
  const [actionTaken, setActionTaken] = useState<string>('');
  const [evidenceDetails, setEvidenceDetails] = useState<string>('');
  const [caseObj, setCaseObj] = useState<CaseType>({} as CaseType);
  const [caseId, setCaseId] = useState<string>('-1');
  const handleChangeActionTaken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActionTaken(event.target.value);
  };
  const handleChangeEvidenceDetails = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEvidenceDetails(event.target.value);
  };
  const handleChangeCaseObj = (event: SelectChangeEvent) => {
    console.log('cases', cases, 'event.target.value', event.target.value)
    const selectedCase = cases.find((c) => c.id === Number(event.target.value));
    setCaseId(event.target.value);
    console.log('selectedCase', selectedCase)
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
              const filteredCases = cases.filter((c) => c.id === Number(caseId));
              console.log('filteredCases', filteredCases)
              const legalAction = {
                actionTaken: formJson.actionTaken,
                dateAction: new Date(),
                evidenceDetails: formJson.evidenceDetails,
                caseObj: filteredCases.length > 0 ? filteredCases[0] : undefined,
              }

              saveLegalAction(legalAction)
              .then((response) => {
                console.log('response', response) 
                handleClose();
                setActionTaken('');
                setEvidenceDetails('');
                const caseObjSave = {...caseObj, legalAction: response}
                console.log('caseObjSave', caseObjSave)
                saveCase(caseObjSave)
                .then((caseResponse) => {
                  console.log('caseResponse', caseResponse) 
                  fetchCases();
                })
                setCaseObj({} as CaseType);
                fetchLegalActions();
              });
            },
          },
        }}
      >
        <DialogTitle>Add Legal Action</DialogTitle>
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
          <TextField
            id="evidenceDetails"
            name="evidenceDetails"
            value={evidenceDetails}
            onChange={handleChangeEvidenceDetails}
            label="Evidence Details"
            type="evidenceDetails"
            fullWidth
            variant="standard"
            style={{ marginBottom: 15 }}
          />
          <InputLabel id="case-label">Case</InputLabel>
          <Select
            labelId="case-label"
            id="caseId"
            name="caseId"
            value={caseId}
            label="Case"
            fullWidth
            onChange={handleChangeCaseObj}
            style={{ marginBottom: 15 }}
          >
            {
              // Map through the cases and create a MenuItem for each one
              cases && cases.length > 0 &&
              cases.map((c) => (
                <MenuItem key={c.id} value={c.id}>
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
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
export default LegalAction; 