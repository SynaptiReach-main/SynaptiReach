export {};
type Workspace = {
  id: string;
  scenario: string;
  createdAt: number;
  state: any;
};

const workspaces = new Map<string, Workspace>();

export function createWorkspace(id: string, scenario: string) {
  const ws = {
    id,
    scenario,
    createdAt: Date.now(),
    state: {
      revenue: 10000,
      users: 10,
      churn: 1.2,
      growth: 3,
    },
  };

  workspaces.set(id, ws);
  return ws;
}

export function getWorkspaces(id: string) {
  return workspaces.get(id);
}

export function updateWorkspace(id: string, patch: any) {
  const ws = workspaces.get(id);
  if (!ws) return;

  ws.state = { ...ws.state, ...patch };
}
