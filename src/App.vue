<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
body,
html {
  min-height: 100vh;
  background-image: url('./assets/busy-desk.jpg');
  background-color: transparent;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-size: 100% auto;
  margin: 0;
  min-width: 970px;
  padding: 0;
}

body {
  overflow: hidden;
}

.app {
  height: 100vh;
  width: 100%;
}

.router-view {
  width: 100%;
  height: 100%;
}

@media only screen and (max-width: 600px) {
  body,
  html {
    background-image: url('./assets/busy-desk.jpg');
    background-color: transparent;
    background-position-x: -20rem;
    background-repeat: no-repeat;
    background-size: auto 100%;
    margin: 0;
    min-width: 0;
    object-fit: cover;
    // overflow: scroll;
    padding: 0;
  }

  .app {
    min-height: 100vh;
    width: 100%;
  }
}
</style>
