const audioFiles = [
//    { src: "https://files.catbox.moe/fo805m.mp3", artist: "Ken Karson, Destroy Lonely", song: "Murda Musik" }, 
//    { src: "https://files.catbox.moe/vlohr2.mp3", artist: "22Gz", song: "Twirlanta" },
//    { src: "https://files.catbox.moe/ebvch3.mp3", artist: "Jdot Breezy", song: "Tweak Shit, Pt. 2" },
//    { src: "https://files.catbox.moe/xo4vuv.mp3", artist: "Jdot Breezy", song: "Shoot It Out" }, 
    { src: "https://files.catbox.moe/cqawfd.mp3", artist: "Shoreline Mafia", song: "Bands" },
];

let currentTrack = Math.floor(Math.random() * audioFiles.length);
const music = new Audio(audioFiles[currentTrack].src);
music.muted = false;  
music.preload = "auto";  

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

document.body.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMusic();
});
document.body.addEventListener("touchstart", (e) => {
    e.preventDefault();
    toggleMusic();
});

music.addEventListener("ended", () => {
    let nextTrack;
    do {
        nextTrack = Math.floor(Math.random() * audioFiles.length);
    } while (nextTrack === currentTrack);

    currentTrack = nextTrack;
    music.src = audioFiles[currentTrack].src;
    music.play()
        .then(() => {
            console.log(`Now playing: ${audioFiles[currentTrack].artist} - ${audioFiles[currentTrack].song}`);
        })
        .catch(error => console.error("Playback failed:", error));
});
