<script setup lang="ts">

import { GameState } from '@classes/GameState';
import Item from '@classes/Item';
import Category from '@classes/Category';
import { nextTick, useTemplateRef } from 'vue';

const props = defineProps<{
    category: Category,
    currentGameState: GameState
}>();

const emit = defineEmits<{
    (e: 'addItemToCategory', category: Category, itemName: string): void;
}>();

const editingInput = useTemplateRef("itemInput");

function addItem(category: Category, itemName: string) {
    emit('addItemToCategory', category, itemName);
}

function startEditing(item: Item) {
    if (props.currentGameState == GameState.Ready) {
        item.isEditingName = true;

        nextTick(() => {
            let htmlInput: HTMLInputElement | null = (editingInput.value instanceof Array)
                ? editingInput.value[0]
                : editingInput.value ?? null;

            htmlInput!.value = item.name;
            htmlInput!.focus();
        });
    }
};

function saveEdit(item: Item) {
    let htmlInput: HTMLInputElement | null = (editingInput.value instanceof Array)
        ? editingInput.value[0]
        : editingInput.value ?? null;

    if (htmlInput) {
        item.name = htmlInput.value;
        item.isEditingName = false;
    }
};

</script>

<template>
    <article class="category-container">
        <div class="category-header">
            <div class="category-title">
                <span v-if="!category.headerItem.isEditingName" @click="startEditing(category.headerItem)">
                    {{ category.headerItem.name }}
                </span>
                <input v-else @blur="saveEdit(category.headerItem)" @keyup.enter="saveEdit(category.headerItem)"
                    ref="itemInput" type="text" />
            </div>
            <div class="add-item-button">
                <button class="circular-button" :disabled="currentGameState != GameState.Ready"
                    @click="addItem(props.category, 'Click + edit')">+</button>
            </div>
        </div>
        <div class="category-body">
            <div v-for="(item, index) in category.items" :key="index" class="category-row">
                <span v-if="!item.isEditingName" @click="startEditing(item)"
                    :class="{ 'category-item': true, 'selected': item.isSelected, 'eliminated': item.isEliminated }">
                    {{ item.name }}
                </span>
                <input v-else @blur="saveEdit(item)" @keyup.enter="saveEdit(item)" ref="itemInput" type="text"
                    class="item-name-input" />
            </div>
        </div>
    </article>
</template>

<style scoped>
.category-container {
    flex: 48%;
    height: 300px;
    width: 300px;
    border-radius: 15px;
    margin: 5px;
    overflow: auto;
}

.category-header {
    border-bottom: 5px solid;
    padding: 0 0 12px 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    font-weight: bold;
}

.category-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%); 

    & input {
        margin-bottom:0;
        text-align-last: center;
        font-size:28px;
        font-weight:700;
    }
}

.category-row {
    padding-top: 8px;
}

.item-container {
    display: flex;
    justify-content: center;
}

.add-item-button {
    margin-left: auto;
}

.circular-button {
    border-radius: 14px;
}

.item-name-input {
    text-align-last: center;
    font-size: 21px;
    line-height: 18px;
    height: 32px;
    margin-bottom:0;
}

span.category-item {
    transition: font-size 0.5s ease;
}

span.category-item.selected {
    font-size: 30px;
    border-bottom: 3px solid;
}
</style>