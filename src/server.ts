import { createServer } from 'node:http';
import { app } from './api.js';

export const server = createServer(app);
