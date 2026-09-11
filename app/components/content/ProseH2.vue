<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

// The classes below add spacing between elements when they are used together. For example, when a
// ProseH2 is followed by a ProseP, the ProseP gets mt-4. When followed by ProseSteps, it gets mt-0.

const siblingSpacingClass = "[&+]*:[code]:text-xl";
</script>

<template>
  <h2
    :class="
      cn(
        'mt-10 scroll-m-28 font-heading text-xl font-medium tracking-tight first:mt-0 lg:mt-16 [&+.steps]:mt-0! [&+.steps>h3]:mt-4! [&+h3]:mt-6! [&+p]:mt-4!',
        siblingSpacingClass,
        props.class,
      )
    "
  >
    <slot />
  </h2>
</template>
