<script>
    let username = '';
    let password = '';

    async function updateSettings(event) {
        event.preventDefault();

        // Update the settings on the server
        // This is just a placeholder - replace with your actual code
        await fetch('/api/update-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
    }
</script>

<form on:submit={updateSettings}>
    <label class="label">
        <span>Username</span>
        <input class="input" type="text" placeholder="username" bind:value={username} />
    </label>

    <label class="label">
        <span>Password</span>
        <input class="input" type="password" bind:value={password} />
    </label>

    <button type="button" class="btn variant-filled">Update settings</button>
</form>