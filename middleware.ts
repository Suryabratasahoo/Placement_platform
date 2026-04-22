// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

// Define the JWT secret for the Edge runtime
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-fallback-secret');

export interface DecodedToken extends JWTPayload {
    userId: string;
    role: 'student' | 'senior' | 'admin';
}

// Inline token verification to avoid import issues in Edge
async function verifyToken(token: string): Promise<DecodedToken | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as DecodedToken;
    } catch (error) {
        console.error('Middleware JWT Verification Failed:', error);
        return null;
    }
}

const PROTECTED_PATHS = {
    '/student': 'student',
    '/senior': 'senior',
    '/admin': 'admin'
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the current path is a protected dashboard
    const requiredRoleEntry = Object.entries(PROTECTED_PATHS).find(([path]) => pathname.startsWith(path));

    if (requiredRoleEntry) {
        const [_, requiredRole] = requiredRoleEntry;
        const token = request.cookies.get('token')?.value;

        // 1. Check for token existence
        if (!token) {
            console.log(`Middleware: No token found for restricted path ${pathname}. Redirecting to /signin.`);
            return NextResponse.redirect(new URL('/signin', request.url));
        }

        // 2. Verify token and role
        const decoded = await verifyToken(token);
        
        if (!decoded || decoded.role !== requiredRole) {
            console.log(`Middleware: Invalid or unauthorized role (${decoded?.role}) for path ${pathname}. Redirecting to dashboard.`);
            
            if (decoded?.role === 'student') return NextResponse.redirect(new URL('/student', request.url));
            if (decoded?.role === 'senior') return NextResponse.redirect(new URL('/senior', request.url));
            if (decoded?.role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
            
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/student/:path*',
        '/senior/:path*',
        '/admin/:path*'
    ]
};
