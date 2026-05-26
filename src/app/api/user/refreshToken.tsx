import axios from 'axios';

export async function refreshToken(localRefreshToken: string) {
    const baseURL = import.meta.env.VITE_MSS_API_URL;

    const response = await axios.post(`${baseURL}/refresh-token`, {
        refresh_token: localRefreshToken
    });


    const idToken = response.data.id_token;
    const refToken = response.data.refresh_token;
    const accessToken = response.data.access_token;

    if (idToken) {
        localStorage.setItem('token', idToken);
    }

    if (refToken) {
        localStorage.setItem('refresh_token', refToken);
    }

    if (accessToken) {
        localStorage.setItem('access_token', accessToken);
    }
}