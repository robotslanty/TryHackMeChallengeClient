import {
    Form,
    Links,
    LiveReload,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react';

import appStylesHref from './app.css';
import { LinksFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import { getUser } from './session.server';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: appStylesHref }];

export async function loader({ request }: LoaderFunctionArgs) {
    return json({
        user: await getUser(request),
    });
}

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
            </body>
        </html>
    );
}
