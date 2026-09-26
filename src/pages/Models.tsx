import { useEffect, useState } from 'react';
import {
  Cpu,
  Plus,
  CheckCircle2,
  XCircle,
  Loader2,
  Activity,
  Database,
  Calendar,
  Trash2,
  Power,
  GitBranch,
  Target,
  Zap,
} from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import StatCard from '@/components/StatCard';
import SectionTitle from '@/components/SectionTitle';
import { mockModels } from '@/data/mockData';
import { DEFECT_TYPES, defectLabel, type AIModel } from '@/types';

const statusMeta = (status: AIModel['status']) => {
  switch (status) {
    case 'active':
      return { label: '운영 중', className: 'badge-pass', Icon: CheckCircle2 };
    case 'inactive':
      return { label: '비활성', className: 'badge-fail', Icon: XCircle };
    case 'training':
      return { label: '학습 중', className: 'badge-warn', Icon: Loader2 };
  }
};

export default function Models() {
  const [models, setModels] = useState<AIModel[]>(() => {
    const savedModels = localStorage.getItem('aiModels');
  
    if (savedModels) {
      try {
        return JSON.parse(savedModels);
      } catch {
        return mockModels;
      }
    }
  
    return mockModels;
  });
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelVersion, setNewModelVersion] = useState('');
  const [newModelDescription, setNewModelDescription] = useState('');

  const toggleStatus = (id: string) => {
    setModels((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' }
          : m
      )
    );
  };

  const deleteModel = (id: string) => {
    const target = models.find((model) => model.id === id);

    if (!target) return;

    if (target.status === 'active') {
      return;
    }

    const confirmed = window.confirm(
      `"${target.name}" 모델을 삭제하시겠습니까?`
    );

    if (!confirmed) return;

    setModels((prev) => prev.filter((model) => model.id !== id));

    if (selectedModel?.id === id) {
      setSelectedModel(null);
    }
  };

  const registerModel = () => {
    if (!newModelName.trim() || !newModelVersion.trim()) {
      window.alert('모델 이름과 버전을 입력해주세요.');
      return;
    }
  
    const newModel: AIModel = {
      id: `model-${Date.now()}`,
      name: newModelName.trim(),
      version: newModelVersion.trim(),
      status: 'training',
  
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      mAP: 0,
  
      fps: 0,
      latencyMs: 0,
      gpuMemoryMb: 0,
      modelSizeMb: 0,
  
      trainingEpoch: 0,
      totalEpochs: 100,
  
      trainedAt: new Date().toISOString(),
      datasetSize: 0,
      description: newModelDescription.trim() || '등록된 AI 모델입니다.',
      defectTypes: [],
    };
  
    setModels((prev) => [...prev, newModel]);
  
    setNewModelName('');
    setNewModelVersion('');
    setNewModelDescription('');
    setIsRegisterModalOpen(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setModels((prev) =>
        prev.map((model) => {
          if (model.status !== 'training') return model;
  
          const currentEpoch = model.trainingEpoch ?? 0;
          const totalEpochs = model.totalEpochs ?? 100;
  
          if (currentEpoch >= totalEpochs) {
            return {
              ...model,
              status: 'inactive',
              trainingEpoch: totalEpochs,
          
              // 화면 시연용 임시 성능값
              accuracy: 94.2,
              precision: 93.8,
              recall: 92.5,
              f1Score: 93.1,
              mAP: 92.8,
          
              fps: 52,
              latencyMs: 19,
              gpuMemoryMb: 1800,
              modelSizeMb: 30,
          
              trainedAt: new Date().toISOString(),
              datasetSize: 200000,
            };
          }
  
          return {
            ...model,
            trainingEpoch: currentEpoch + 5,
          };
        })
      );
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('aiModels', JSON.stringify(models));
  }, [models]);

  const activeCount = models.filter((m) => m.status === 'active').length;
  const trainingCount = models.filter((m) => m.status === 'training').length;
  const avgAccuracy =
    models.filter((m) => m.status === 'active').reduce((acc, m) => acc + m.accuracy, 0) /
    (activeCount || 1);

  return (
    <PageContainer>
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="등록된 모델"
          value={models.length}
          icon={<Cpu className="w-5 h-5" />}
          accent="navy"
        />
        <StatCard
          title="운영 중"
          value={activeCount}
          icon={<CheckCircle2 className="w-5 h-5" />}
          accent="green"
        />
        <StatCard
          title="학습 중"
          value={trainingCount}
          icon={<Loader2 className="w-5 h-5" />}
          accent="amber"
        />
        <StatCard
          title="평균 정확도"
          value={`${avgAccuracy.toFixed(1)}%`}
          icon={<Target className="w-5 h-5" />}
          accent="navy"
        />
      </div>

      {/* Model list */}
      <div className="card p-5">
        <SectionTitle
          title="AI 모델 목록"
          action={
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              모델 등록
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {models.map((model) => {
            const meta = statusMeta(model.status);
            const StatusIcon = meta.Icon;
            return (
              <div
                key={model.id}
                className="border border-gray-200 rounded-xl p-5 hover:border-navy-300 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-navy-50 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-navy-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900">{model.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        {model.version} · {model.id}
                      </p>
                    </div>
                  </div>
                  <span className={`${meta.className} ${model.status === 'training' ? 'animate-pulse' : ''}`}>
                    <StatusIcon className="w-3 h-3" />
                    {meta.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">{model.description}</p>

                {/* Metrics */}
                {model.status === 'training' ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-xs text-amber-700 mb-2">
                      <span>학습 진행률</span>
                      <span className="font-medium">
                        에포크 {model.trainingEpoch ?? 0}/{model.totalEpochs ?? 0}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{
                          width: `${((model.trainingEpoch ?? 0) / (model.totalEpochs ?? 1)) * 100
                            }%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 mb-4">
                    <div className="grid grid-cols-4 gap-2">
                      <Metric label="정확도" value={`${model.accuracy}%`} />
                      <Metric label="정밀도" value={`${model.precision}%`} />
                      <Metric label="재현율" value={`${model.recall}%`} />
                      <Metric label="F1 점수" value={model.f1Score.toFixed(1)} />
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      <Metric label="mAP" value={`${model.mAP}%`} />
                      <Metric label="FPS" value={`${model.fps}`} />
                      <Metric label="Latency" value={`${model.latencyMs} ms`} />
                      <Metric label="GPU Memory" value={`${model.gpuMemoryMb} MB`} />
                      <Metric label="Model Size" value={`${model.modelSizeMb} MB`} />
                    </div>
                  </div>
                )}

                {/* Defect types */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {model.defectTypes.map((dt) => {
                    const dtMeta = DEFECT_TYPES.find((d) => d.key === dt);
                    return (
                      <span
                        key={dt}
                        className="text-xs px-2 py-1 rounded-md border border-gray-200 text-gray-600"
                        style={{ borderLeft: `3px solid ${dtMeta?.color}` }}
                      >
                        {defectLabel(dt)}
                      </span>
                    );
                  })}
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    {model.datasetSize.toLocaleString()}건
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(model.trainedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => toggleStatus(model.id)}
                    disabled={model.status === 'training'}
                    className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-50"
                  >
                    <Power className="w-3.5 h-3.5" />
                    {model.status === 'active' ? '비활성화' : '활성화'}
                  </button>
                  <button
                    onClick={() => setSelectedModel(model)}
                    className="btn-secondary text-xs px-3 py-1.5"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    상세 보기
                  </button>
                  <button
                    onClick={() => deleteModel(model.id)}
                    disabled={model.status === 'active'}
                    className="text-xs px-3 py-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail modal */}
      {selectedModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedModel(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-navy-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-900">{selectedModel.name} {selectedModel.version}</h3>
                  <p className="text-xs text-gray-500">{selectedModel.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedModel(null)}
                className="p-1.5 text-gray-400 hover:text-navy-700 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-sm text-gray-600">{selectedModel.description}</p>

              <div className="space-y-3">
                {/* 탐지 성능 */}
                <div>
                  <h4 className="text-sm font-medium mb-2">탐지 성능</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <DetailMetric
                      icon={<Target className="w-4 h-4" />}
                      label="정확도"
                      value={`${selectedModel.accuracy}%`}
                    />
                    <DetailMetric
                      icon={<Zap className="w-4 h-4" />}
                      label="정밀도"
                      value={`${selectedModel.precision}%`}
                    />
                    <DetailMetric
                      icon={<Activity className="w-4 h-4" />}
                      label="재현율"
                      value={`${selectedModel.recall}%`}
                    />
                    <DetailMetric
                      icon={<GitBranch className="w-4 h-4" />}
                      label="F1 점수"
                      value={selectedModel.f1Score.toFixed(1)}
                    />
                    <DetailMetric
                      icon={<Target className="w-4 h-4" />}
                      label="mAP"
                      value={`${selectedModel.mAP}%`}
                    />
                  </div>
                </div>

                {/* 연산 효율 */}
                <div>
                  <h4 className="text-sm font-medium mb-2">연산 효율</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <DetailMetric
                      icon={<Zap className="w-4 h-4" />}
                      label="FPS"
                      value={`${selectedModel.fps}`}
                    />
                    <DetailMetric
                      icon={<Activity className="w-4 h-4" />}
                      label="Latency"
                      value={`${selectedModel.latencyMs} ms`}
                    />
                    <DetailMetric
                      icon={<Cpu className="w-4 h-4" />}
                      label="GPU Memory"
                      value={`${selectedModel.gpuMemoryMb} MB`}
                    />
                    <DetailMetric
                      icon={<Database className="w-4 h-4" />}
                      label="Model Size"
                      value={`${selectedModel.modelSizeMb} MB`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-navy-900 mb-2">학습 데이터</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-gray-400" />
                    {selectedModel.datasetSize.toLocaleString()}건
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(selectedModel.trainedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-navy-900 mb-2">검출 가능 결함 유형</p>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.defectTypes.map((dt) => {
                    const dtMeta = DEFECT_TYPES.find((d) => d.key === dt);
                    return (
                      <span
                        key={dt}
                        className="text-xs px-2.5 py-1 rounded-md border border-gray-200 text-gray-600"
                        style={{ borderLeft: `3px solid ${dtMeta?.color}` }}
                      >
                        {defectLabel(dt)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsRegisterModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  AI 모델 등록
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  새로운 AI 모델을 등록합니다.
                </p>
              </div>

              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-navy-700 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  모델 이름
                </label>
                <input
                  type="text"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  placeholder="예: YOLO"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  버전
                </label>
                <input
                  type="text"
                  value={newModelVersion}
                  onChange={(e) => setNewModelVersion(e.target.value)}
                  placeholder="예: v1.0"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  모델 설명
                </label>
                <textarea
                  value={newModelDescription}
                  onChange={(e) => setNewModelDescription(e.target.value)}
                  placeholder="모델에 대한 설명을 입력하세요."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-navy-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  취소
                </button>

                <button
                  type="button"
                  onClick={registerModel}
                  className="btn-primary text-sm px-4 py-2"
                >
                  모델 등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-2 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-bold text-navy-900 mt-0.5">{value}</p>
    </div>
  );
}

function DetailMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-navy-500">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-bold text-navy-900">{value}</p>
      </div>
    </div>
  );
}
