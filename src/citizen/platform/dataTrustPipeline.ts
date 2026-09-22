import type { DataTrustPipelineResponse, DataTrustPipelineStageId } from '../../data-trust/pipeline.js';
import type { ModelProcessStepId } from './modelProcess.js';

/** Mapeo etapas DATA Trust (backend) → barra UI genérica. */
export function dataTrustStageToProcessStep(stage: DataTrustPipelineStageId): ModelProcessStepId {
  switch (stage) {
    case 'select':
      return 'select';
    case 'connect':
      return 'connect';
    case 'ingest':
      return 'receive';
    case 'k_anonymity':
      return 'analyze';
    case 'aggregate':
      return 'classify';
    case 'audit':
    case 'publish':
      return 'report';
    case 'serve':
      return 'published';
    default:
      return 'select';
  }
}

export function processStepFromDataTrustPipeline(
  pipeline: Pick<DataTrustPipelineResponse, 'currentStage'>,
): ModelProcessStepId {
  return dataTrustStageToProcessStep(pipeline.currentStage);
}
