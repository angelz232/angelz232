// Audio files list
const audioFiles = [
    { src: "https://files.catbox.moe/fo805m.mp3", artist: "Ken Karson, Destroy Lonely", song: "Murda Musik" },
    { src: "https://files.catbox.moe/vlohr2.mp3", artist: "22Gz", song: "Twirlanta" },
    { src: "https://files.catbox.moe/gbztbw.mp3", artist: "BigXthaPlug", song: "Mmhmm" },
    { src: "https://files.catbox.moe/ebvch3.mp3", artist: "Jdot Breezy", song: "Tweak Shit, Pt. 2" },
    { src: "https://files.catbox.moe/xo4vuv.mp3", artist: "Jdot Breezy", song: "Shoot It Out" }
];

// Initialize audio element with the first track
let currentTrack = 0;
const music = new Audio(audioFiles[currentTrack].src);
music.muted = false;  // Ensure audio is not muted
music.preload = "auto";  // Preload for smooth playback

// Toggle play/pause on music
function toggleMusic() {
    if (music.paused) {
        music.play()
            .then(() => {
                console.log(`Now playing: ${audioFiles[currentTrack].artist} - ${audioFiles[currentTrack].song}`);
            })
            .catch(error => console.error("Playback failed:", error));
    } else {
        music.pause();
    }
}

// Add event listeners for click and touchstart to trigger toggleMusic
document.body.addEventListener("click", toggleMusic);
document.body.addEventListener("touchstart", toggleMusic);

// Auto-play next track when the current one ends
music.addEventListener("ended", () => {
    currentTrack = (currentTrack + 1) % audioFiles.length;
    music.src = audioFiles[currentTrack].src;
    music.play()
        .then(() => {
            console.log(`Now playing: ${audioFiles[currentTrack].artist} - ${audioFiles[currentTrack].song}`);
        })
        .catch(error => console.error("Playback failed:", error));
});
