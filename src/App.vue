<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
body,
html {
  height: 100vh;
  background-image: url('./assets/busy-desk.jpg');
  background-color: rgba(0, 0, 255, 0.5);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin: 0;
  overflow: hidden;
  padding: 0;
}

.app {
  height: 100vh;
  width: 100%;
}

.router-view {
  width: 100%;
  height: 100%;
}
</style>
