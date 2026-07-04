/** Actualiza totales tras aporte sin esperar reload completo. */
import type { ContributionReceipt, ProjectsResponse } from '../api.js';

export function applyContributionOptimistic(
  prev: ProjectsResponse,
  projectId: string,
  receipt: ContributionReceipt,
): ProjectsResponse {
  let addedAmount = 0;

  const projects = prev.projects.map((project) => {
    if (project.id !== projectId) return project;
    addedAmount = receipt.amount;
    const raised = parseFloat(project.raisedAmount) + receipt.amount;
    return {
      ...project,
      raisedAmount: raised.toFixed(4),
      contributions: project.contributions + 1,
    };
  });

  const totalRaised = parseFloat(prev.summary.totalRaised) + addedAmount;

  return {
    ...prev,
    updatedAt: new Date().toISOString(),
    projects,
    summary: {
      ...prev.summary,
      totalRaised: totalRaised.toFixed(4),
      totalContributions: prev.summary.totalContributions + 1,
    },
  };
}
