import React from 'react';
import { useAppDispatch } from '@/store';
import { toggleTaskStatus, deleteTask } from '@/modules/tasks/tasksSlice';
import { addToast } from '@/store/uiSlice';
import { Task } from '@/types/crm';
import { formatDate, getPriorityBadge } from '@/utils/formatters';
import { Avatar } from '@/components/Avatar';
import { Check, Calendar, Trash2, Link2, AlertCircle } from 'lucide-react';

export const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const dispatch = useAppDispatch();
  const isCompleted = task.status === 'Completed';

  const isOverdue =
    !isCompleted &&
    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  const handleToggle = () => {
    dispatch(toggleTaskStatus(task.id));
    dispatch(
      addToast({
        type: isCompleted ? 'info' : 'success',
        title: isCompleted ? 'Task Reopened' : 'Task Completed',
        message: task.title,
      })
    );
  };

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      dispatch(deleteTask(task.id));
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border p-4 shadow-2xs card-hover-lift flex items-start gap-3.5 group ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/50 opacity-75'
          : isOverdue
          ? 'border-rose-200 hover:border-rose-300'
          : 'border-slate-200/90 hover:border-indigo-400'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all active:scale-90 shrink-0 ${
          isCompleted
            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs scale-105'
            : 'border-slate-300 hover:border-indigo-600 hover:scale-105 bg-white'
        }`}
      >
        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3] animate-scaleIn" />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-md border ${getPriorityBadge(
              task.priority
            )}`}
          >
            {task.priority}
          </span>

          <span
            className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : task.status === 'In Progress'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {task.status}
          </span>

          {task.relatedTo && (
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 truncate max-w-[200px]">
              <Link2 className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{task.relatedTo.name}</span>
            </span>
          )}
        </div>

        <h4
          className={`text-sm font-semibold transition-colors ${
            isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'
          }`}
        >
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
        )}

        {/* Footer info: Due date & Assignee */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
          <div
            className={`flex items-center gap-1.5 font-medium ${
              isOverdue ? 'text-rose-600' : 'text-slate-500'
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>
              {isOverdue && 'Overdue: '}
              {formatDate(task.dueDate)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Avatar name={task.assignedTo} src={task.assignedAvatar} size="xs" />
              <span className="text-xs text-slate-700 font-medium">
                {task.assignedTo.split(' ')[0]}
              </span>
            </div>

            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

