document.addEventListener('DOMContentLoaded', () => {
    const AudioPlayer = document.getElementById('music-player');
    const Volume = 1;
    const tracks = ['track.mp3', 'track1.mp3', 'track2.mp3', 'track3.mp3', 'track4.mp3'];
    
    let currentTrackIndex = Math.floor(Math.random() * tracks.length); 

    if (AudioPlayer) {
        AudioPlayer.volume = Volume;
        AudioPlayer.src = tracks[currentTrackIndex];
    }

    function playNextTrack() {
        
        let nextTrackIndex;
        do {
            nextTrackIndex = Math.floor(Math.random() * tracks.length);
        } while (nextTrackIndex === currentTrackIndex);

        currentTrackIndex = nextTrackIndex;
        AudioPlayer.src = tracks[currentTrackIndex]; 
        AudioPlayer.play()
            .then(() => console.log('Playing track:', AudioPlayer.src))
            .catch(err => {
                console.warn('Audio playback issue:', err);
            });
    }

    window.enterSite = function() {
        const overlay = document.getElementById('enter-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            if (AudioPlayer) {
                AudioPlayer.play()
                    .then(() => console.log('Playing track:', AudioPlayer.src))
                    .catch(err => {
                        console.warn('Audio playback issue:', err);
                    });
            }
        }
    };

    if (AudioPlayer) {
        AudioPlayer.addEventListener('ended', playNextTrack);
    }

    const titles = ['#', '#D', '#DE', '#DEA', '#DEAD', '#DEAD$', '#DEAD$H', '#DEAD$HO', '#DEAD$HOT', '#DEAD$HOT', '#DEAD$HO', '#DEAD$H', '#DEAD$', '#DEAD', '#DEA', '#DE', '#D', '#'];
    let index = 0;

    function changeTitle() {
        document.title = titles[index];
        index = (index + 1) % titles.length;
        setTimeout(changeTitle, 200);
    }
    changeTitle();

    const nextParticle = new NextParticle({
        image: document.getElementById("logo"),
        width: window.innerWidth,
        height: window.innerHeight * 0.8,
        maxWidth: Math.min(window.innerWidth * 0.8, 400),
        particleGap: 4,
        velocity: 0.5,
        proximity: 100,
        mouseForce: 300,
        color: "#FFFFFF", 
    });

    function resizeParticle() {
        nextParticle.width = window.innerWidth;
        nextParticle.height = window.innerHeight * 0.8;
        nextParticle.maxWidth = Math.min(window.innerWidth * 0.8, 400);
        nextParticle.start();
    }

    window.onresize = resizeParticle;
    resizeParticle();
});
