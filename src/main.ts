import Phaser from 'phaser';
import { QuantityScene } from './scenes/QuantityScene';
import { EndGameScene } from './scenes/EndGameScene';
import { initRotateOrientation } from './rotateOrientation';



declare global {
    interface Window {
        compareScene: any;
    }
}
const DPR = Math.min(2, window.devicePixelRatio || 1); // tránh quá nặng trên máy yếu


const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#ffffff',
    scene: [QuantityScene, EndGameScene],
    scale: {
        mode: Phaser.Scale.FIT, // Canvas tự fit vào container
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: DPR, 
    },
    render: {
        pixelArt: false,
        antialias: true,
        transparent: true,
        roundPixels:true,
    },
};
const game = new Phaser.Game(config);


function updateUIButtonScale() {
    const container = document.getElementById('game-container')!;
    const resetBtn = document.getElementById('btn-reset') as HTMLImageElement;

    const w = container.clientWidth;
    const h = container.clientHeight;

    // base height = 720 (game design gốc)
    const scale = Math.min(w, h) / 720;

    const baseSize = 80; // kích thước nút thiết kế gốc (80px)
    const newSize = baseSize * scale;

    resetBtn.style.width = `${newSize}px`;
    resetBtn.style.height = 'auto';
}

export function showGameButtons() {
    const reset = document.getElementById('btn-reset');

    reset!.style.display = 'block';
}

export function hideGameButtons() {
    const reset = document.getElementById('btn-reset');

    reset!.style.display = 'none';
}

// Khởi tạo xoay màn hình
initRotateOrientation(game, {
    mainSceneKey: 'QuantityScene',
    overlaySceneKey: null,
});

// Scale nút
updateUIButtonScale();
window.addEventListener('resize', updateUIButtonScale);
window.addEventListener('orientationchange', updateUIButtonScale);

document.getElementById('btn-reset')?.addEventListener('click', () => {
    window.compareScene?.restartGame();
});
