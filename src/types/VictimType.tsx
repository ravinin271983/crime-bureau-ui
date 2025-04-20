import CaseType from "./CaseType";

interface VictimType {
    id?: number;
    name: string;
    contactNo: Date;
    address: string;
    caseObj?: CaseType;
    caseId?: number;
}
export default VictimType;