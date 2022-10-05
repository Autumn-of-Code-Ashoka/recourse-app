<div class = "w-full h-full flex justify-center items-center md:col-span-3 2xl:col-span-4 gap-4">
    {#each new Array(5) as _, i}
        <div style:--i = {i}></div>
    {/each}
</div>

<style>
    div div
    {
        background: linear-gradient(to bottom right, theme("colors.accent-heavy"), theme("colors.accent-light"));
        background-size: 200% 200%;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        animation: bounce 0.9s ease-in-out infinite calc(var(--i) * 0.15s);
    }
    
    @keyframes bounce
    {
        0%
        {
            transform: translate(0, 0);
            background-position: 0% 0%;
        }
        
        50%
        {
            transform: translate(0, 10px);
            background-position: 100% 100%;
        }
        
        100%
        {
            transform: translate(0, 0);
            background-position: 0% 0%;
        }
    }
</style>