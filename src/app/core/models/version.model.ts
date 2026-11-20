import { IdName } from './common.models';

export interface VersionList {
  currentVersionId: string | null;
  versions: IdName[];
}
