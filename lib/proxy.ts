// lib/proxy.ts

import { jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-fallback-secret');

export interface DecodedToken extends JWTPayload {
    userId: string;
    role: 'student' | 'senior' | 'admin';
}

/**
 * Verifies the JWT token using the jose library (Edge-compatible).
 */
export async function verifyToken(token: string): Promise<DecodedToken | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as DecodedToken;
    } catch (error) {
        console.error('JWT Verification Failed:', error);
        return null;
    }
}
