import { Form } from '@remix-run/react';
import { createUserSession, getAccessToken } from '../session.server';
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { login, register } from '../user.server';

export default function Register() {
    return (
        <div id="detail">
            <Form method="post">
                <div>
                    <label htmlFor="email">
                        <span>Name</span>
                        <input id="name" required name="name" type="name" autoComplete="name" />
                    </label>
                </div>

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
