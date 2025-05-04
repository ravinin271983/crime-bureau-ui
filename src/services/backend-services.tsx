import axios from 'axios';
import CaseType from '../types/CaseType';
import InvestigatingOfficerType from '../types/InvestigatingOfficerType';
import EvidenceType from '../types/EvidenceType';
import LegalActionType from '../types/LegalActionType';
import SuspectType from '../types/SuspectType';
import VictimType from '../types/VictimType';

const getCases = () => {
    return axios.get<CaseType[]>('http://localhost:8080/cases').then((response) => {
        return response.data;
    });
}
const saveCase = (caseObj: CaseType) => {
    return axios.post<CaseType>('http://localhost:8080/cases', caseObj).then((response) => {
        return response.data;
    });
}
const deleteCase = (id: string) => {
    return axios.delete('http://localhost:8080/cases/'+id).then((response) => {
        return response.data;
    });
}
const getInvestigatingOfficers = () => {
    return axios.get<InvestigatingOfficerType[]>('http://localhost:8080/investigatingofficer').then((response) => {
        return response.data;
    });
}
const saveInvestigatingOfficer = (investigatingOfficer: InvestigatingOfficerType) => {
    return axios.post<InvestigatingOfficerType>('http://localhost:8080/investigatingofficer', investigatingOfficer).then((response) => {
        return response.data;
    });
}
const deleteInvestigatingOfficer = (id: string) => {
    return axios.delete('http://localhost:8080/investigatingofficer/'+id).then((response) => {
        return response.data;
    });
}
const getEvidences = () => {
    return axios.get<EvidenceType[]>('http://localhost:8080/evidence').then((response) => {
        return response.data;
    });
}
const saveEvidence = (evidence: EvidenceType) => {
    return axios.post<EvidenceType>('http://localhost:8080/evidence', evidence).then((response) => {
        return response.data;
    });
}
const deleteEvidence = (id: string) => {
    return axios.delete('http://localhost:8080/evidence/'+id).then((response) => {
        return response.data;
    });
}
const getLegalActions = () => {
    return axios.get<LegalActionType[]>('http://localhost:8080/legalaction').then((response) => {
        return response.data;
    });
}
const saveLegalAction = (legalAction: LegalActionType) => {
    return axios.post<LegalActionType>('http://localhost:8080/legalaction', legalAction).then((response) => {
        return response.data;
    });
}
const deleteLegalAction = (id: string) => {
    return axios.delete('http://localhost:8080/legalaction/'+id).then((response) => {
        return response.data;
    });
}
const getSuspects = () => {
    return axios.get<SuspectType[]>('http://localhost:8080/suspect').then((response) => {
        return response.data;
    });
}
const saveSuspect= (suspect: SuspectType) => {
    return axios.post<SuspectType>('http://localhost:8080/suspect', suspect).then((response) => {
        return response.data;
    });
}
const deleteSuspect = (id: string) => {
    return axios.delete('http://localhost:8080/suspect/'+id).then((response) => {
        return response.data;
    });
}
const getVictims = () => {
    return axios.get<VictimType[]>('http://localhost:8080/victim').then((response) => {
        return response.data;
    });
}
const saveVictim = (victim: VictimType) => {
    return axios.post<VictimType>('http://localhost:8080/victim', victim).then((response) => {
        return response.data;
    });
}
const deleteVictim = (id: string) => {
    return axios.delete('http://localhost:8080/victim/'+id).then((response) => {
        return response.data;
    });
}
export { getCases, saveCase, deleteCase, getInvestigatingOfficers, saveInvestigatingOfficer, deleteInvestigatingOfficer, getEvidences, saveEvidence, deleteEvidence, getLegalActions, saveLegalAction, deleteLegalAction, getSuspects, saveSuspect, deleteSuspect, getVictims, saveVictim, deleteVictim };