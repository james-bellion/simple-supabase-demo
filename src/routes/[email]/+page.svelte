<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { tick } from 'svelte';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
	$: email = $page.params.email;

	let todos: any[] = [];
	let newTodo = '';

	let editingId: number | null = null;
	let editingText = '';
	let editInputEl: HTMLInputElement | null = null;

	// Fetch todos
	async function fetchTodos() {
		if (!session?.user?.id) {
			console.error("No user session found");
			return;
		}

		const { data, error } = await supabase
			.from('todos')
			.select('*')
			.eq('user_id', session.user.id);

		if (error) {
			console.error('Error fetching todos:', error);
			return;
		}

		todos = data ?? [];
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

		const { error } = await supabase.from('todos').insert([
			{
				description: newTodo,
				user_id: session.user.id
			}
		]);

		if (error) {
			console.error('Error adding todo:', error);
		} else {
			newTodo = '';
			await fetchTodos();
		}
	}

	// Delete a todo
	async function deleteTodo(id: number) {
		const { error } = await supabase.from('todos').delete().eq('id', id);
		if (error) {
			console.error('Error deleting todo:', error);
		} else {
			await fetchTodos();
		}
	}

	function startEditing(todo: any) {
		editingId = todo.id;
		editingText = todo.description;
		tick().then(() => {
			editInputEl?.focus();
		});
	}

	function cancelEditing() {
		editingId = null;
		editingText = '';
	}

	async function updateTodo() {
		if (!editingText.trim() || editingId === null) return;

		const { error } = await supabase
			.from('todos')
			.update({ description: editingText })
			.eq('id', editingId);

		if (error) {
			console.error('Error updating todo:', error);
		} else {
			cancelEditing();
			await fetchTodos();
		}
	}
</script>

<div class="hero bg-base-300 min-h-screen pt-20">
	<div class="hero-content flex h-full w-full flex-col items-center justify-center text-center">
		<div class="max-w-md space-y-4">
			<h1 class="text-4xl font-bold text-black">{email}'s Page</h1>

			<!-- Input to add a new todo -->
			<div class="flex gap-2">
				<input
					bind:value={newTodo}
					placeholder="Enter a new todo"
					class="input input-bordered w-full"
				/>
				<button on:click={addTodo} class="btn btn-primary">Add</button>
			</div>

			<!-- Todo list -->
			{#if todos.length > 0}
				<ul class="space-y-2 text-left">
					{#each todos as todo}
						<li class="flex items-center justify-between rounded bg-white p-2 shadow gap-2">
							{#if editingId === todo.id}
								<input
									bind:this={editInputEl}
									bind:value={editingText}
									class="input input-bordered flex-1"
									on:keydown={(e) => e.key === 'Enter' && updateTodo()}
								/>
								<button on:click={updateTodo} class="btn btn-sm btn-success">Save</button>
								<button on:click={cancelEditing} class="btn btn-sm">Cancel</button>
							{:else}
								<span class="text-black flex-1">{todo.description}</span>
								<button on:click={() => startEditing(todo)} class="btn btn-sm btn-accent">Edit</button>
								<button on:click={() => deleteTodo(todo.id)} class="btn btn-sm btn-error">Delete</button>
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

