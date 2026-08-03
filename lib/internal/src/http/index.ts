import axios from 'axios';
import https from 'https';
import http from 'http';

const instance = axios.create({
    httpsAgent: new https.Agent({ keepAlive: true }),
    httpAgent: new http.Agent({ keepAlive: true }),
    validateStatus: (status) => status >= 200 && status < 300,
    timeout: 30000,
});

export default instance;
