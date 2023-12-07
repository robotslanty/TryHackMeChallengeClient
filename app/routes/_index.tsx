import { Link } from '@remix-run/react';

import { useOptionalUser } from '~/utils';

export default function Index() {
    const user = useOptionalUser();

    if (user) {
        return (
            <>
                <h1>Welcome, {user.name}</h1>
                <Link to="/tasks">View tasks</Link>
            </>
        );
    }

    return (
        <>
            <h1>Sorry, nothing to see here 👀</h1>
            <Link to="/login">Log In</Link>
        </>
    );
}
