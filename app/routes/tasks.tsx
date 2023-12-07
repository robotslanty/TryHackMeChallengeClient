import { Form, Link, NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { requireAccessToken } from '../session.server';
import { getTasks } from '../tasks.server';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    await requireAccessToken(request);
    const url = new URL(request.url);
    const requestedPage = parseInt(url.searchParams.get('page') || '1');
    const requestedLimit = 5;
    const requestedSkip = (requestedPage - 1) * requestedLimit;
    const { tasks, count, skip, limit } = await getTasks(request, requestedSkip, requestedLimit);
    const totalPages = Math.ceil(count / limit);
    const currentPage = 1 + skip / limit;
    return json({ tasks, count, skip, limit, totalPages, currentPage });
};

export const action = async ({ request }: ActionFunctionArgs) => {
    await requireAccessToken(request);
    return redirect(`/tasks/new/edit`);
};

export default function Tasks() {
    const { tasks, count, skip, limit, totalPages, currentPage } = useLoaderData<typeof loader>();

    const getPageLinks = (totalPages: number, currentPage: number) => {
        const links = [];
        for (let i = 1; i <= totalPages; i++) {
            links.push(
                <li className={'page-item ' + (i === currentPage ? 'active' : '')}>
                    <Link to={`/tasks?page=${i}`} className="page-link">
                        {i}
                    </Link>
                </li>,
            );
        }
        return links;
    };

    return (
        <div className="col-lg-8 mx-auto p-4 py-md-5">
            <div className="mb-3 text-end">
                <Form method="post">
                    <div className="col">
                        <button type="submit" className="btn btn-outline-success">
                            <i className="bi bi-plus-circle"></i> Add a Task
                        </button>
                    </div>
                </Form>
            </div>
            <Outlet />
            <div className="mt-3">
                {tasks.length ? (
                    <>
                        <ul className="list-group">
                            {tasks.map((task) => (
                                <li className="list-group-item" key={task._id}>
                                    <NavLink
                                        className={({ isActive, isPending }) =>
                                            isActive ? 'active' : isPending ? 'pending' : ''
                                        }
                                        to={`${task._id}`}
                                    >
                                        {task.title}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        <nav aria-label="Page navigation example" className="mt-3">
                            <ul className="pagination">
                                <li className="page-item">
                                    <Link
                                        to={`/tasks?page=${currentPage - 1}`}
                                        className={
                                            'page-link ' + (currentPage === 1 ? 'disabled' : '')
                                        }
                                    >
                                        Previous
                                    </Link>
                                </li>
                                {getPageLinks(totalPages, currentPage)}
                                <li className="page-item">
                                    <Link
                                        to={`/tasks?page=${currentPage + 1}`}
                                        className={
                                            'page-link ' +
                                            (currentPage === totalPages ? 'disabled' : '')
                                        }
                                    >
                                        Next
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </>
                ) : (
                    <p>
                        <i>No tasks yet</i>
                    </p>
                )}
            </div>
        </div>
    );
}
