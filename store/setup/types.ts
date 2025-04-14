
export interface BaseOption {
  description: string;
  name: string;
  data_exists: boolean;
}

export interface DownloadOption extends BaseOption {
  rel: string;
  subdir: string | null;
}

export interface FingerPrintOption extends BaseOption {
  key: string;
}

export interface FilterOption extends BaseOption {
  key: string;
}

export interface SetupState {
  downloadArray: DownloadOption[];
  validFpArray: FingerPrintOption[];
  validFilterArray: FilterOption[];
}
