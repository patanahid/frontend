import { getUserFromEvent } from '$lib/server/auth'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const userObject = await getUserFromEvent(event)

	const pathname = event.url.pathname

	const allowedPath = [
		'/login',
		'/signup',
		'/api/login',
		'/api/signup',
	]

	if (allowedPath.includes(pathname)) {
		if (userObject) {
			throw redirect(303, '/')
		}
		const response = await resolve(event)

		return response
	}

	if (!userObject) {
		throw redirect(303, '/login')
	}

	event.locals.userObject = userObject

	const response = await resolve(event)

	return response
}
