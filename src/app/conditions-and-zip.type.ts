import { CurrentConditions } from './current-conditions/current-conditions.type';

export type ZipCode = string;
export interface ConditionsAndZip {
  zip: ZipCode;
  data: CurrentConditions;
}
