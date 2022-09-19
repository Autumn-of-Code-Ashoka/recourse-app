<script lang="ts">
    import "../app.css";
    
    import Header from "./LayoutComponents/Header.svelte";
    import Sidebar from "./LayoutComponents/Sidebar.svelte";

</script>

<Header />
<div id = "layout-grid" class = "py-4 px-8 relative">
    <Sidebar />
    <main>
        <slot />
    </main>
    <div></div>
</div>

<style>
    #layout-grid 
    {
        display: grid;
        grid-template-columns: 1fr 2fr 0.1fr;
        column-gap: 48px;
    }

    main 
    {
        transition: all 0.3s ease-in-out;
    }

    @media only screen and (max-width: theme("screens.xl")) 
    {
        #layout-grid 
        {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
    }
</style>