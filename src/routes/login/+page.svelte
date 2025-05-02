<script lang="ts">
  export let data;
  import { Auth } from '@supabase/auth-ui-svelte';
  import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { goto } from '$app/navigation';


let { supabase, session } = data
$: ({ supabase, session } = data)

console.log(supabase)
console.log(session)

$: if(session) {
  goto("/")
}
</script>

<div class="min-h-screen bg-base-300 flex items-center justify-center px-4">
  <div class="flex flex-col items-center justify-center w-full max-w-md text-center space-y-6 bg-base-100 p-8 rounded-2xl shadow-xl">
    <h1 class="text-3xl font-bold text-primary">Welcome!</h1>
    <p class="text-base-content">
      Create an account or log in below to access your personal page.
    </p>

    <Auth
      supabaseClient={supabase}
      theme="dark"
      appearance={{
        theme: ThemeSupa,
        style: {
          input: 'width: 100%',
        },
      }}
    />
  </div>
</div>
