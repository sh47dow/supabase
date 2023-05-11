// pages/_middleware.js
import { NextResponse } from 'next/server'

export function middleware(req) {
	if (req.nextUrl.pathname.startsWith('/api/v1')) {
		return NextResponse.rewrite(
			req.nextUrl.pathname.replace('/api/v1', `${process.env.MEMFIRE_CLOUD_API_URL}/api/v1`)
		)
	}
}
