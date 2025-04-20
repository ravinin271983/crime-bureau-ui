import CaseType from "./CaseType";

interface EvidenceType {
    id?: number;
    evidenceType: string;
    evidenceDetails: string;
    caseObj?: CaseType;
    caseId?: number;
}
export default EvidenceType;