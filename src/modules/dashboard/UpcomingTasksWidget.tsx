import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTaskStatus } from '@/modules/tasks/tasksSlice';
import { setActiveTab, openModal, addToast } from '@/store/uiSlice';
import { formatDate, getPriorityBadge } from '@/utils/formatters';
import { Check, Plus, ArrowRight, Calendar, AlertCircle } from 'lucide-react';

export const UpcomingTasksWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const currentUser = useAppSelector((state) => state.auth.user);

  const scopedTasks = tasks.filter((t) => {
    if (workspaceScope === 'personal' && currentUser) {
      return t.assignedTo.toLowerCase() === currentUser.name.toLowerCase();
    }
    return true;
  });

  const pendingTasks = scopedTasks
    .filter((t) => t.status !== 'Completed')
    .slice(0, 4);

  const handleToggle = (taskId: string, title: string) => {
    dispatch(toggleTaskStatus(taskId));
    dispatch(
      addToast({
        type: 'success',
        title: 'Task Completed',
        message: title,
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Action Items & Follow-ups
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Urgent deliverables for today</p>
          </div>
          <button
            onClick={() => dispatch(openModal('taskFormOpen'))}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {pendingTasks.map((task) => {
            const isOverdue =
              new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

            return (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all text-xs"
              >
                <button
                  onClick={() => handleToggle(task.id, task.title)}
                  className="mt-0.5 w-4 h-4 rounded border border-slate-300 hover:border-indigo-600 flex items-center justify-center bg-white transition-colors shrink-0"
                >
                  <Check className="w-3 h-3 text-white hover:text-indigo-600 opacity-0 hover:opacity-100" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 line-clamp-1">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`text-[10px] flex items-center gap-1 ${
                        isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      {isOverdue && <AlertCircle className="w-3 h-3 inline" />}
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {pendingTasks.length === 0 && (
            <p className="text-xs text-slate-400 py-6 text-center">All caught up! No pending tasks.</p>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-4 text-center">
        <button
          onClick={() => dispatch(setActiveTab('tasks'))}
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center justify-center gap-1 w-full"
        >
          <span>Manage All Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

