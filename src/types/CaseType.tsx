interface CaseType {
  id?: number;
  description: string;
  status: string;
  dateReported: Date;
  investigatingOfficerId?: (number|undefined);
  evidenceIds?: (number|undefined)[];
  suspectIds?: (number|undefined)[];
  legalActionId?: (number|undefined);
  victimIds?: (number|undefined)[];
}
export default CaseType;