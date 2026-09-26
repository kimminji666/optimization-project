export type DefectType =
  | 'scratch'
  | 'dent'
  | 'rust'
  | 'crack'
  | 'deformation'
  | 'contamination'
  | 'color_mismatch'
  | 'missing_part';

export type InspectionResult = 'pass' | 'fail' | 'pending';

export type PartCategory =
  | 'door'
  | 'radiator_grille'
  | 'roofside'
  | 'wiring'
  | 'bumper'
  | 'cowl_cover'
  | 'connector'
  | 'tail_lamp'
  | 'frame'
  | 'head_lamp'
  | 'fender';

export interface Defect {
  id: string;
  type: DefectType;
  severity: 'critical' | 'major' | 'minor';
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  description: string;
}

export interface InspectionRecord {
  id: string;
  partName: string;
  partNumber: string;
  category: PartCategory;
  result: InspectionResult;
  inspectedAt: string;
  inspector: string;
  modelId: string;
  modelName: string;
  confidence: number;
  processingTimeMs: number;
  imageUrl: string;
  defects: Defect[];
  notes?: string;
}

export interface AIModel {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'training';

  // 탐지 성능
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  mAP: number;

  // 연산 효율
  fps: number;
  latencyMs: number;
  gpuMemoryMb: number;
  modelSizeMb: number;

  trainedAt: string;
  datasetSize: number;
  description: string;
  defectTypes: DefectType[];
}

export interface DefectTypeMeta {
  key: DefectType;
  label: string;
  color: string;
}

export interface PartCategoryMeta {
  key: PartCategory;
  label: string;
}

export const DEFECT_TYPES: DefectTypeMeta[] = [
  { key: 'scratch', label: '스크래치', color: '#f59e0b' },
  { key: 'dent', label: '덴트', color: '#ef4444' },
  { key: 'rust', label: '녹', color: '#b45309' },
  { key: 'crack', label: '균열', color: '#dc2626' },
  { key: 'deformation', label: '변형', color: '#8b5cf6' },
  { key: 'contamination', label: '오염', color: '#0891b2' },
  { key: 'color_mismatch', label: '색상 불량', color: '#db2777' },
  { key: 'missing_part', label: '부품 누락', color: '#6b7280' },
];

export const PART_CATEGORIES: PartCategoryMeta[] = [
  { key: 'door', label: '도어' },
  { key: 'radiator_grille', label: '라디에이터 그릴' },
  { key: 'roofside', label: '루프사이드' },
  { key: 'wiring', label: '배선' },
  { key: 'bumper', label: '범퍼' },
  { key: 'cowl_cover', label: '카울커버' },
  { key: 'connector', label: '커넥터' },
  { key: 'tail_lamp', label: '테일 램프' },
  { key: 'frame', label: '프레임' },
  { key: 'head_lamp', label: '헤드 램프' },
  { key: 'fender', label: '휀더' },
];

export const defectLabel = (type: DefectType): string =>
  DEFECT_TYPES.find((d) => d.key === type)?.label ?? type;

export const categoryLabel = (cat: PartCategory): string =>
  PART_CATEGORIES.find((c) => c.key === cat)?.label ?? cat;

export const resultMeta = (result: InspectionResult) => {
  switch (result) {
    case 'pass':
      return { label: '정상', className: 'badge-pass' };
    case 'fail':
      return { label: '불량', className: 'badge-fail' };
    case 'pending':
      return { label: '검사중', className: 'badge-warn' };
  }
};

export const severityMeta = (severity: Defect['severity']) => {
  switch (severity) {
    case 'critical':
      return { label: '치명적', className: 'badge-fail' };
    case 'major':
      return { label: '중대', className: 'badge-warn' };
    case 'minor':
      return { label: '경미', className: 'badge-info' };
  }
};
