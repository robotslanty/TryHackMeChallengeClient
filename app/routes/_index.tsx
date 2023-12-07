import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link } from '@remix-run/react';

import { useOptionalUser } from '~/utils';
import { getAccessToken } from '../session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const accessToken = await getAccessToken(request);
    if (accessToken) return redirect('/tasks');
    return redirect('/login');
};
