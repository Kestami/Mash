<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from '@vueuse/core';

defineProps<{
    isOpen: boolean
}>();

const emit = defineEmits(["modal-close"]);

const target = ref(null);
onClickOutside(target, () => emit('modal-close'));

</script>

<template>
    <dialog :open="isOpen">
        <article ref="target">
            <h2>
                <slot name="header"> default header </slot>
            </h2>
            <p>
                <slot name="content"> default content </slot>
            </p>
            <footer>
                <slot name="footer">
                        <div>
                            <button @click.stop="emit('modal-close')">OK</button>
                        </div>
                    </slot>
            </footer>
        </article>
    </dialog>

</template>
