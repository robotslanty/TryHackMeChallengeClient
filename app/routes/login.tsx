import { Form, Link } from '@remix-run/react';
import { createUserSession, getAccessToken } from '../session.server';
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { login } from '../user.server';

export default function LoginPage() {
    return (
        <div id="detail">
            <p>
                No account? <Link to="/register">Register here</Link>
            </p>
            <Form method="post">
                <div>
                    <label htmlFor="email">
                        <span>Email address</span>
                        <input id="email" required name="email" type="email" autoComplete="email" />
                    </label>
                </div>

                <div>
                    <label htmlFor="password">
                        <span>Password</span>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                        />
                    </label>
                </div>

                <button type="submit">Log in</button>
            </Form>
        </div>
    );
}

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
