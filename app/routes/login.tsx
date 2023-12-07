import { Form, Link } from '@remix-run/react';
import { createUserSession, getAccessToken } from '../session.server';
import {
    ActionFunctionArgs,
    LinksFunction,
    LoaderFunctionArgs,
    json,
    redirect,
} from '@remix-run/node';
import { login } from '../user.server';
import styles from '../styles/login.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const accessToken = await getAccessToken(request);
    if (accessToken) return redirect('/tasks');
    return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
        throw redirect('/login');
    }

    const accessToken = await login(email, password);

    if (!accessToken) {
        throw redirect('/login');
    }

    return createUserSession({
        request,
        accessToken,
    });
};

export default function LoginPage() {
    return (
        <main className="form-signin w-100 m-auto">
            <p>
                No account? <Link to="/register">Register here</Link>
            </p>
            <Form method="post">
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                <div className="form-floating">
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                    />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <button className="btn btn-primary w-100 py-2" type="submit">
                    Sign in
                </button>
            </Form>
        </main>
    );
}
