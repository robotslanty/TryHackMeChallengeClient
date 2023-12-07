import axios from 'axios';

const apiUri = process.env.API_URI || '';

if (!apiUri) {
    throw new Error('No API URI');
}

export type User = {
    name: string;
    email: string;
};

export async function login(email: string, password: string) {
    try {
        const response = await axios.post(`${apiUri}/auth/login`, {
            email,
            password,
        });

        // console.log('AAA');
        // console.log(response.data);

        if (response.data.access_token) {
            return response.data.access_token;
        }
    } catch (e) {
        console.log(e);
    }

    return null;
}

export async function getUserByAccessToken(accessToken: string): Promise<User | undefined> {
    try {
        const response = await axios.get(`${apiUri}/users/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // console.log('BBB');
        // console.log(response.data);

        if (response.data._id) {
            return {
                name: response.data.name,
                email: response.data.email,
            };
        }
    } catch (e) {
        console.log(e);
    }
}
