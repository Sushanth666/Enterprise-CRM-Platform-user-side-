import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setTaskSearchQuery,
  setTaskStatusFilter,
  setTaskPriorityFilter,
  setTaskAssignedFilter,
} from '@/modules/tasks/tasksSlice';
import { openModal } from '@/store/uiSlice';
import { TaskStatus, PriorityLevel } from '@/types/crm';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { mockTeamMembers } from '@/data/mockData';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Clock,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, searchQuery, statusFilter, priorityFilter, assignedFilter } = useAppSelector(
    (state) => state.tasks
  );
  const currentUser = useAppSelector((state) => state.auth.user);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);

  const myTasksCount = items.filter(
    (t) => t.assignedTo.toLowerCase() === currentUser.name.toLowerCase()
  ).length;

  useEffect(() => {
    dispatch(setTaskAssignedFilter(workspaceScope === 'personal' ? 'My Tasks' : 'All'));
  }, [workspaceScope, dispatch]);

  // Filter
  const filteredTasks = items.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.relatedTo && task.relatedTo.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

    const matchesAssigned =
      assignedFilter === 'My Tasks'
        ? task.assignedTo.toLowerCase() === currentUser.name.toLowerCase()
        : assignedFilter === 'All' || task.assignedTo === assignedFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
  });

  // Calculate metrics
  const currentScopeItems =
    assignedFilter === 'My Tasks' || (assignedFilter === 'All' && workspaceScope === 'personal')
      ? items.filter((t) => currentUser && t.assignedTo.toLowerCase() === currentUser.name.toLowerCase())
      : items;

  const totalCount = currentScopeItems.length;
  const completedCount = currentScopeItems.filter((t) => t.status === 'Completed').length;
  const inProgressCount = currentScopeItems.filter((t) => t.status === 'In Progress').length;
  const overdueCount = currentScopeItems.filter(
    (t) =>
      t.status !== 'Completed' &&
      new Date(t.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)
  ).length;

  const statusTabs: { id: TaskStatus | 'All'; label: string; count?: number }[] = [
    { id: 'All', label: 'All Tasks', count: totalCount },
    { id: 'Todo', label: 'To Do', count: currentScopeItems.filter((t) => t.status === 'Todo').length },
    { id: 'In Progress', label: 'In Progress', count: inProgressCount },
    { id: 'Completed', label: 'Completed', count: completedCount },
  ];

  return (
    <div className="space-y-6">
      {/* Scope Pill Tabs: My Tasks vs All Tasks */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch(setTaskAssignedFilter('My Tasks'))}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            assignedFilter === 'My Tasks'
              ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs font-bold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>👤 My Pending Tasks</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              assignedFilter === 'My Tasks' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {myTasksCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => dispatch(setTaskAssignedFilter('All'))}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            assignedFilter === 'All'
              ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs font-bold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>👥 All Organization Tasks</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              assignedFilter === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {items.length}
          </span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-slate-400">Total Tasks</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-slate-400">In Progress</span>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{inProgressCount}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-slate-400">Completed</span>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">{completedCount}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-slate-400">Overdue</span>
          <p className="text-xl sm:text-2xl font-bold text-rose-600 mt-1">{overdueCount}</p>
        </div>
      </div>

      {/* Tabs and Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch(setTaskStatusFilter(tab.id))}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.id
                      ? 'bg-indigo-700 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <Button
          onClick={() => dispatch(openModal('taskFormOpen'))}
          leftIcon={<Plus className="w-4 h-4" />}
          size="sm"
          className="w-full sm:w-auto"
        >
          Add Task
        </Button>
      </div>

      {/* Search and Filter Row */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title, description, account..."
            value={searchQuery}
            onChange={(e) => dispatch(setTaskSearchQuery(e.target.value))}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => dispatch(setTaskPriorityFilter(e.target.value as any))}
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={assignedFilter}
            onChange={(e) => dispatch(setTaskAssignedFilter(e.target.value))}
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Assignees</option>
            {mockTeamMembers.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Cards Grid/List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-8 h-8" />}
          title="No Tasks Found"
          description="You have no tasks matching this filter criteria. Stay productive by adding a new one."
          actionText="Create Task"
          onAction={() => dispatch(openModal('taskFormOpen'))}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

