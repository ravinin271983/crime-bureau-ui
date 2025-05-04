import React, { useState, useEffect } from 'react';
import {getCases, getEvidences, saveEvidence, deleteEvidence} from '../services/backend-services';
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
import EvidenceType from '../types/EvidenceType';
import CaseType from '../types/CaseType';



function Evidence() {
  const [evidences, setEvidences] = useState<EvidenceType[]>([]);
  const [cases, setCases] = useState<CaseType[]>([]);
  useEffect(() => {
    fetchEvidences();
    fetchCases();
  }, []);
  const fetchEvidences = async () => {
    try {
      const data = await getEvidences();
      setEvidences(data);
    } catch (error) {
      console.error('Error fetching evidences:', error);
    }
  };
  const fetchCases = async () => {
    try {
      const data = await getCases();
      setCases(data);
    } catch (error) {
      console.error('Error fetching evidences:', error);
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [evidenceType, setEvidenceType] = useState<string>('');
  const [evidenceDetails, setEvidenceDetails] = useState<string>('');
  const [caseId, setCaseId] = useState<string>('');
  const [id, setId] = useState<string>('');
  const handleChangeEvidenceType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEvidenceType(event.target.value);
  };
  const handleChangeEvidenceDetails = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEvidenceDetails(event.target.value);
  };
  const columns: GridColDef[] = [
    { field: 'evidenceType', headerName: 'Evidence Type', width: 130 },
    { field: 'evidenceDetails', headerName: 'Evidence Details', width: 250},
    { field: 'caseId',
        headerName: 'Case',
        width: 160,
        valueGetter: (caseId: number) => getCaseName(caseId),
      },
      {
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
  const getCaseName = (caseId: number) => {
    // console.log('caseId', caseId)
    if(!caseId ) return 'Not Assigned'; 
    return cases.find((caseObj) => caseObj.id === caseId)?.description || 'Not Assigned';
  }
  const paginationModel = { page: 0, pageSize: 5 };
  const handleEdit = (row: EvidenceType) => {
      // Populate the form with the selected row's data for editing
      console.log('handleEdit::row', row)
      setEvidenceType(row.evidenceType || '');
      setEvidenceDetails(row.evidenceDetails || '');
      setCaseId(row.caseId?.toString() || '');
      setId(row.id?.toString() || '');
      setOpen(true); // Open the dialog for editing
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this evidence?')) {
      try {
        await deleteEvidence(id); // Call the delete API (implement this in your backend service)
        fetchEvidences(); // Refresh the list of evidences
      } catch (error) {
        console.error('Error deleting evidence:', error);
      }
    }
  };
  return (
    <div className="App">
      <div style={{ display: 'flex'}}>
        <div style={{ flexGrow: 1}}>
          <h1>Evidences</h1>
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
              const evidence = {
                id: id? Number(id) : undefined,
                caseId: caseId? Number(caseId) : undefined,
                evidenceType: formJson.evidenceType,
                evidenceDetails: formJson.evidenceDetails
              }
              saveEvidence(evidence)
              .then((response) => {
                console.log('response', response) 
                handleClose();
                setEvidenceDetails('');
                setEvidenceType('');
                fetchEvidences();
              });
            },
          },
        }}
      >
        <DialogTitle>Add Evidence</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            id="evidenceType"
            name="evidenceType"
            value={evidenceType}
            onChange={handleChangeEvidenceType}
            label="Evidence Type"
            type="evidenceType"
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
            type="contact"
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
          rows={evidences}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
export default Evidence; 