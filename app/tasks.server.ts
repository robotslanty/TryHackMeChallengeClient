import axios from 'axios';
import { getAccessToken } from './session.server';

const apiUri = process.env.API_URI || '';

if (!apiUri) {
    throw new Error('No API URI');
}

export type TaskRecord = AddTaskDto & {
    _id: string;
    createdAt: Date;
};

export type TaskCollection = {
    tasks: TaskRecord[];
    count: number;
    skip: number;
    limit: number;
};

export type TaskStatus = 'open' | 'closed';

export type AddTaskDto = {
    title: string;
    status: TaskStatus;
    description?: string;
    dueAt?: Date;
};

export type EditTaskDto = {
    title?: string;
    status?: TaskStatus;
    description?: string;
    dueAt?: Date;
};

export const createEmptyTask = (): AddTaskDto => ({
    title: '',
    status: 'open',
    description: undefined,
    dueAt: undefined,
});

export const addTask = async (
    request: Request,
    dto: AddTaskDto,
): Promise<TaskRecord | undefined> => {
    const accessToken = await getAccessToken(request);
    console.log({ dto });

    try {
        const response = await axios.post(`${apiUri}/tasks`, dto, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (e) {
        console.log(e);
    }

    return;
};

export const editTask = async (
    request: Request,
    taskId: string,
    dto: EditTaskDto,
): Promise<TaskRecord | undefined> => {
    const accessToken = await getAccessToken(request);

    try {
        const response = await axios.patch(`${apiUri}/tasks/${taskId}`, dto, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (e) {
        console.log(e);
    }

    return;
};

export const deleteTask = async (
    request: Request,
    taskId: string,
): Promise<TaskRecord | undefined> => {
    const accessToken = await getAccessToken(request);

    try {
        const response = await axios.delete(`${apiUri}/tasks/${taskId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (e) {
        console.log(e);
    }

    return;
};

export const getTasks = async (
    request: Request,
    skip: number = 0,
    limit: number = 5,
): Promise<TaskCollection> => {
    const accessToken = await getAccessToken(request);

    try {
        const response = await axios.get(`${apiUri}/tasks?skip=${skip}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (e) {
        console.log(e);
    }

    return { tasks: [], count: 0, skip: 0, limit: 0 };
};

export const getTask = async (
    request: Request,
    taskId: string,
): Promise<TaskRecord | undefined> => {
    const accessToken = await getAccessToken(request);

    try {
        const response = await axios.get(`${apiUri}/tasks/${taskId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (e) {
        console.log(e);
    }

    return;
};
