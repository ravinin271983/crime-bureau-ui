import CaseType from "./CaseType";

interface LegalActionType {
    id?: number;
    actionTaken: string;
    dateAction: Date;
    evidenceDetails: string;
    caseObj?: CaseType;
}
export default LegalActionType;