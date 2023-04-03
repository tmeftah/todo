<template>
  <div class="todos">
    <main class="py-4">
      <RouterView></RouterView>
    </main>
  </div>
</template>

<style>
@import 'bulma/css/bulma.min.css';
.todos {
  max-width: 500px;
  padding: 20px;
  margin: 0 auto;
}

.line-through {
  text-decoration: line-through;
}
</style>
