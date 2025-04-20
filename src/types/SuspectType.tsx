import CaseType from "./CaseType";

interface SuspectType {
    id?: number;
    name: string;
    gender: string;
    address: string;
    age: string;
    crimeHistory: string;
    caseObj?: CaseType;
    caseId?: number;
}
export default SuspectType;