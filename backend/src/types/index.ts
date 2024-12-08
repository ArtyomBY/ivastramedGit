import { Request } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        email: string;
    };
}

export interface DatabaseResult extends RowDataPacket {}

export interface QueryResult extends ResultSetHeader {}
