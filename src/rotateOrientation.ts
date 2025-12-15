// src/rotateOrientation.ts
import Phaser from 'phaser';
import type { HowlerAudioManager } from './assets/howler-manager/HowlerAudioManager'; // <-- sửa path đúng theo dự án bạn

// ================== STATE CHUNG ==================
let gameRef: Phaser.Game | null = null;
let bgmStarted = false;

let rotateOverlay: HTMLDivElement | null = null;
let isRotateOverlayActive = false;

// Howler audio
let audioRef: HowlerAudioManager | null = null;

let currentVoiceKey: string | null = null;
let pendingQuestionKey: string | null = null;

let lastRotateVoiceTime = 0;
const ROTATE_VOICE_COOLDOWN = 1500; // ms

// ================== ƯU TIÊN VOICE ==================
function getVoicePriority(key: string): number {
    if (key.startsWith('drag_') || key.startsWith('q_')) return 1;
    if (key === 'voice_need_finish') return 2;
    if (key === 'sfx_correct' || key === 'sfx_wrong') return 3;
    if (
        key === 'voice_complete' ||
        key === 'voice_intro' ||
        key === 'voice_end' ||
        key === 'voice_rotate'
    ) {
        return 4;
    }
    return 1;
}

/**
 * Dùng HowlerAudioManager thay vì Phaser.Sound
 * - Khi overlay xoay đang bật: chỉ cho phép phát voice_rotate
 * - Có priority để tránh voice thấp đè voice cao
 */
export function playVoiceLocked(audio: HowlerAudioManager, key: string): void {
    // Nếu đang cần xoay ngang -> chỉ cho phép voice_rotate
    if (isRotateOverlayActive && key !== 'voice_rotate') {
        // lưu lại câu hỏi để phát lại sau khi xoay xong
        // if (!pendingQuestionKey && key.startsWith("q_")) pendingQuestionKey = key;
        pendingQuestionKey = key;
        return;
    }

    const newPri = getVoicePriority(key);
    const curPri = currentVoiceKey ? getVoicePriority(currentVoiceKey) : 0;

    // Nếu đang có voice "ưu tiên cao hơn hoặc bằng" thì bỏ qua voice mới
    if (currentVoiceKey && curPri >= newPri && currentVoiceKey !== key) return;

    // Stop voice hiện tại rồi play voice mới
    audio.stopAllVoices();
    currentVoiceKey = key;

    audio.play(key, {
        stopSame: true,
        onEnd: () => {
            if (currentVoiceKey === key) currentVoiceKey = null;
        },
    });
}

// ================== UI OVERLAY XOAY NGANG ==================
function ensureRotateOverlay() {
    if (rotateOverlay) return;

    rotateOverlay = document.createElement('div');
    rotateOverlay.id = 'rotate-overlay';
    rotateOverlay.style.position = 'fixed';
    rotateOverlay.style.inset = '0';
    rotateOverlay.style.zIndex = '9999';
    rotateOverlay.style.display = 'none';
    rotateOverlay.style.alignItems = 'center';
    rotateOverlay.style.justifyContent = 'center';
    rotateOverlay.style.textAlign = 'center';
    rotateOverlay.style.background = 'rgba(0, 0, 0, 0.6)';
    rotateOverlay.style.padding = '16px';
    rotateOverlay.style.boxSizing = 'border-box';

    const box = document.createElement('div');
    box.style.background = 'white';
    box.style.borderRadius = '16px';
    box.style.padding = '16px 20px';
    box.style.maxWidth = '320px';
    box.style.margin = '0 auto';
    box.style.fontFamily =
        '"Fredoka", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    box.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';

    const title = document.createElement('div');
    title.textContent = 'Bé Hãy Xoay Ngang Màn Hình Để Chơi Nhé 🌈';
    title.style.fontSize = '18px';
    title.style.fontWeight = '700';
    title.style.marginBottom = '8px';
    title.style.color = '#222';

    box.appendChild(title);
    rotateOverlay.appendChild(box);
    document.body.appendChild(rotateOverlay);
}

// ================== CORE LOGIC XOAY + ÂM THANH ==================
function tryPlayRotateVoice() {
    if (!audioRef) return;

    const now = Date.now();
    if (now - lastRotateVoiceTime < ROTATE_VOICE_COOLDOWN) return;
    lastRotateVoiceTime = now;

    // iOS cần gesture: vì vậy hàm này sẽ được gọi cả từ pointerdown nữa
    playVoiceLocked(audioRef, 'voice_rotate');
}

function updateRotateHint() {
    ensureRotateOverlay();
    if (!rotateOverlay) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const shouldShow = h > w && w < 768; // portrait & nhỏ

    const overlayWasActive = isRotateOverlayActive;
    isRotateOverlayActive = shouldShow;

    const overlayTurnedOn = !overlayWasActive && shouldShow;
    const overlayTurnedOff = overlayWasActive && !shouldShow;

    rotateOverlay.style.display = shouldShow ? 'flex' : 'none';

    if (!audioRef) return;

    if (overlayTurnedOn) {
        // ✅ Lưu lại voice đang chạy (hướng dẫn tô / câu hỏi) để xoay xong phát lại
        // (đừng lưu voice_rotate)
        if (currentVoiceKey && currentVoiceKey !== 'voice_rotate') {
            pendingQuestionKey = currentVoiceKey;
        }

        // ✅ Đừng reset pendingQuestionKey ở đây nữa (đây là bug của bạn)
        // pendingQuestionKey = null;

        // Khi bắt xoay: dừng hết để chỉ còn bgm + (có thể) voice_rotate
        audioRef.stopAllExceptBgm('bgm_quantity');

        // reset state hiện tại
        currentVoiceKey = null;

        // Nếu bạn muốn auto nhắc xoay thì để; nếu không muốn chồng tiếng thì chỉ phát khi tap (pointerdown)
        // tryPlayRotateVoice();
    }

    if (overlayTurnedOff) {
        audioRef.stopAllExceptBgm('bgm_quantity');
        currentVoiceKey = null;

        // ✅ bật BGM sau khi xoay ngang xong
        if (!bgmStarted) {
            audioRef.playBgm('bgm_quantity');
            bgmStarted = true;
        }

        // ✅ phát lại prompt/câu hỏi đã lưu
        if (pendingQuestionKey) {
            playVoiceLocked(audioRef, pendingQuestionKey);
            pendingQuestionKey = null;
        }
    }
}

// ================== KHỞI TẠO HỆ THỐNG XOAY ==================
export function initRotateOrientation(
    game: Phaser.Game,
    options: {
        audio: HowlerAudioManager; // ✅ bắt buộc truyền vào
        overlaySceneKey?: string | null; // giữ cho tương thích nếu bạn còn dùng chỗ khác
        mainSceneKey?: string; // giữ cho tương thích nếu bạn còn dùng chỗ khác
    }
) {
    gameRef = game;
    audioRef = options.audio;

    ensureRotateOverlay();
    updateRotateHint();

    window.addEventListener('resize', updateRotateHint);
    window.addEventListener('orientationchange', updateRotateHint as any);

    // ✅ Quan trọng cho iOS: gesture thật để phát được âm
    window.addEventListener('pointerdown', () => {
        if (!isRotateOverlayActive) return;
        tryPlayRotateVoice();
    });
}
