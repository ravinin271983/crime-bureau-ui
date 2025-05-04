import CaseType from "./CaseType";

interface LegalActionType {
    id?: number;
    actionTaken: string;
    dateAction: Date;
    caseObj?: CaseType;
}
export default LegalActionType;