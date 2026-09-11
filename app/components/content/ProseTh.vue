<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <th
    :class="
      cn(
        'px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right',
        props.class,
      )
    "
  >
    <slot />
  </th>
</template>
