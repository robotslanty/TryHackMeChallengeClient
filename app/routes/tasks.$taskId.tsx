import { Form, useLoaderData } from '@remix-run/react';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getTask } from '../tasks.server';
import { requireAccessToken } from '../session.server';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    await requireAccessToken(request);
    invariant(params.taskId, 'Missing taskId param');
    const task = await getTask(request, params.taskId);

    if (!task) {
        throw new Response('Not Found', { status: 404 });
    }

    return json({ task });
};

export default function Task() {
    const { task } = useLoaderData<typeof loader>();

    return (
        <div className="card">
            <div className="card-body">
                <h2>{task.title}</h2>
                <p>
                    <span
                        className={
                            'badge ' + (task.status === 'closed' ? 'bg-success' : 'bg-secondary')
                        }
                    >
                        {task.status}
                    </span>
                </p>

                {/* {task.dueAt ? <p>{task.dueAt.toLocaleDateString()}</p> : null} */}

                {task.description ? <p>{task.description}</p> : null}

                <div>
                    <Form action="edit" className="d-inline">
                        <button type="submit" className="btn btn-sm btn-outline-secondary me-2">
                            Edit
                        </button>
                    </Form>
                    <Form
                        action="destroy"
                        className="d-inline"
                        method="post"
                        onSubmit={(event) => {
                            const response = confirm(
                                'Please confirm you want to delete this task.',
                            );
                            if (!response) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit" className="btn btn-sm btn-outline-danger">
                            Delete
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    );
}
