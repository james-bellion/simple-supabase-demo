import type { SupabaseClient } from '@supabase/supabase-js';

export type Todo = {
	id: number;
	description: string;
	user_id: string;
};

export async function fetchTodos(supabase: SupabaseClient, userId: string) {
	const { data, error } = await supabase.from('todos').select('*').eq('user_id', userId);
	return { data, error };
}

export async function addTodo(supabase: SupabaseClient, userId: string, description: string) {
	const { error } = await supabase.from('todos').insert([
		{ description, user_id: userId }
	]);
	return { error };
}

export async function deleteTodo(supabase: SupabaseClient, todoId: number) {
	const { error } = await supabase.from('todos').delete().eq('id', todoId);
	return { error };
}

export async function updateTodo(supabase: SupabaseClient, todoId: number, description: string) {
	const { error } = await supabase.from('todos').update({ description }).eq('id', todoId);
	return { error };
}

