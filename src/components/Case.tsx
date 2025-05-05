import React, { useState, useEffect } from 'react';
import {getCases, saveCase, deleteCase, getInvestigatingOfficers, getEvidences, getSuspects, getVictims} from '../services/backend-services';
import CaseType from '../types/CaseType';
import InvestigatingOfficerType from '../types/InvestigatingOfficerType';
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
import EvidenceType from '../types/EvidenceType';
import SuspectType from '../types/SuspectType';
import VictimType from '../types/VictimType';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
function Case() {
  const [cases, setCases] = useState<CaseType[]>([]);
  const [investigatingOfficers, setInvestigatingOfficers] = useState<InvestigatingOfficerType[]>([]);
  const [evidences, setEvidences] = useState<EvidenceType[]>([]);
  const [suspects, setSuspects] = useState<SuspectType[]>([]);
  const [victims, setVictims] = useState<VictimType[]>([]);

  useEffect(() => {
    fetchCases();
    fetchInvestigatingOfficers();
    fetchEvidences();
    fetchSuspects();
    fetchVictims();

  }, []);
  const fetchCases = async () => {
    try {
      const data = await getCases();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };
  const fetchInvestigatingOfficers = async () => {
    try {
      const data = await getInvestigatingOfficers();
      setInvestigatingOfficers(data);
    } catch (error) {
      console.error('Error fetching investingating officers:', error);
    }
  };
  const fetchEvidences = async () => {
    try {
      const data = await getEvidences();
      setEvidences(data);
    } catch (error) {
      console.error('Error fetching evidences:', error);
    }
  };
  const fetchSuspects = async () => {
    try {
      const data = await getSuspects();
      setSuspects(data);
    } catch (error) {
      console.error('Error fetching suspects:', error);
    }
  };
  const fetchVictims = async () => {
    try {
      const data = await getVictims();
      setVictims(data);
    } catch (error) {
      console.error('Error fetching victims:', error);
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setDescription('');
    setInvestigatingOfficerId('-1');
    setSelectedEvidences([]);
    setSelectedVictims([]);
    setSelectedSuspects([]);
    setCaseId('-1');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [caseId, setCaseId] = useState<string>('-1');
  const [description, setDescription] = useState<string>('');
  const [investigatingOfficerId, setInvestigatingOfficerId] = useState<string>('-1');
  const [selectedEvidences, setSelectedEvidences] = useState<string[]>([]);
  const [selectedVictims, setSelectedVictims] = useState<string[]>([]);
  const [selectedSuspects, setSelectedSuspects] = useState<string[]>([]);
  const handleChangeSelectedEvidences = (event: SelectChangeEvent<string[]>) => {
    const selectedEvidenceId = event.target.value;
    // console.log('handleChangeSelectedEvidences::selectedEvidenceId', selectedEvidenceId);    
    typeof selectedEvidenceId === 'string' ? setSelectedEvidences([selectedEvidenceId]) : setSelectedEvidences(selectedEvidenceId);
  };
  const handleChangeSelectedVictims = (event: SelectChangeEvent<string[]>) => {
    const selectedVictimId = event.target.value;
    typeof selectedVictimId === 'string' ? setSelectedVictims([selectedVictimId]) : setSelectedVictims(selectedVictimId);
    //console.log('selectedVictimId', selectedVictimId);
  };
  const handleChangeSelectedSuspects = (event: SelectChangeEvent<string[]>) => {
    const selectedSuspectId = event.target.value;
    // console.log('selectedSuspectId', selectedSuspectId);
    typeof selectedSuspectId === 'string' ? setSelectedSuspects([selectedSuspectId]) : setSelectedSuspects(selectedSuspectId);
    
  };
  const handleChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const handleChangeInvestigatingOfficerId = (event: SelectChangeEvent) => {
    setInvestigatingOfficerId(event.target.value);
  };
  const isCheckedEvidence = (evidenceType: string) => {
    // console.log('isCheckedEvidence::selectedEvidences', selectedEvidences, 'evidenceType', evidenceType);
    if(!selectedEvidences || selectedEvidences.length === 0) return false;
    return selectedEvidences.filter(e => e.toString() === evidenceType).length > 0; 
  }
  const isCheckedVictim = (name: string) => {
    // console.log('selectedVictims', selectedVictims, 'name', name);
    if(!selectedVictims || selectedVictims.length === 0) return false;
    return selectedVictims.filter(e => e.toString() === name).length > 0; 
  }
  const isCheckedSuspect = (name: string) => {
    // console.log('selectedSuspects', selectedSuspects, 'name', name);
    if(!selectedSuspects || selectedSuspects.length === 0) return false;
    return selectedSuspects.filter(e => e.toString() === name).length > 0; 
  }
  const columns: GridColDef[] = [
    { field: 'description', headerName: 'Description', width: 130 },
    { field: 'status', headerName: 'Status', width: 90},
    { field: 'dateReported', headerName: 'Date Reported', width: 120, valueGetter: (value) => new Date(value).toLocaleDateString() },
    { field: 'investigatingOfficerId',
      headerName: 'Investigating Officer',
      width: 160,
      valueGetter: (investigatingOfficerId: number) => getOfficerName(investigatingOfficerId),
    },
    { field: 'evidenceIds',
      headerName: 'Evidences',
      width: 160,
      valueGetter: (evidenceIds: number[]) => getEvidencesType(evidenceIds),
    },
    { field: 'suspectIds',
      headerName: 'Suspects',
      width: 160,
      valueGetter: (suspectIds: number[]) => getSuspectType(suspectIds),
    },
    { field: 'victimIds',
      headerName: 'Victims',
      width: 160,
      valueGetter: (victimIds: number[]) => getVictimType(victimIds),
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
  const handleEdit = (row: CaseType) => {
    // Populate the form with the selected row's data for editing
    setDescription(row.description || '');
    setInvestigatingOfficerId(row.investigatingOfficerId?.toString() || '-1');
    setSelectedEvidences(row.evidenceIds?.map((eId) => eId?.toString() || '') || []);
    setSelectedVictims(row.victimIds?.map((vId) => vId?.toString() || '') || []);
    setSelectedSuspects(row.suspectIds?.map((sId) => sId?.toString() || '') || []);
    setCaseId(row.id?.toString() || '');
    setOpen(true); // Open the dialog for editing
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await deleteCase(id); // Call the delete API (you need to implement this in your backend service)
        fetchCases(); // Refresh the list of cases
      } catch (error) {
        console.error('Error deleting case:', error);
      }
    }
  };
  const paginationModel = { page: 0, pageSize: 5 };
  const getOfficerName = (investigatingOfficerId: number) => {
    // console.log('getOfficerName:investigatingOfficerId', investigatingOfficerId, 'investigatingOfficers', investigatingOfficers)
    const officer = investigatingOfficers.find((officer) => officer.id === investigatingOfficerId);
    // console.log('getOfficerName:officer', officer)
    if(!officer) return 'Not Assigned';
    return officer.name;
  }
  const getEvidencesType = (evidenceIds: number[]) => {
    // console.log('getEvidencesType:evidenceIds', evidenceIds)
    if (!evidenceIds || evidenceIds.length ===0 ) return 'Not Assigned';
    const caseEvidences = cases.find(c => c.evidenceIds?.find(eId => eId === evidenceIds[0]) !== undefined)?.evidenceIds?.map(eId => evidences.find(e => e.id === eId)).filter(e => e !== undefined) as EvidenceType[];
    if (!caseEvidences || caseEvidences.length ===0 ) return 'Not Assigned';
    return caseEvidences.map(e => e.evidenceDetails).join(', ');
  }
  const getSuspectType = (suspectIds: number[]) => {
    //console.log('getEvidencesType:row', row)
    if (!suspectIds || suspectIds.length ===0 ) return 'Not Assigned';
    const caseSuspects = suspectIds.map(sId => suspects.find(s => s.id === sId)).filter(e => e !== undefined) as SuspectType[];
    if (!caseSuspects || caseSuspects.length ===0 ) return 'Not Assigned';
    return caseSuspects.map(s => s.name).join(', ');
  }
  const getVictimType = (victimIds: number[]) => {
    //console.log('getEvidencesType:row', row)
    if (!victimIds || victimIds.length ===0 ) return 'Not Assigned';
    const caseVictims = victimIds.map(vId => victims.find(v => v.id === vId)).filter(e => e !== undefined) as VictimType[];
    if (!caseVictims || caseVictims.length ===0 ) return 'Not Assigned';
    return caseVictims.map(v => v.name).join(', ');
  }
  return (
      <div className="App">
        <div style={{ display: 'flex'}}>
          <div style={{ flexGrow: 1}}>
            <h1>Case</h1>
          </div>
          <div style={{ flexGrow: 0, marginTop: 15, marginRight: 15}}>
            <IconButton color="primary" onClick={handleClickOpen}>
              <PlusIcon />
            </IconButton>
          </div>
        </div>
        <Dialog
          open={open}
          fullWidth
          maxWidth="md"
          onClose={handleClose}
          slotProps={{
            paper: {
              component: 'form',
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries((formData as any).entries());
                const filteredEvidences = evidences.filter(e => selectedEvidences.find(eId => eId.toString() === e.id?.toString()) !== undefined).map(e => e.id);
                const filteredInvestigatingOfficer = investigatingOfficers.filter(i => i.id?.toString() === investigatingOfficerId.toString ());
                const filteredSuspects = suspects.filter(s => selectedSuspects.find(sId => sId.toString() === s.id?.toString()) !== undefined).map(s => s.id);
                const filteredVictims = victims.filter(v => selectedVictims.find(vId => vId.toString() === v.id?.toString()) !== undefined).map(v => v.id);
                const caseObj = {
                  id: caseId?Number(caseId):undefined,
                  description: formJson.description,
                  investigatingOfficerId: filteredInvestigatingOfficer && filteredInvestigatingOfficer.length > 0 ? filteredInvestigatingOfficer[0].id : undefined,
                  suspectIds: filteredSuspects,
                  victimIds: filteredVictims,
                  status: 'OPEN',
                  dateReported: new Date(),
                  evidenceIds: filteredEvidences,
                  legalAction: undefined,
                };
                // console.log('caseObj', caseObj);
                saveCase(caseObj)
                  .then((response) => {
                    handleClose();
                    setDescription('');
                    setInvestigatingOfficerId('-1');
                    setSelectedEvidences([]);
                    fetchCases();
                  })
                  .catch((error) => {
                    console.error('Error saving case:', error);
                  });
                handleClose();
              },
            },
          }}
        >
          <DialogTitle>{!caseId || caseId==='-1'?'Add Case':'Modify Case'}</DialogTitle>
          <DialogContent>
            <TextField
              id="description"
              name="description"
              value={description}
              onChange={handleChangeDescription}
              label="Description"
              type="description"
              multiline
              fullWidth
              rows={4}
              defaultValue="Case description"
              style={{ marginBottom: 15, marginTop: 15 }}
            />
            <InputLabel id="investigatingOfficerId-label">Investigating Officer</InputLabel>
            <Select
              labelId="investigatingOfficerId-label"
              id="investigatingOfficerId"
              name="investigatingOfficerId"
              value={investigatingOfficerId}
              label="Investigating Officer"
              fullWidth
              onChange={handleChangeInvestigatingOfficerId}
              style={{ marginBottom: 15 }}
            >
              {
                // Map through the investigating officers and create a MenuItem for each one
                investigatingOfficers.map((officer) => (
                  <MenuItem key={officer.id} value={officer.id}>
                    {officer.name}
                  </MenuItem>
                ))
              }
            </Select>
            <InputLabel id="evidence-label">Evidences</InputLabel>
            <Select
              labelId="evidence-label"
              id="selectedEvidences"
              name="selectedEvidences"
              multiple
              value={selectedEvidences}
              renderValue={(selected) => {
                const selectedEvidenceIds = selected.map(e => e.toString());
                const selectedEvidences = evidences.filter(e => {
                  return selectedEvidenceIds.indexOf(e.id?e.id.toString():'') > -1
                });
                return selectedEvidences.map(e => e.evidenceDetails).join(', ');
              }}
              label="Evidences"
              fullWidth
              onChange={handleChangeSelectedEvidences}
              style={{ marginBottom: 15 }}
            >
              {
                // Map through the investigating officers and create a MenuItem for each one
                evidences.filter(e => e.caseObj === undefined).map((evidence) => (
                  <MenuItem key={evidence.id} value={evidence.id?.toString()}>
                    <Checkbox checked={evidence.id?isCheckedEvidence(evidence.id.toString()):false} />
                    <ListItemText primary={evidence.evidenceDetails} />
                  </MenuItem>
                ))
              }
            </Select>
            <InputLabel id="victims-label">Victims</InputLabel>
            <Select
              labelId="victims-label"
              id="selectedVictims"
              name="selectedVictims"
              multiple
              value={selectedVictims}
              renderValue={(selected) => {
                const selectedVictimIds = selected.map(v => v.toString());
                const selectedVictims = victims.filter(v => {
                  return selectedVictimIds.indexOf(v.id?v.id.toString():'') > -1
                });
                //console.log('victimRenderValue::selectedVictimIds', selectedVictimIds, 'selectedVictims', selectedVictims);
                return selectedVictims.map(v => v.name).join(', ');
              }}

              label="Victims"
              fullWidth
              onChange={handleChangeSelectedVictims}
              style={{ marginBottom: 15 }}
            >
              {
                // Map through the victims and create a MenuItem for each one
                victims.map((victim) => (
                  <MenuItem key={victim.id} value={victim.id}>
                    <Checkbox checked={victim.id?isCheckedVictim(victim.id.toString()):false} />
                    <ListItemText primary={victim.name} />
                  </MenuItem>
                ))
              }
            </Select>
            <InputLabel id="suspects-label">Suspects</InputLabel>
            <Select
              labelId="suspects-label"
              id="selectedSuspects"
              name="selectedSuspects"
              multiple
              value={selectedSuspects}
              renderValue={(selected) => {
                const selectedSuspectIds = selected.map(v => v.toString());
                const selectedSuspects = suspects.filter(v => {
                  return selectedSuspectIds.indexOf(v.id?v.id.toString():'') > -1
                });
                //console.log('victimRenderValue::selectedVictimIds', selectedVictimIds, 'selectedVictims', selectedVictims);
                return selectedSuspects.map(v => v.name).join(', ');
              }}
              label="Suspects"
              fullWidth
              onChange={handleChangeSelectedSuspects}
              style={{ marginBottom: 15 }}
            >
              {
                // Map through the victims and create a MenuItem for each one
                suspects.map((suspect) => (
                  <MenuItem key={suspect.id?.toString()} value={suspect.id?.toString()}>
                    <Checkbox checked={suspect.id?isCheckedSuspect(suspect.id.toString()):false} />
                    <ListItemText primary={suspect.name} />
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
            rows={cases}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </Paper>
      </div>
    );
  }
  export default Case;  