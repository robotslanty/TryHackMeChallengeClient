import { Form, useLoaderData } from '@remix-run/react';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getTask } from '../tasks.server';
import { requireAccessToken } from '../session.server';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    await requireAccessToken(request);
    invariant(params.taskId, 'Missing taskId param');
    const task = await getTask(request, params.taskId);
    console.log(task);

    if (!task) {
        throw new Response('Not Found', { status: 404 });
    }

    return json({ task });
};

export default function Task() {
    const { task } = useLoaderData<typeof loader>();

    return (
        <div id="task">
            <div>
                <h1>{task.title}</h1>

                <p>{task.status}</p>

                {/* {task.dueAt ? <p>{task.dueAt.toLocaleDateString()}</p> : null} */}

                {task.description ? <p>{task.description}</p> : null}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>

                    <Form
                        action="destroy"
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
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}
