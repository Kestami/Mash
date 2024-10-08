<template>
    <div class="top-bar">
        <nav>
            <RouterLink to="/">How to play</RouterLink>
            |
            <RouterLink to="/mash">Mash</RouterLink>
        </nav>
    </div>

    <main>
        <RouterView />
    </main>
</template>

<style scoped>
.top-bar {
    top: 0;
    margin: 10px 0 10px 0;
}
</style>
