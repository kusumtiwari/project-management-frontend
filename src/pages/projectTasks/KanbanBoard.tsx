import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";

// Minimal fallbacks if your UI lib doesn't export Card/Button, replace with div/button
// and adjust classes accordingly.

export type TaskItem = {
  _id: string;
  title: string;
  description?: string;
  status: "backlog" | "in-progress" | "done" | "deployed" | "review";
  deadline?: string;
  assignedTo?: { name?: string };
};

export type KanbanColumnKey = "backlog" | "in-progress" | "done" | "deployed";

const STATUS_TO_LABEL: Record<KanbanColumnKey, string> = {
  "backlog": "To-Dos",
  "in-progress": "Doing",
  "done": "Completed",
  "deployed": "Deployed",
};

const STATUS_BADGE_VARIANT: Record<KanbanColumnKey, "secondary" | "default" | "success"> = {
  "backlog": "secondary",
  "in-progress": "default",
  "done": "success",
  "deployed": "success",
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
      done: [],
      deployed: [],
    };
    for (const t of tasks) {
      if (t.status === "backlog" || t.status === "in-progress" || t.status === "done" || t.status === "deployed") {
        groups[t.status].push(t);
      } else {
        // If status like 'review' exists, show it in Doing for now
        groups["in-progress"].push(t);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {(Object.keys(columns) as KanbanColumnKey[]).map((colKey) => (
        <div key={colKey} className="bg-slate-50 rounded-xl p-3 border dark:bg-neutral-900 dark:border-neutral-800"
             onDragOver={handleDragOver}
             onDrop={(e) => handleDrop(e, colKey)}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold dark:text-gray-200">{STATUS_TO_LABEL[colKey]}</h3>
            <Badge variant={STATUS_BADGE_VARIANT[colKey]}>{columns[colKey].length}</Badge>
          </div>
          <div className="space-y-3 min-h-[200px]">
            {columns[colKey].length === 0 ? (
              <div className="p-3 bg-white rounded-lg border text-center text-xs text-muted-foreground dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-400">
                No tasks in {STATUS_TO_LABEL[colKey]}
              </div>
            ) : null}
            {columns[colKey].map((t) => (
              <div key={t._id}
                   draggable
                   onDragStart={(e) => handleDragStart(e, t._id)}
                   onClick={() => onCardClick?.(t)}
                   className="rounded-lg border bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing dark:bg-neutral-800 dark:border-neutral-700">
                <div className="text-sm font-medium dark:text-gray-100">{t.title}</div>
                {t.description ? (
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2 dark:text-gray-400">
                    {t.description}
                  </div>
                ) : null}
                <div className="mt-2 flex items-center justify-between">
                  <Badge variant={STATUS_BADGE_VARIANT[colKey]}>{STATUS_TO_LABEL[colKey]}</Badge>
                  <span className="text-[11px] text-muted-foreground dark:text-gray-400">
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
