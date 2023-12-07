import { Form, Link } from '@remix-run/react';
import { createUserSession, getAccessToken } from '../session.server';
import {
    ActionFunctionArgs,
    LinksFunction,
    LoaderFunctionArgs,
    json,
    redirect,
} from '@remix-run/node';
import { register } from '../user.server';

import styles from '../styles/register.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const accessToken = await getAccessToken(request);
    if (accessToken) return redirect('/tasks');
    return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!name || !email || !password) {
        throw redirect('/register');
    }

    const accessToken = await register(name, email, password);

    if (!accessToken) {
        throw redirect('/register');
    }

    return createUserSession({
        request,
        accessToken,
    });
};

export default function Register() {
    return (
        <main className="form-signin w-100 m-auto">
            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
            <Form method="post">
                <h1 className="h3 mb-3 fw-normal">Please register</h1>
                <div className="form-floating">
                    <input
                        id="name"
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Your Name"
                    />
                    <label htmlFor="name">Name</label>
                </div>
                <div className="form-floating">
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="name@example.com"
                    />
                    <label htmlFor="email">Email address</label>
                </div>
                <div className="form-floating">
                    <input
                        id="password"
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <button className="btn btn-primary w-100 py-2" type="submit">
                    Sign in
                </button>
            </Form>
        </main>
    );
}
