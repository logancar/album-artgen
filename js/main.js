// Theme switching and navigation functions
function switchTheme(theme) {
    const landingPage = document.getElementById('landingPage');
    const mainApp = document.getElementById('mainApp');
    
    landingPage.classList.add('hidden');
    mainApp.classList.remove('hidden');
    
    // Set the active theme
    document.body.className = `${theme}-theme`;
}

function showLanding() {
    const landingPage = document.getElementById('landingPage');
    const mainApp = document.getElementById('mainApp');
    
    landingPage.classList.remove('hidden');
    mainApp.classList.add('hidden');
}

function showHelp() {
    // Create and show help modal
    const helpModal = document.createElement('div');
    helpModal.className = 'help-modal';
    helpModal.innerHTML = `
        <div class="help-content">
            <h2>How to Use</h2>
            <p>1. Choose your preferred streaming platform style</p>
            <p>2. Upload your album artwork</p>
            <p>3. Enter album and artist details</p>
            <p>4. Customize colors and layout</p>
            <p>5. Download your creation</p>
            <button class="close-help" onclick="closeHelp()">Close</button>
        </div>
    `;
    document.body.appendChild(helpModal);
}

function closeHelp() {
    const helpModal = document.querySelector('.help-modal');
    if (helpModal) {
        helpModal.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const albumArtUpload = document.getElementById('albumArtUpload');
    const albumTitle = document.getElementById('albumTitle');
    const artistName = document.getElementById('artistName');
    const downloadBtn = document.getElementById('downloadBtn');
    const preview = document.getElementById('spotifyPreview');
    const albumTitleDisplay = document.getElementById('albumTitleDisplay');
    const artistNameDisplay = document.getElementById('artistNameDisplay');
    const albumArtDisplay = document.getElementById('albumArt');
    const addSongBtn = document.getElementById('addSong');
    const songListPreview = document.querySelector('.song-list-preview');
    const spotifySongList = document.getElementById('songList');
    let songCount = 1;

    // Update preview function
    function updatePreview() {
        albumTitleDisplay.textContent = albumTitle.value || 'Album Title';
        artistNameDisplay.textContent = artistName.value || 'Artist Name';
        
        // Add animation class
        preview.classList.add('updating');
        setTimeout(() => {
            preview.classList.remove('updating');
        }, 300);
    }

    // Bind events
    albumTitle.addEventListener('input', updatePreview);
    artistName.addEventListener('input', updatePreview);

    // Handle image upload
    albumArtUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                albumArtDisplay.src = e.target.result;
                
                // Create a temporary canvas to extract the dominant color
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    // Get color from the top portion of the image
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height/4).data;
                    let r = 0, g = 0, b = 0;
                    
                    // Calculate average color
                    for (let i = 0; i < imageData.length; i += 4) {
                        r += imageData[i];
                        g += imageData[i + 1];
                        b += imageData[i + 2];
                    }
                    
                    r = Math.floor(r / (imageData.length / 4));
                    g = Math.floor(g / (imageData.length / 4));
                    b = Math.floor(b / (imageData.length / 4));
                    
                    // Apply the color to the background
                    const albumBackground = document.querySelector('.album-background');
                    if (albumBackground) {
                        albumBackground.style.setProperty('--album-color', `rgba(${r}, ${g}, ${b}, 0.8)`);
                    }
                };
                img.src = e.target.result;
                
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    });

    // Download functionality
    downloadBtn.addEventListener('click', () => {
        html2canvas(preview).then(canvas => {
            const link = document.createElement('a');
            link.download = 'album-cover.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });

    function createSongElement(songNumber, songName = '') {
        return `
            <div class="song-item" data-song-number="${songNumber}">
                <div class="song-info">
                    <input type="text" class="song-title-input" 
                           placeholder="Enter song title" 
                           value="${songName}"
                           onchange="updateSongInPreview(${songNumber}, this.value)">
                    <input type="text" class="song-artist-input"
                           placeholder="Enter artist name"
                           onchange="updateSongArtistInPreview(${songNumber}, this.value)">
                    <button class="remove-song" onclick="removeSong(${songNumber})">×</button>
                </div>
            </div>
        `;
    }

    function createSongPreviewElement(songNumber, songName = '', mainArtist = '') {
        return `
            <div class="preview-song-item" data-song-number="${songNumber}">
                <div class="song-info">
                    <div class="song-text">
                        <div class="song-title-row">
                            <span class="song-title">${songName || 'Untitled Track'}</span>
                            <span class="more-options">•••</span>
                        </div>
                        <div class="song-artist">${mainArtist || 'Unknown Artist'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Add to global scope for onclick handlers
    window.updateSongInPreview = function(songNumber, songName) {
        const previewSong = spotifySongList.querySelector(`[data-song-number="${songNumber}"]`);
        if (previewSong) {
            const songTitle = previewSong.querySelector('.song-title');
            songTitle.textContent = songName || 'Untitled Track';
        }
    };

    window.updateSongArtistInPreview = function(songNumber, artistName) {
        const previewSong = spotifySongList.querySelector(`[data-song-number="${songNumber}"]`);
        if (previewSong) {
            const songArtist = previewSong.querySelector('.song-artist');
            songArtist.textContent = artistName || 'Unknown Artist';
        }
    };

    window.removeSong = function(songNumber) {
        const songItem = songListPreview.querySelector(`[data-song-number="${songNumber}"]`);
        const previewSong = spotifySongList.querySelector(`[data-song-number="${songNumber}"]`);
        
        if (songItem) songItem.remove();
        if (previewSong) previewSong.remove();
        
        // Reorder remaining songs
        updateSongNumbers();
    };

    function updateSongNumbers() {
        const songs = songListPreview.querySelectorAll('.song-item');
        const previewSongs = spotifySongList.querySelectorAll('.preview-song-item');
        
        songs.forEach((song, index) => {
            const newNumber = index + 1;
            song.dataset.songNumber = newNumber;
            song.querySelector('.song-number').textContent = newNumber;
            song.querySelector('.song-title-input').setAttribute('onchange', 
                `updateSongInPreview(${newNumber}, this.value)`);
        });

        previewSongs.forEach((song, index) => {
            song.dataset.songNumber = index + 1;
            song.querySelector('.song-number').textContent = index + 1;
        });

        songCount = songs.length + 1;
    }

    window.addSong = function() {
        const mainArtist = document.getElementById('artistName').value || 'Unknown Artist';
        songListPreview.insertAdjacentHTML('beforeend', createSongElement(songCount));
        spotifySongList.insertAdjacentHTML('beforeend', 
            createSongPreviewElement(songCount, 'Untitled Track', mainArtist));
        songCount++;
    };

    addSongBtn.addEventListener('click', window.addSong);
});




