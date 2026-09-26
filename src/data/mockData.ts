import type { AIModel, Defect, InspectionRecord } from '@/types';

const partNames: Record<string, { name: string; number: string }> = {
  engine: { name: '엔진 블록', number: 'ENG-BLK-2.0T' },
  transmission: { name: '변속기 하우징', number: 'TRN-HSG-6AT' },
  brake: { name: '브레이크 캘리퍼', number: 'BRK-CAL-FR' },
  suspension: { name: '서스펜션 암', number: 'SUS-ARM-FL' },
  body: { name: '프론트 도어 패널', number: 'BDY-DOR-FL' },
  electrical: { name: '배전기 모듈', number: 'ELC-ECU-01' },
  interior: { name: '대시보드 패널', number: 'INT-DSH-01' },
};

const inspectors = ['김민준', '이서연', '박지호', '최유진', '정도현'];

const defectTemplates: Omit<Defect, 'id' | 'bbox'>[] = [
  { type: 'scratch', severity: 'minor', confidence: 0.92, description: '표면 스크래치 (길이 약 15mm)' },
  { type: 'appearance_damage', severity: 'major', confidence: 0.88, description: '충격으로 인한 외관 손상 (직경 약 20mm)' },
  { type: 'step', severity: 'major', confidence: 0.85, description: '단차 발생 (약 3mm)' },
  { type: 'hole_deformation', severity: 'critical', confidence: 0.95, description: '홀 형상 변형 감지' },
  { type: 'looseness', severity: 'critical', confidence: 0.91, description: '유격 발생 (편차 약 3mm)' },
  { type: 'sealing', severity: 'minor', confidence: 0.79, description: '실링 불량 감지' },
  { type: 'connection', severity: 'minor', confidence: 0.82, description: '연계 불량' },
  { type: 'fastening', severity: 'major', confidence: 0.97, description: '볼트 체결 누락 (2개소)' },
];

function randomBbox(): Defect['bbox'] {
  return {
    x: Math.round(Math.random() * 400 + 50),
    y: Math.round(Math.random() * 300 + 30),
    width: Math.round(Math.random() * 120 + 40),
    height: Math.round(Math.random() * 100 + 30),
  };
}

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const categories = Object.keys(partNames);

function generateRecords(count: number): InspectionRecord[] {
  const records: InspectionRecord[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const cat = categories[i % categories.length];
    const part = partNames[cat];
    const isPass = Math.random() > 0.28;
    const isPending = !isPass && Math.random() > 0.92;
    const result = isPending ? 'pending' : isPass ? 'pass' : 'fail';

    const defectCount = isPass ? 0 : Math.floor(Math.random() * 3) + 1;
    const defects: Defect[] = pickRandom(defectTemplates, defectCount).map((d, idx) => ({
      ...d,
      id: `${i}-d${idx}`,
      bbox: randomBbox(),
    }));

    const minutesAgo = i * 37 + Math.floor(Math.random() * 30);
    const inspectedAt = new Date(now.getTime() - minutesAgo * 60000);

    records.push({
      id: `INS-${String(20250923 - i).padStart(6, '0')}`,
      partName: part.name,
      partNumber: part.number,
      category: cat as InspectionRecord['category'],
      result,
      inspectedAt: inspectedAt.toISOString(),
      inspector: inspectors[i % inspectors.length],
      modelId: 'model-v2',
      modelName: 'PartsDefectNet v2.3',
      confidence: isPass ? Math.round(Math.random() * 8 + 91) : Math.round(Math.random() * 12 + 84),
      processingTimeMs: Math.round(Math.random() * 400 + 120),
      imageUrl: '',
      defects,
    });
  }

  return records;
}

export const mockRecords: InspectionRecord[] = generateRecords(48);

export const mockModels: AIModel[] = [
  {
    id: 'swin-faster-rcnn',
    name: 'Swin-T + Faster R-CNN',
    version: 'v1.0',
    status: 'active',
    accuracy: 96.4,
    precision: 95.1,
    recall: 93.8,
    f1Score: 94.4,
    mAP: 94.8,
    fps: 18,
    latencyMs: 55,
    gpuMemoryMb: 4200,
    modelSizeMb: 180,
    trainedAt: '2025-08-15T09:00:00Z',
    datasetSize: 12480,
    description:
      'Swin Transformer Tiny와 Faster R-CNN을 결합한 객체 탐지 모델. 정밀한 불량 탐지를 우선하는 검사 환경을 대상으로 한다.',
      defectTypes: ['scratch', 'appearance_damage', 'step', 'hole_deformation', 'looseness', 'sealing'],
  },
  {
    id: 'yolo',
    name: 'YOLO',
    version: 'v1.0',
    status: 'inactive',
    accuracy: 92.1,
    precision: 90.3,
    recall: 88.7,
    f1Score: 89.5,
    mAP: 91.2,
    fps: 65,
    latencyMs: 15,
    gpuMemoryMb: 2800,
    modelSizeMb: 110,
    trainedAt: '2025-07-20T09:00:00Z',
    datasetSize: 12480,
    description:
      '실시간 객체 탐지에 적합한 YOLO 기반 모델. 빠른 추론 속도를 중요하게 고려하는 검사 환경을 대상으로 한다.',
      defectTypes: ['scratch', 'appearance_damage', 'step'],
  },
  {
    id: 'ssd-mobilenetv3',
    name: 'SSD + MobileNetV3',
    version: 'v1.0',
    status: 'training',
    accuracy: 94.8,
    precision: 93.6,
    recall: 92.2,
    f1Score: 92.9,
    mAP: 90.5,
    fps: 48,
    latencyMs: 21,
    gpuMemoryMb: 1600,
    modelSizeMb: 25,
    trainedAt: '2025-09-20T09:00:00Z',
    datasetSize: 12480,
    description:
      'SSD와 MobileNetV3를 결합한 경량 객체 탐지 모델. 낮은 연산 자원에서도 동작할 수 있는 검사 환경을 대상으로 한다.',
      defectTypes: ['scratch', 'appearance_damage', 'looseness'],
  },
];


export const dashboardStats = {
  todayInspections: mockRecords.filter(
    (r) => new Date(r.inspectedAt).toDateString() === new Date().toDateString()
  ).length,
  totalInspections: mockRecords.length,
  passRate: Math.round(
    (mockRecords.filter((r) => r.result === 'pass').length / mockRecords.length) * 1000
  ) / 10,
  failRate: Math.round(
    (mockRecords.filter((r) => r.result === 'fail').length / mockRecords.length) * 1000
  ) / 10,
  activeModels: mockModels.filter((m) => m.status === 'active').length,
  pendingCount: mockRecords.filter((r) => r.result === 'pending').length,
};

export const hourlyData = [
  { hour: '09:00', pass: 12, fail: 3 },
  { hour: '10:00', pass: 18, fail: 5 },
  { hour: '11:00', pass: 22, fail: 4 },
  { hour: '12:00', pass: 15, fail: 2 },
  { hour: '13:00', pass: 8, fail: 1 },
  { hour: '14:00', pass: 25, fail: 6 },
  { hour: '15:00', pass: 20, fail: 7 },
  { hour: '16:00', pass: 17, fail: 3 },
];

export const weeklyData = [
  { day: '월', pass: 142, fail: 38 },
  { day: '화', pass: 156, fail: 42 },
  { day: '수', pass: 168, fail: 31 },
  { day: '목', pass: 149, fail: 45 },
  { day: '금', pass: 175, fail: 28 },
  { day: '토', pass: 98, fail: 19 },
  { day: '일', pass: 62, fail: 12 },
];
