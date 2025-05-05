<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';
	import {
		fetchTodos as fetchTodosService,
		addTodo as addTodoService,
		deleteTodo as deleteTodoService,
		updateTodo as updateTodoService,
		type Todo
	} from '$lib/services/todos-service';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
	$: email = $page.params.email;

	let todos: Todo[] = [];
	let newTodo = '';

	let editingId: number | null = null;
	let editingText = '';
	let editInputEl: HTMLInputElement | null = null;

	// Fetch todos
	async function fetchTodos() {
		if (!session?.user?.id) {
			console.error('No user session found');
			return;
		}

		const { data, error } = await fetchTodosService(supabase, session.user.id);
		if (error) {
			console.error('Error fetching todos:', error.message);
		} else {
			todos = data ?? [];
		}
	}

	onMount(() => {
		console.log('onMount triggered');
		fetchTodos();
	});

	// Add a new todo
	async function addTodo() {
		if (!newTodo.trim()) return;

		if (!session?.user?.id) {
			console.error('No user session available.');
			return;
		}

		const { error } = await addTodoService(supabase, session.user.id, newTodo);
		if (error) {
			console.error('Error adding todo:', error.message);
		} else {
			newTodo = '';
			await fetchTodos();
		}
	}

	// Delete a todo
	async function deleteTodo(id: number) {
		const { error } = await deleteTodoService(supabase, id);
		if (error) {
			console.error('Error deleting todo:', error.message);
		} else {
			await fetchTodos();
		}
	}

	// Start editing
	function startEditing(todo: Todo) {
		editingId = todo.id;
		editingText = todo.description;
		tick().then(() => {
			editInputEl?.focus();
		});
	}

	// Cancel editing
	function cancelEditing() {
		editingId = null;
		editingText = '';
	}

	// Update todo
	async function updateTodo() {
		if (!editingText.trim() || editingId === null) return;

		const { error } = await updateTodoService(supabase, editingId, editingText);
		if (error) {
			console.error('Error updating todo:', error.message);
		} else {
			cancelEditing();
			await fetchTodos();
		}
	}
</script>

<div class="min-h-screen px-4 pt-32 md:pt-20">
	<div class="hero-content flex h-full w-full flex-col items-center justify-center text-center">
		<div class="w-full max-w-md space-y-4">
			<h1 class="text-3xl font-bold break-words text-white sm:text-4xl">{email}'s Page</h1>

			<!-- Input to add a new todo -->
			<div class="flex flex-col gap-2 sm:flex-row">
				<input
					bind:value={newTodo}
					placeholder="Enter a new todo"
					class="input input-bordered w-full"
				/>
				<button
					type="button"
					class="btn preset-filled-success-500 w-full sm:w-auto"
					on:click={addTodo}>Add</button
				>
			</div>

			<!-- Todo list -->
			{#if todos.length > 0}
				<ul class="space-y-2 text-left">
					{#each todos as todo}
						<li
							class="flex flex-col items-center justify-center gap-2 rounded bg-white p-2 text-center shadow sm:flex-row sm:items-center sm:justify-between sm:text-left"
						>
							{#if editingId === todo.id}
								<div class="flex w-full flex-col gap-2 sm:flex-row">
									<input
										bind:this={editInputEl}
										bind:value={editingText}
										class="input input-bordered flex-1 text-black"
										on:keydown={(e) => e.key === 'Enter' && updateTodo()}
									/>
									<div
										class="flex items-center justify-center gap-2 sm:flex-row sm:justify-between"
									>
										<button
											on:click={updateTodo}
											type="button"
											class="btn preset-filled-success-500 text-sucess-500">Save</button
										>
										<button
											on:click={cancelEditing}
											type="button"
											class="btn preset-outlined-warning-500 text-warning-500">Cancel</button
										>
									</div>
								</div>
							{:else}
								<div class="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center">
									<span class="flex-1 text-black">{todo.description}</span>
									<div
										class="flex w-full items-center justify-center gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-between"
									>
										<button
											on:click={() => startEditing(todo)}
											type="button"
											class="btn preset-outlined-primary-500 text-primary-500">Edit</button
										>
										<button
											on:click={() => deleteTodo(todo.id)}
											type="button"
											class="btn preset-outlined-error-500 text-error-500">Delete</button
										>
									</div>
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				<p>No todos found</p>
			{/if}
		</div>
	</div>
</div>
