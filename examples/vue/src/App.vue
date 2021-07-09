<template>
  <div>
    {{ parsed }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { parseHocon } from '@tkint/hocon-parser';

export default defineComponent({
  name: 'App',
  setup() {
    const hocon = 'hello = "world"';
    const parsed = parseHocon(hocon);

    return {
      parsed,
    };
  },
});


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
