<script setup lang="ts">

import { ref, reactive } from 'vue';
import Category from '@classes/Category';
import Item from '@classes/Item';
import { GameState } from '@classes/GameState';
import MashCategory from '@components/MashCategory.vue';
import Spiral from '@components/Spiral.vue';
import Modal from '@components/Modal.vue';

const spiral = ref<null | typeof Spiral>(null);
let categories: Category[] = reactive([]);
let errorModalOpened = ref(false);
let gameFinishedModalOpened = ref(false);
let validationMessages: string[] = reactive([]);
let currentGameState = ref<GameState>(GameState.Ready);
let autoSetup = ref(false);
let loopsDrawn = ref<number>(0);
let playAgainstComputer = ref(false);

setupInitialMASHCategory();
categories.push(new Category("Click + edit"));
categories.push(new Category("Click + edit"));

function setupInitialMASHCategory() {
    const mashStartCategory = new Category("Mash");
    mashStartCategory.isStartingMashCategory = true;
    mashStartCategory.items.push(new Item("M"));
    mashStartCategory.items.push(new Item("A"));
    mashStartCategory.items.push(new Item("S"));
    mashStartCategory.items.push(new Item("H"));
    categories.push(mashStartCategory);
}

function setupDefaultCategories() {
    categories = reactive([]);
    setupInitialMASHCategory();
    categories.push(new Category("Job"));
    categories.push(new Category("Car"));
    categories.push(new Category("Marriage"));
    categories.push(new Category("Kids"));

    autoSetup.value = true;
}

function handleAddItemToCategory(category: Category, itemName: string) {
    category.items.push(new Item(itemName));
}

function handlePlayAgainstComputerChanged(isChecked: boolean) {
    playAgainstComputer.value = isChecked;
}

function startGame() {
    //validate the game is ready to start
    validationMessages = reactive([]);

    if (categories.length < 3) {
        validationMessages.push(`You must have at least two categories added`)
    }

    categories.forEach(category => {
        if (category.items.length < 2) {
            validationMessages.push(`Category "${category.headerItem.name}" must have at least two items`)
        }
    });

    if (validationMessages.length > 0) {
        errorModalOpened.value = true;
    }
    else {
        spiral.value?.startDrawing();
        currentGameState.value = GameState.Drawing;
    }
}

function stopGame() {
    spiral.value?.stopDrawing();
    currentGameState.value = GameState.Scoring;
}

function restartGame() {
    spiral.value?.reset();
    categories = reactive([]);
    setupInitialMASHCategory();
    categories.push(new Category("Click + edit"));
    categories.push(new Category("Click + edit"));
    currentGameState.value = GameState.Ready;
}

function addCategory() {
    categories.push(new Category("Click + edit"));
}

async function handleSpiralFinished() {
    currentGameState.value = GameState.Scoring;
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    let categoryIndex = 0;
    let itemIndex = 0;
    let eliminationCounter = 0;

    while (categories.filter(x => !x.outOfGame).length >= 1) {
        const category = categories[categoryIndex];
        const item = category.items[itemIndex];

        //check if category is out of game
        if (category.outOfGame) {
            categoryIndex++;

            if (categoryIndex >= categories.length) {
                categoryIndex = 0;
            }

            itemIndex = 0;
            continue;
        }

        //if item already eliminated, increase counter and go to next
        if (item.isEliminated) {
            itemIndex++;
        }
        //eliminate if applicable and go next
        else if (eliminationCounter == loopsDrawn.value - 1) {
            item.isSelected = true;
            await new Promise(f => setTimeout(f, 1000));
            item.isSelected = false;
            item.isEliminated = true;
            eliminationCounter = 0;
            itemIndex++;
        }
        //else increase counters
        else {
            eliminationCounter++;
            itemIndex++;
            item.isSelected = true;

            await new Promise(f => setTimeout(f, 500));
            item.isSelected = false;
        }

        //if item is the last in the category, go to next category
        if (itemIndex >= category.items.length) {
            itemIndex = 0;
            categoryIndex++;
        }
        //if category is the last category, go back to first category
        if (categoryIndex >= categories.length) {
            categoryIndex = 0;
        }
    }

    currentGameState.value = GameState.Finished;
    gameFinishedModalOpened.value = true;
}

function handleUpdateLoopCount(loopCount: number) {
    loopsDrawn.value = loopCount;
}
</script>

<template>
    <div class="mash-header">
        <div>
            <button class="header-button" @click="addCategory" :disabled="currentGameState != GameState.Ready">Add
                category</button>
            <button class="header-button" @click="setupDefaultCategories"
                :disabled="currentGameState != GameState.Ready || autoSetup">Auto
                setup</button>
        </div>
        <div>
            <span v-for="(item, index) in categories.filter(x => x.isStartingMashCategory)[0].items" :key="index"
                :class="{ 'mash-start-letters item': true, 'selected': item.isSelected, 'eliminated': item.isEliminated }">{{
                    item.name }}</span>
        </div>
    </div>

    <div class="categories-container">
        <template v-for="(category, index) in categories.filter(x => !x.isStartingMashCategory)" :key="index">
            <MashCategory :category="category" :currentGameState="currentGameState"
                @addItemToCategory="handleAddItemToCategory"></MashCategory>
        </template>
    </div>

    <Spiral ref="spiral" :currentGameState="currentGameState" @spiralFinished="handleSpiralFinished"
        @updateLoopCount="handleUpdateLoopCount" @playAgainstComputerChanged="handlePlayAgainstComputerChanged">
    </Spiral>

    <div class="game-buttons-container">
        <button @click="startGame" :disabled="currentGameState != GameState.Ready">Start</button>
        <button @click="stopGame"
            :disabled="currentGameState != GameState.Drawing || loopsDrawn == 0 || playAgainstComputer">Finish!</button>
        <button @click="restartGame" :disabled="currentGameState != GameState.Finished">Restart</button>
    </div>

    <Modal :isOpen="errorModalOpened == true" @modal-close="errorModalOpened = false" name="error-modal">
        <template #header>Sorry!</template>
        <template #content>
            <p v-for="(message, index) in validationMessages" :key="index">{{ message }}</p>
        </template>
    </Modal>

    <Modal :isOpen="gameFinishedModalOpened == true" @modal-close="gameFinishedModalOpened = false"
        name="results-modal">
        <template #header>Here's your future!</template>
        <template #content>
            <template v-for="(category, index) in categories.filter(x => !x.isStartingMashCategory)" :key="index">
                <p v-for="(item, index) in category.items.filter(x => !x.isEliminated)" :key="index">{{
                    category.headerItem.name
                    }} : {{ item.name }}
                </p>
            </template>
        </template>
    </Modal>
</template>

<style scoped>
.categories-container {
    display: flex;
    flex-wrap: wrap;
    min-height: 320px;
}

.game-buttons-container {
    display: flex;
    justify-content: space-evenly;
}

.mash-header {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.mash-start-letters {
    display: inline-block;
    font-size: 48px;
    margin-left: 4px;
    min-width: 80px;
}

.header-button {
    margin: 8px 2px 8px 0;
}
</style>
