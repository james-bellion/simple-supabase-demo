// +page.ts
// This `load` function runs on both the server and the client when the route loads.
// It retrieves the Supabase client and the user session from the parent layout via `parent()`.
// Then, it uses the Supabase client to create an instance of `todosService`, which contains all
// the methods needed to fetch, add, update, and delete todos.
// Both `session` and `todosService` are returned as props and made available to the page component (`+page.svelte`).

import { createTodosServiceFactory } from '$lib/services/todos-service';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, session } = await parent();

	const todosService = createTodosServiceFactory(supabase);

	return {
		session,
		todosService
	};
};

