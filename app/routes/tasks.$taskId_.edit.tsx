import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData, useNavigate } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { requireAccessToken } from '../session.server';
import {
    AddTaskDto,
    getTask,
    addTask,
    createEmptyTask,
    editTask,
    TaskStatus,
    EditTaskDto,
    TaskRecord,
} from '../tasks.server';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    await requireAccessToken(request);
    invariant(params.taskId, 'Missing taskId param');
    let task;

    if (params.taskId === 'new') {
        task = createEmptyTask();
    } else {
        task = await getTask(request, params.taskId);
    }

    if (!task) {
        throw new Response('Not Found', { status: 404 });
    }

    return json({ task });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
    await requireAccessToken(request);
    invariant(params.taskId, 'Missing taskId param');
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const status: TaskStatus = updates.status === 'closed' ? 'closed' : 'open';
    let task: TaskRecord | undefined;

    if (params.taskId === 'new') {
        const dto: AddTaskDto = {
            title: updates.title.toString(),
            status,
            description: updates.description.toString(),
        };
        task = await addTask(request, dto);
    } else {
        const dto: EditTaskDto = updates;
        task = await editTask(request, params.taskId, dto);
    }

    if (!task) {
        return redirect('/tasks');
    }

    return redirect(`/tasks/${task._id}`);
};

export default function EditTask() {
    const { task } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (
        <Form id="contact-form" method="post">
            <p>
                <span>Title</span>
                <input
                    defaultValue={task.title}
                    aria-label="Title"
                    name="title"
                    type="text"
                    placeholder="Title"
                />
            </p>

            <label>
                <span>Status</span>
                <select name="status" defaultValue={task.status}>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
            </label>

            <label>
                <span>Description</span>
                <textarea defaultValue={task.description} name="description" rows={6} />
            </label>
            <p>
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate(-1)}>
                    Cancel
                </button>
            </p>
        </Form>
    );
}
