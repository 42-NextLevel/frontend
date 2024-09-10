const REDIRECT_URI = 'http://localhost:3100/auth';
export const OAUTH_URI = `https://api.intra.42.fr/oauth/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
