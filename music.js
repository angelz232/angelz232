const audioFiles = [
    { src: "https://files.catbox.moe/cqawfd.mp3" },
];

let currentTrack = 0;
const music = new Audio(audioFiles[currentTrack].src);
music.muted = false;
music.preload = "auto";

let hasPlayed = false; // Flag to check if music has already started playing

// Play music on first screen press and remove event listeners
function playMusicOnce() {
    if (!hasPlayed) {
        music.play()
            .then(() => {
                console.log("Now playing:", audioFiles[currentTrack].src);
                hasPlayed = true; // Set the flag to true to prevent toggling
            })
            .catch(error => console.error("Playback failed:", error));

        // Remove event listeners after first play
        document.body.removeEventListener("click", playMusicOnce);
        document.body.removeEventListener("touchstart", playMusicOnce);
    }
