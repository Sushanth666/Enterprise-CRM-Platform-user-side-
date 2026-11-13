import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus, PriorityLevel } from '@/types/crm';
import { mockTasks } from '@/data/mockData';

interface TasksState {
  items: Task[];
  searchQuery: string;
  statusFilter: TaskStatus | 'All';
  priorityFilter: PriorityLevel | 'All';
  assignedFilter: string | 'All';
  isLoading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: mockTasks,
  searchQuery: '',
  statusFilter: 'All',
  priorityFilter: 'All',
  assignedFilter: 'All',
  isLoading: false,
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newTask);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    toggleTaskStatus: (state, action: PayloadAction<string>) => {
      const task = state.items.find(item => item.id === action.payload);
      if (task) {
        if (task.status === 'Completed') {
          task.status = 'In Progress';
          task.completedAt = undefined;
        } else {
          task.status = 'Completed';
          task.completedAt = new Date().toISOString();
        }
      }
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: TaskStatus }>) => {
      const task = state.items.find(item => item.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        if (action.payload.status === 'Completed') {
          task.completedAt = new Date().toISOString();
        } else {
          task.completedAt = undefined;
        }
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setTaskSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setTaskStatusFilter: (state, action: PayloadAction<TaskStatus | 'All'>) => {
      state.statusFilter = action.payload;
    },
    setTaskPriorityFilter: (state, action: PayloadAction<PriorityLevel | 'All'>) => {
      state.priorityFilter = action.payload;
    },
    setTaskAssignedFilter: (state, action: PayloadAction<string | 'All'>) => {
      state.assignedFilter = action.payload;
    },
    seedUserTasks: (state, action: PayloadAction<{ userName: string; tasks: Task[] }>) => {
      const otherTasks = state.items.filter(
        (t) => t.assignedTo.toLowerCase() !== action.payload.userName.toLowerCase()
      );
      state.items = [...action.payload.tasks, ...otherTasks];
    },
  },
});

export const {
  addTask,
  updateTask,
  toggleTaskStatus,
  updateTaskStatus,
  deleteTask,
  setTaskSearchQuery,
  setTaskStatusFilter,
  setTaskPriorityFilter,
  setTaskAssignedFilter,
  seedUserTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
