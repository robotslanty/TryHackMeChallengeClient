import {
    Form,
    Link,
    Links,
    LiveReload,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useNavigation,
} from '@remix-run/react';

import appStyles from './app.css';
import { LinksFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import { getUser } from './session.server';
import { useOptionalUser } from './utils';

export const links: LinksFunction = () => [
    {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    },
    {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css',
    },
    {
        rel: 'stylesheet',
        href: appStyles,
    },
];

export async function loader({ request }: LoaderFunctionArgs) {
    return json({
        user: await getUser(request),
    });
}

export default function App() {
    const navigation = useNavigation();
    const user = useOptionalUser();

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>TryHackMe Dev Challenge</title>
                <Meta />
                <Links />
            </head>
            <body>
                <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                    <div className="container-fluid">
                        <Link to="/tasks" className="navbar-brand">
                            TryHackMe Tasks Challenge
                        </Link>
                        <div className="collapse navbar-collapse" id="navbarCollapse">
                            {user ? (
                                <Form action="/logout" method="post">
                                    <button type="submit" className="btn btn-sm btn-outline-danger">
                                        Logout
                                    </button>
                                </Form>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </nav>
                <div
                    className={'container ' + (navigation.state === 'loading' ? 'loading' : '')}
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
