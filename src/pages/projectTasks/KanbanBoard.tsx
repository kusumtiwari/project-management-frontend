import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";

// Minimal fallbacks if your UI lib doesn't export Card/Button, replace with div/button
// and adjust classes accordingly.

export type TaskItem = {
  _id: string;
  title: string;
  description?: string;
  status: "backlog" | "in-progress" | "done" | "deployed" | "review" | "blocked";
  deadline?: string;
  assignedTo?: { name?: string };
  priority?: "low" | "medium" | "high" | "urgent";
};

export type KanbanColumnKey = "backlog" | "in-progress" | "review" | "done" | "deployed";

const STATUS_TO_LABEL: Record<KanbanColumnKey, string> = {
  "backlog": "To-Dos",
  "in-progress": "In Progress",
  "review": "Review",
  "done": "Completed",
  "deployed": "Deployed",
};

const STATUS_BADGE_VARIANT: Record<KanbanColumnKey, "secondary" | "default" | "outline"> = {
  "backlog": "secondary",
  "in-progress": "default",
  "review": "outline",
  "done": "secondary",
  "deployed": "secondary",
};

interface KanbanBoardProps {
  tasks: TaskItem[];
  onMove: (taskId: string, newStatus: KanbanColumnKey) => void;
  onCardClick?: (task: TaskItem) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onMove, onCardClick }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const columns = useMemo(() => {
    const groups: Record<KanbanColumnKey, TaskItem[]> = {
      backlog: [],
      "in-progress": [],
      review: [],
      done: [],
      deployed: [],
    };
    for (const t of tasks) {
      if (t.status === "backlog" || t.status === "in-progress" || t.status === "review" || t.status === "done" || t.status === "deployed") {
        groups[t.status].push(t);
      } else if (t.status === "blocked") {
        // Show blocked tasks in review column for now
        groups["review"].push(t);
      } else {
        // Fallback for any unknown status
        groups["backlog"].push(t);
      }
    }
    return groups;
  }, [tasks]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: KanbanColumnKey) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    if (id) onMove(id, status);
    setDraggingId(null);
  };

  console.log(tasks,'tasks here')

  return (
    <div className="flex flex-row gap-4 overflow-auto max-w-[80vw] max-h-[80vh] p-4">
      {(Object.keys(columns) as KanbanColumnKey[]).map((colKey) => (
        <div key={colKey} className="bg-slate-50 rounded-xl p-3 border min-w-[22vw] flex-shrink-0"
             onDragOver={handleDragOver}
             onDrop={(e) => handleDrop(e, colKey)}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">{STATUS_TO_LABEL[colKey]}</h3>
            <Badge variant={STATUS_BADGE_VARIANT[colKey]}>{columns[colKey].length}</Badge>
          </div>
          <div className="space-y-3 min-h-[200px]">
            {columns[colKey].length === 0 ? (
              <div className="p-3 bg-white rounded-lg border text-center text-xs text-muted-foreground">
                No tasks in {STATUS_TO_LABEL[colKey]}
              </div>
            ) : null}
            {columns[colKey].map((t) => (
              <div key={t._id}
                   draggable
                   onDragStart={(e) => handleDragStart(e, t._id)}
                   onClick={() => onCardClick?.(t)}
                   className="rounded-lg border bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-medium flex-1">{t.title}</div>
                  {t.priority && (
                    <div className="ml-2">
                      {t.priority === 'urgent' && <span className="text-red-500 text-xs">🔴</span>}
                      {t.priority === 'high' && <span className="text-orange-500 text-xs">🟠</span>}
                      {t.priority === 'medium' && <span className="text-yellow-500 text-xs">🟡</span>}
                      {t.priority === 'low' && <span className="text-green-500 text-xs">🟢</span>}
                    </div>
                  )}
                </div>
                {t.description ? (
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {t.description}
                  </div>
                ) : null}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {t.assignedTo ? (
                      <div className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {t.assignedTo.name}
                      </div>
                    ) : (
                      <div className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                        Unassigned
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {t.deadline ? new Date(t.deadline).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;