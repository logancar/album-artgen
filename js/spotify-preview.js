class SpotifyPreview {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init() {
        // Get all input elements
        this.albumArtUpload = document.getElementById('albumArtUpload');
        this.albumTitle = document.getElementById('albumTitle');
        this.artistName = document.getElementById('artistName');
        
        // Get all display elements
        this.albumArtDisplay = document.getElementById('albumArt');
        this.albumTitleDisplay = document.getElementById('albumTitleDisplay');
        this.artistNameDisplay = document.getElementById('artistNameDisplay');
        this.previewContainer = document.getElementById('spotifyPreview');
    }

    bindEvents() {
        // Real-time updates for text inputs
        this.albumTitle.addEventListener('input', () => this.updatePreview());
        this.artistName.addEventListener('input', () => this.updatePreview());

        // Image upload handling
        this.albumArtUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.albumArtDisplay.src = e.target.result;
                    this.updatePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    updatePreview() {
        // Update text content
        this.albumTitleDisplay.textContent = this.albumTitle.value || 'Album Title';
        this.artistNameDisplay.textContent = this.artistName.value || 'Artist Name';

        // Add a subtle animation to show the update
        this.previewContainer.classList.add('updating');
        setTimeout(() => {
            this.previewContainer.classList.remove('updating');
        }, 300);
    }
}

// Initialize the preview
document.addEventListener('DOMContentLoaded', () => {
    window.spotifyPreview = new SpotifyPreview();
});

