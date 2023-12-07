////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from 'match-sorter';
// @ts-expect-error - no types, but it's a tiny function
import sortBy from 'sort-by';
import invariant from 'tiny-invariant';

type TaskMutation = {
    id?: string;
    title?: string;
    status?: 'open' | 'closed';
    description?: string;
    dueAt?: Date;
};

export type TaskRecord = TaskMutation & {
    id: string;
    createdAt: string;
};

export type AddTaskDto = {
    title: string;
    status: 'open' | 'closed';
    description?: string;
    dueAt?: Date;
};

export type EditTaskDto = {
    title?: string;
    status?: 'open' | 'closed';
    description?: string;
    dueAt?: Date;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeTasks = {
    records: {} as Record<string, TaskRecord>,

    async getAll(): Promise<TaskRecord[]> {
        return Object.keys(fakeTasks.records)
            .map((key) => fakeTasks.records[key])
            .sort(sortBy('-createdAt', 'last'));
    },

    async get(id: string): Promise<TaskRecord | null> {
        return fakeTasks.records[id] || null;
    },

    async create(values: TaskMutation): Promise<TaskRecord> {
        const id = values.id || Math.random().toString(36).substring(2, 9);
        const createdAt = new Date().toISOString();
        const newTask = { id, createdAt, ...values };
        fakeTasks.records[id] = newTask;
        return newTask;
    },

    async set(id: string, values: TaskMutation): Promise<TaskRecord> {
        const task = await fakeTasks.get(id);
        invariant(task, `No task found for ${id}`);
        const updatedTask = { ...task, ...values };
        fakeTasks.records[id] = updatedTask;
        return updatedTask;
    },

    destroy(id: string): null {
        delete fakeTasks.records[id];
        return null;
    },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getTasks(query?: string | null) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let tasks = await fakeTasks.getAll();
    if (query) {
        tasks = matchSorter(tasks, query, {
            keys: ['title'],
        });
    }
    return tasks.sort(sortBy('last', 'createdAt'));
}

export async function createEmptyTask() {
    const task = await fakeTasks.create({ title: 'New Task' });
    return task;
}

export async function getTask(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return fakeTasks.get(id);
}

export async function updateTask(id: string, updates: TaskMutation) {
    const task = await fakeTasks.get(id);
    if (!task) {
        throw new Error(`No task found for ${id}`);
    }
    await fakeTasks.set(id, { ...task, ...updates });
    return task;
}

export async function deleteTask(id: string) {
    fakeTasks.destroy(id);
}

for (let i = 1; i <= 20; i++) {
    fakeTasks.create({
        id: i.toString(),
        status: 'open',
        title: `Task #${i}`,
        description: `This is the description for task #${i}`,
        dueAt: new Date(),
    });
}
