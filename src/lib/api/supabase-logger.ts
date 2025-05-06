import type { SupabaseClient } from '@supabase/supabase-js';

function logStyled(label: string, method: string, data: unknown) {
	const colors: Record<string, string> = {
		GET: 'background-color: #007acc; color: white;',
		POST: 'background-color: #28a745; color: white;',
		PUT: 'background-color: #ffc107; color: black;',
		DELETE: 'background-color: #dc3545; color: white;'
	};
	const style = colors[method] || 'background-color: gray; color: white;';
	console.debug(`%c[${label} - ${method}]%c`, `${style} padding: 2px 4px; border-radius: 2px;`, '', data);
}

export function withLogging(supabase: SupabaseClient) {
	return {
		select: async (table: string, filters: Record<string, any>) => {
			logStyled('REQUEST', 'GET', { table, filters });
			const response = await supabase.from(table).select('*').match(filters);
			logStyled('RESPONSE', 'GET', response);
			return response;
		},

		insert: async (table: string, values: any[]) => {
			logStyled('REQUEST', 'POST', { table, values });
			const response = await supabase.from(table).insert(values);
			logStyled('RESPONSE', 'POST', response);
			return response;
		},

		delete: async (table: string, filters: Record<string, any>) => {
			logStyled('REQUEST', 'DELETE', { table, filters });
			const response = await supabase.from(table).delete().match(filters);
			logStyled('RESPONSE', 'DELETE', response);
			return response;
		},

		update: async (table: string, values: Record<string, any>, filters: Record<string, any>) => {
			logStyled('REQUEST', 'PUT', { table, values, filters });
			const response = await supabase.from(table).update(values).match(filters);
			logStyled('RESPONSE', 'PUT', response);
			return response;
		}
	};
}

export type SupabaseLoggerClient = ReturnType<typeof withLogging>;


