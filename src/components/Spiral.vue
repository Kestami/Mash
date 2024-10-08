<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { GameState } from '@classes/GameState';

const spiralCanvas = ref<null | { getContext: (context: string) => CanvasRenderingContext2D }>(null);

let canvasContext: CanvasRenderingContext2D;
let canvasCenterX: number;
let canvasCenterY: number;
let currentX: number;
let currentY: number;
let drawingFrame = 0;
let isDrawing = false;
let loopsDrawn = ref(0);
let playAgainstComputer = ref(false);

defineProps<{
    currentGameState: GameState
}>();

const emit = defineEmits<{
    (e: 'spiralFinished'): void,
    (e: 'updateLoopCount', payload: number): void;
    (e: 'playAgainstComputerChanged', payload: boolean): void;
}>();

onMounted(() => {
    //Due to inner workings of Vue, spiralCanvas (from ref on markup) won't be null.
    canvasContext = spiralCanvas.value?.getContext('2d') as CanvasRenderingContext2D;
    canvasCenterX = canvasContext.canvas.width / 2;
    canvasCenterY = canvasContext.canvas.height / 2;
});

function playAgainstComputerChanged() {
    emit('playAgainstComputerChanged', playAgainstComputer.value);
}

function startDrawing() {

    //set up
    const totalDrawingFrames: number = 500;
    const totalLoopsToDraw: number = 0.1 * totalDrawingFrames / (2 * Math.PI);
    const computerLoopCount = Math.floor(Math.random() * (totalLoopsToDraw - 1 + 1) + 1);
    let currentLoopCount: number = 0;
    canvasContext.lineWidth = 8;
    canvasContext.moveTo(canvasCenterX, canvasCenterY);

    const colorChangeFrame: number = 3;

    var draw = () => {

        //change colour every x lines drawn
        if (drawingFrame % colorChangeFrame == 0) {
            let n = (Math.random() * 0xfffff * 1000000).toString(16);
            let newColour = '#' + n.slice(0, 6);
            canvasContext.strokeStyle = newColour;
        }

        if (drawingFrame >= totalDrawingFrames || isDrawing == false
            || (playAgainstComputer.value && loopsDrawn.value == computerLoopCount)) {
            emit('spiralFinished');
            return;
        }

        let a = 3;
        let b = 3;

        canvasContext.beginPath();

        if (currentX && currentY) canvasContext.moveTo(currentX, currentY);

        let angle = 0.1 * drawingFrame;
        let newX = canvasCenterX + (a + b * angle) * Math.cos(angle);
        let newY = canvasCenterY + (a + b * angle) * Math.sin(angle);

        // Each full loop corresponds to a 2π radian change
        let loops = angle / (2 * Math.PI);
        loopsDrawn.value = Math.floor(loops);

        //if we've hit a new integer for loops drawn, emit to parent
        let roundedLoopCount = Math.floor(loopsDrawn.value);
        if (roundedLoopCount > currentLoopCount) {
            currentLoopCount = roundedLoopCount;
            emit('updateLoopCount', currentLoopCount);
        }

        canvasContext.lineTo(newX, newY);
        canvasContext.stroke();

        currentX = newX;
        currentY = newY;
        drawingFrame++;
        requestAnimationFrame(draw);
    }

    isDrawing = true;
    draw();
}

function stopDrawing() {
    isDrawing = false;
}

function reset() {
    canvasContext.moveTo(canvasCenterX, canvasCenterY);
    isDrawing = false;
    drawingFrame = 0;
    currentX = 0;
    currentY = 0;
    loopsDrawn.value = 0;
    canvasContext.clearRect(0, 0, 300, 300);
}

defineExpose({
    startDrawing,
    stopDrawing,
    reset
});

</script>

<template>
    <article class="canvas-container">
        <canvas id="spiral-canvas" ref="spiralCanvas" width="300" height="300"></canvas>
    </article>
    <div class="spiral-footer">
        <label>
            <input type="checkbox" v-model="playAgainstComputer" @change="playAgainstComputerChanged"
                :disabled="currentGameState != GameState.Ready" name="play-against-computer" />
            Play against computer
        </label>
        <p>Loops drawn: {{ loopsDrawn }}</p>
    </div>
</template>

<style scoped>
#spiral-canvas {
    border: 5px solid;
    border-radius: 15px;
    width: 300px;
    height: 300px;
}

.canvas-container {
    border-radius: 15px;
    margin: 5px;
}

.spiral-footer {
    display: flex;
    justify-content: space-evenly;
}
</style>