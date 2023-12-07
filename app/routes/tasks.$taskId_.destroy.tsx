import { ActionFunctionArgs, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { deleteTask } from '../tasks.server';
import { requireAccessToken } from '../session.server';

export const action = async ({ params, request }: ActionFunctionArgs) => {
    await requireAccessToken(request);
    invariant(params.taskId, 'Missing taskId param');
    await deleteTask(request, params.taskId);
    return redirect('/tasks');
};
