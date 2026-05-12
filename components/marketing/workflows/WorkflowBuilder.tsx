"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";

import {
  Plus,
  Sparkles,
  Save,
  Play,
} from "lucide-react";

const initialNodes = [
  {
    id: "1",
    position: {
      x: 100,
      y: 100,
    },
    data: {
      label:
        "Lead Created Trigger",
    },
    type: "input",
  },

  {
    id: "2",
    position: {
      x: 400,
      y: 100,
    },
    data: {
      label:
        "Send Email",
    },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
  },
];

export default function WorkflowBuilder() {
  const [
    nodes,
    setNodes,
    onNodesChange,
  ] = useNodesState(
    initialNodes
  );

  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState(
    initialEdges
  );

  const [
    workflowName,
    setWorkflowName,
  ] = useState(
    "New Workflow"
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  const onConnect =
    useCallback(
      (params: any) =>
        setEdges(
          (eds) =>
            addEdge(
              params,
              eds
            )
        ),
      []
    );

  const addNode = (
    label: string
  ) => {
    const id =
      `${Date.now()}`;

    setNodes(
      (prev) => [
        ...prev,
        {
          id,
          position: {
            x:
              Math.random() *
              400,
            y:
              Math.random() *
              400,
          },
          data: {
            label,
          },
        },
      ]
    );
  };

  const saveWorkflow =
    async () => {
      try {
        setSaving(true);

        const actions =
          nodes.map(
            (node) => ({
              label:
                node.data
                  .label,
            })
          );

        await fetch(
          "/api/marketing/workflows",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              {
                name:
                  workflowName,
                trigger_type:
                  "lead_created",
                actions,
              }
            ),
          }
        );

        alert(
          "Workflow saved"
        );
      } catch (
        error
      ) {
        console.error(
          error
        );
      } finally {
        setSaving(false);
      }
    };

  const generateAIWorkflow =
    async () => {
      try {
        const response =
          await fetch(
            "/api/marketing/autonomous/generate",
            {
              method:
                "POST",
            }
          );

        const data =
          await response.json();

        addNode(
          "AI Campaign"
        );

        alert(
          `AI generated campaign: ${data.campaign.name}`
        );
      } catch (
        error
      ) {
        console.error(
          error
        );
      }
    };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">

      <div className="p-5 border-b border-white/10 flex items-center justify-between">

        <div>

          <input
            value={
              workflowName
            }
            onChange={(e) =>
              setWorkflowName(
                e.target.value
              )
            }
            className="bg-transparent text-2xl font-black outline-none"
          />

          <p className="text-sm text-gray-500 mt-1">
            AI-powered workflow automation builder
          </p>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() =>
              addNode(
                "Send SMS"
              )
            }
            className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center gap-2"
          >

            <Plus size={16} />

            Add Node

          </button>

          <button
            onClick={
              generateAIWorkflow
            }
            className="px-4 py-2 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-300 flex items-center gap-2"
          >

            <Sparkles
              size={16}
            />

            AI Generate

          </button>

          <button
            onClick={
              saveWorkflow
            }
            disabled={
              saving
            }
            className="px-4 py-2 rounded-2xl bg-white/10 border border-white/10 text-white flex items-center gap-2"
          >

            <Save size={16} />

            Save

          </button>

        </div>

      </div>

      <div className="h-[700px]">

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={
            onNodesChange
          }
          onEdgesChange={
            onEdgesChange
          }
          onConnect={
            onConnect
          }
          fitView
        >

          <MiniMap />

          <Controls />

          <Background />

        </ReactFlow>

      </div>

    </div>
  );
}
