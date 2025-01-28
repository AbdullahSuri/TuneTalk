// import nconf from 'nconf';
// import path from 'path';

// nconf.file({ file: path.resolve('./.env') }); 

// export const DSN = nconf.get('DSN');
// export const PORT = nconf.get('PORT');
// export const SPOTIFY_CLIENT_ID = nconf.get('SPOTIFY_CLIENT_ID');
// export const SPOTIFY_CLIENT_SECRET = nconf.get('SPOTIFY_CLIENT_SECRET');
import { config } from 'dotenv';
config();