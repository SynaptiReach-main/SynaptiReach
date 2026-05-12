export function analyzeWorkspace() {
  return {
    score: 0,
    insights: []
  };
}

export async function buildWorkspaceIntelligence(data: unknown) {
  return { score: 0, insights: [], data };
}

export async function generateGeminiInsights(data: unknown) {
  return { insights: [], data };
}
