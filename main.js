document.addEventListener('DOMContentLoaded', () => {
    const AudioPlayer = document.getElementById('music-player');
    const Volume = 0.25;

    if (AudioPlayer) {
        AudioPlayer.volume = Volume;
        AudioPlayer.src = 'track.mp3'; 
    }

    function EnterSite() {
        const overlay = document.getElementById('enter-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            if (AudioPlayer) {
                AudioPlayer.play()
                    .then(() => console.log('Playing track: track.mp3'))
                    .catch(err => {
                        console.warn('Audio playback issue:', err);
                        console.warn("If using Chrome, ensure you've interacted with the page to allow autoplay.");
                    });
            }
        }
    }

    window.enterSite = EnterSite;
});
