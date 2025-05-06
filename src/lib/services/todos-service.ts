// Importing a wrapper function that adds logging functionality to a Supabase client,
// and the type for the wrapped client.
import { withLogging, type SupabaseLoggerClient } from '../api/supabase-logger';
import type { SupabaseClient } from '@supabase/supabase-js';

export type Todo = {
	id: number;
	description: string;
	user_id: string;
};

/**
 * Factory function to create the todos service using a Supabase client.
 * It wraps the client with logging capabilities before passing it to the base service.
 */
export function createTodosServiceFactory(
	client: SupabaseClient
): ReturnType<typeof createTodosServiceBase> {
	// Wrap the Supabase client with logging functionality.
	const wrapped = withLogging(client);

	// Create and return the base todos service using the wrapped client.
	return createTodosServiceBase(wrapped);
}

/**
 * Creates the actual todos service implementation using a logger-capable Supabase client.
 */
function createTodosServiceBase(client: SupabaseLoggerClient) {
	return {
		/**
		 * Fetch all todos for a specific user.
		 * @param userId - The ID of the user whose todos are to be fetched.
		 */
		fetchTodos: async (userId: string) => {
			return client.select('todos', { user_id: userId });
		},

		/**
		 * Add a new todo for a specific user.
		 * @param userId - The ID of the user.
		 * @param description - The description of the todo item.
		 */
		addTodo: async (userId: string, description: string) => {
			return client.insert('todos', [{ description, user_id: userId }]);
		},

		/**
		 * Delete a todo by its ID.
		 * @param todoId - The ID of the todo to delete.
		 */
		deleteTodo: async (todoId: number) => {
			return client.delete('todos', { id: todoId });
		},

		/**
		 * Update the description of a todo by its ID.
		 * @param todoId - The ID of the todo to update.
		 * @param description - The new description to set.
		 */
		updateTodo: async (todoId: number, description: string) => {
			return client.update('todos', { description }, { id: todoId });
		}
	};
}
