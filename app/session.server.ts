import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { getUserByAccessToken } from './user.server';

const USER_SESSION_KEY = 'accessToken';

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: '__session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets: process.env.SESSION_SECRET ? [process.env.SESSION_SECRET] : ['MY_TEST_SECRET'],
        secure: process.env.NODE_ENV === 'production',
    },
});

async function getSession(request: Request) {
    const cookie = request.headers.get('Cookie');
    return sessionStorage.getSession(cookie);
}

export async function logout(request: Request) {
    const session = await getSession(request);

    return redirect('/', {
        headers: {
            'Set-Cookie': await sessionStorage.destroySession(session),
        },
    });
}

export async function createUserSession({
    request,
    accessToken,
}: {
    request: Request;
    accessToken: string;
}) {
    const session = await getSession(request);
    session.set(USER_SESSION_KEY, accessToken);

    return redirect('/tasks', {
        headers: {
            'Set-Cookie': await sessionStorage.commitSession(session, {
                maxAge: 60 * 60 * 24 * 7, // 7 days,
            }),
        },
    });
}

export async function getAccessToken(request: Request): Promise<string | undefined> {
    const session = await getSession(request);
    const accessToken = session.get(USER_SESSION_KEY);
    // console.log('getAccessToken', accessToken);
    return accessToken;
}

export async function getUser(request: Request) {
    const accessToken = await getAccessToken(request);

    if (accessToken === undefined) {
        return null;
    }

    const user = await getUserByAccessToken(accessToken);

    if (user) {
        return user;
    }

    throw await logout(request);
}

export async function requireAccessToken(request: Request) {
    const accessToken = await getAccessToken(request);

    if (!accessToken) {
        throw redirect('/login');
    }

    return accessToken;
}
