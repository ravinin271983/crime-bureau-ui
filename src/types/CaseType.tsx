import EvidenceType from "./EvidenceType";
import InvestigatingOfficerType from "./InvestigatingOfficerType";
import LegalActionType from "./LegalActionType";
import SuspectType from "./SuspectType";
import VictimType from "./VictimType";

interface CaseType {
  id?: number;
  description: string;
  name: string;
  status: string;
  dateReported: Date;
  investigatingOfficer?: InvestigatingOfficerType;
  evidences?: EvidenceType[];
  suspects?: SuspectType[];
  legalAction?: LegalActionType;
  victims?: VictimType[];
}
export default CaseType;