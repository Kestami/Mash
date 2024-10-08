<script setup lang="ts">

import { reactive } from 'vue';
import TutorialItem from '@classes/TutorialItem';

const tutorialItems: TutorialItem[] = reactive([]);

tutorialItems.push(new TutorialItem(
    "To add a new category, simply click the 'Add category' button at the top, and you'll see your new categories appear.",
    "./src/assets/add-category.gif"
));

tutorialItems.push(new TutorialItem(
    "The 'Auto setup' button will give you a predefined list of 4 categories to start you off!",
    "./src/assets/auto-setup.gif"
));

tutorialItems.push(new TutorialItem(
    "To add an item, click the + button in the category header.",
    "./src/assets/add-items.gif"
));

tutorialItems.push(new TutorialItem(
    "To edit an item, click the text and then edit it. You can save this by clicking away or hitting enter.",
    "./src/assets/edit-items.gif"
));

tutorialItems.push(new TutorialItem(
    "Once you've got at least 2 categories with 2 items in each (you can add as many as you want!) either you or your friend should hit start to begin drawing a swirl, and hit finish to start seeing your future!",
    "./src/assets/example-gameplay.gif"
));

tutorialItems.push(new TutorialItem(
    "If you don't have anyone to play with, you can check the 'Play against computer' option and the computer will choose when to stop the swirl.",
    "./src/assets/play-against-computer.gif"
));

</script>

<template>
    <div class="how-to-play-section">
        <h1>MASH!</h1>
        <h2>What is MASH?</h2>
        <p>MASH is a multiplayer paper-and-pencil game commonly played by children intended to
            predict one's future. The name is an acronym of "Mansion, Apartment, Shack/Street/Shed/Sewers/Swamp, and
            House". <a href="https://en.wikipedia.org/wiki/MASH_(game)" target="#">(Wikipedia)</a></p>
        <p>It's a fun little game to play with a friend (or a computer).</p>
        <h2>How to play:</h2>
        <p>The aim of the game is to add items to a list of categories, draw a spiral, count the number of loops in the
            spiral and then use that number as a counter for eliminating the items you've chosen.</p>
        <p>In order to start you'll need a minimum of 2 categories with at least 2 items in each, at which point you can
            start the game! Either yourself or a friend can hit the finish button early to stop the spiral drawing,
            moving onto the final scoring round.</p>
        <RouterLink to="/mash"><button>Play MASH!</button></RouterLink>
    </div>
    <div class="how-to-play-section">
        <h2>Tutorials</h2>
        <template v-for="(item, index) in tutorialItems" :key="index">
            <article class="cards-container">
                <div class="card-inner">
                    <div class="gif-container">
                        <img :src="item.gifLocation" />
                    </div>
                    <div class="text-container left">{{ item.text }}</div>
                </div>
            </article>
        </template>
    </div>
</template>

<style scoped>

.how-to-play-section{
    padding:8px;
}

.cards-container {
    margin-top: 24px;
}

.card-inner {
    position: relative;
    align-items: center;
    display: flex;
    justify-content: center;
}

.gif-container {

    display: inline-block;
    flex-basis: 60%;
    flex-grow: 0;
    transition: transform 0.3s ease, box-shadow 0.3s;

    & img{
        width:100%;
    }

    &:hover {
        transform: scale(1.5);
        z-index: 999;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    }
}

.text-container {
    flex-basis: 40%;
    flex-grow: 0;

    &.left {
        margin-left: 8px;
    }
}
</style>