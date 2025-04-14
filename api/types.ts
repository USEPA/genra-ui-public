import type {
  BaseOption, DownloadOption, FilterOption,
} from '~/store/setup/types'


export interface NeighborByOption extends BaseOption {
  key: string;
}

export interface GraphType extends BaseOption {
  key: string;
}

export interface HelpText {
  helpPosition: string;
  iconType: string;
  helpTextId: string;
  helpText: string;
}

export interface FingerPrintColor {
  [key: string]: string;
}

export interface SetupResponse {
  dsstox_sid: string;
  dsstox_cid: string;
  casrn: string;
  mol_weight: number;
  name: string;
  smiles: string;
  chem_id: string;
  hybrid_fp_max: number;
  fp_needs_gen: Array<any>;
  neighbor_by: NeighborByOption[];
  help_text: HelpText[];
  filter_by: FilterOption[];
  graph_type: GraphType[];
  fpColor: FingerPrintColor;
  initGraphFps: string[];
  download: DownloadOption[];
}
