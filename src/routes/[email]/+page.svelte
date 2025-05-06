<script lang="ts">
	import { page } from '$app/stores';
	import { isLoadingStore } from '$lib/components/LoadingSpinnerOverlay.svelte';
	import type { Todo } from '$lib/services/todos-service';
	import { onMount, tick } from 'svelte';

	export let data;
	let { session, todosService } = data;
	$: ({ session, todosService } = data);
	$: email = $page.params.email;

	$: {
		console.log('Loading state:', $isLoadingStore); // Add logging to verify state changes
	}

	let todos: Todo[] = [];
	let newTodo = '';
	let editingId: number | null = null;
	let editingText = '';
	let editInputEl: HTMLInputElement | null = null;

	onMount(fetchTodos);

	//------------Helper functions to make the API calls -------------//

	// TODO: Could improve by avoid making multiple fetch API calls after making changes.
	// store state and only refetch when navigating to or refreshing the page.
	// update table to include and order number of Todos.

	/**
	 * Local fetch to keep data in sync
	 */
	async function fetchTodos() {
		if (!session?.user?.id) return;

		$isLoadingStore = true;
		const { data, error } = await todosService.fetchTodos(session.user.id);
		$isLoadingStore = false;
		if (error) {
			console.error('Error fetching todos:', error.message);
		} else {
			todos = data ?? [];
		}
	}

	async function addTodo() {
		if (!newTodo.trim() || !session?.user?.id) return;

		$isLoadingStore = true;
		const { error } = await todosService.addTodo(session.user.id, newTodo);
		$isLoadingStore = false;
		if (error) {
			console.error('Error adding todo:', error.message);
		} else {
			newTodo = '';
			await fetchTodos();
		}
	}

	async function deleteTodo(id: number) {
		$isLoadingStore = true;
		const { error } = await todosService.deleteTodo(id);
		$isLoadingStore = false;
		if (error) {
			console.error('Error deleting todo:', error.message);
		} else {
			await fetchTodos();
		}
	}

	async function updateTodo() {
		if (!editingText.trim() || editingId === null) return;

		$isLoadingStore = true;
		const { error } = await todosService.updateTodo(editingId, editingText);
		$isLoadingStore = false;
		if (error) {
			console.error('Error updating todo:', error.message);
		} else {
			cancelEditing();
			await fetchTodos();
		}
	}

	//------------ edit ----------//

	function startEditing(todo: Todo) {
		editingId = todo.id;
		editingText = todo.description;
		tick().then(() => editInputEl?.focus());
	}

	function cancelEditing() {
		editingId = null;
		editingText = '';
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
			{/if}
		</div>
	</div>
</div>
