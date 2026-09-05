import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root of the project
dotenv.config({ path: path.join(__dirname, '../../../.env') });
