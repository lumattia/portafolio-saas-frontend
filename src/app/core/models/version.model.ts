import { IdName } from "./common.models";

export interface VersionList {
  currentVersionNumber: number | null;
  versions: IdName<number>[];
}
