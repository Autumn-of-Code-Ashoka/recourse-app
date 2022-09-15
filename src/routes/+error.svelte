<script lang="ts">
    import { page } from '$app/stores';
</script>

{$page.status}: {$page.status === 404 ? 'Page not found' : $page.error?.message}