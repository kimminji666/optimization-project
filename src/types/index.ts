export type DefectType =
  | 'scratch'
  | 'appearance_damage'
  | 'step'
  | 'mounting'
  | 'fixing'
  | 'pin_fixing'
  | 'connection'
  | 'looseness'
  | 'fastening'
  | 'sealing'
  | 'hemming'
  | 'hole_deformation';

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
  trainingEpoch?: number;
  totalEpochs?: number;

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
  { key: 'appearance_damage', label: '외관 손상', color: '#8b5cf6' },
  { key: 'step', label: '단차', color: '#dc2626' },
  { key: 'mounting', label: '장착 불량', color: '#0891b2' },
  { key: 'fixing', label: '고정 불량', color: '#16a34a' },
  { key: 'pin_fixing', label: '고정핀 불량', color: '#ca8a04' },
  { key: 'connection', label: '연계 불량', color: '#2563eb' },
  { key: 'looseness', label: '유격 불량', color: '#9333ea' },
  { key: 'fastening', label: '체결 불량', color: '#ea580c' },
  { key: 'sealing', label: '실링 불량', color: '#0d9488' },
  { key: 'hemming', label: '헤밍 불량', color: '#db2777' },
  { key: 'hole_deformation', label: '홀 변형', color: '#475569' },
];

export const defectLabel = (key: DefectType): string => {
  const defect = DEFECT_TYPES.find((item) => item.key === key);
  return defect ? defect.label : key;
};

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
