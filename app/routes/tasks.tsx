import {
    Form,
    Links,
    LiveReload,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useNavigation,
    useSubmit,
} from '@remix-run/react';

import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { useEffect } from 'react';
import { requireAccessToken } from '../session.server';
import { getTasks } from '../tasks.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await requireAccessToken(request);
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const tasks = await getTasks(request); // add search
    return json({ tasks, search });
};

export const action = async ({ request }: ActionFunctionArgs) => {
    await requireAccessToken(request);
    return redirect(`/tasks/new/edit`);
};

export default function Tasks() {
    const { tasks, search } = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const submit = useSubmit();
    const searching =
        navigation.location && new URLSearchParams(navigation.location.search).has('search');

    useEffect(() => {
        const searchField = document.getElementById('search');
        if (searchField instanceof HTMLInputElement) {
            searchField.value = search || '';
        }
    }, [search]);

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <div id="sidebar">
                    <h1>TryHackMe Tasks</h1>

                    <Form action="/logout" method="post">
                        <button type="submit">Logout</button>
                    </Form>

                    <div>
                        <Form
                            id="search-form"
                            role="search"
                            onChange={(event) => {
                                const isFirstSearch = search === null;
                                submit(event.currentTarget, {
                                    replace: !isFirstSearch,
                                });
                            }}
                        >
                            <input
                                id="search"
                                className={searching ? 'loading' : ''}
                                aria-label="Search tasks"
                                placeholder="Search"
                                defaultValue={search || ''}
                                type="search"
                                name="search"
                            />
                            <div aria-hidden hidden={!searching} id="search-spinner" />
                            <div id="search-spinner" aria-hidden hidden={true} />
                        </Form>
                        <Form method="post">
                            <button type="submit">New</button>
                        </Form>
                    </div>
                    <nav>
                        {tasks.length ? (
                            <ul>
                                {tasks.map((task) => (
                                    <li key={task._id}>
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
                        ) : (
                            <p>
                                <i>No contacts</i>
                            </p>
                        )}
                    </nav>
                </div>
                <div
                    className={navigation.state === 'loading' && !searching ? 'loading' : ''}
                    id="detail"
                >
                    <Outlet />
                </div>

                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
