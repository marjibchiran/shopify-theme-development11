document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector('[data-section-type="video-thumbnail-slider"]');
  if (!section) return;

  const videos = section.querySelectorAll(".video");
  const thumbs = section.querySelectorAll(".navigation li");
  const overlays = section.querySelectorAll(".video-overlay");

  const styles = getComputedStyle(section);
  const activeBorder = styles.getPropertyValue('--border-active').trim();
  const inactiveBorder = styles.getPropertyValue('--border-inactive').trim();

  let overlayTimers = [];

  const clearOverlaysAndTimers = () => {
    // Clear all pending timers
    overlayTimers.forEach(timer => {
      clearTimeout(timer);
    });
    overlayTimers = [];
    
    // Hide overlays smoothly
    overlays.forEach(o => {
      o.classList.remove("visible");
      o.style.pointerEvents = "none";
    });
  };

  const activateThumb = (thumb) => {
    const newVideoSrc = thumb.dataset.videoSrc;
    const buttonUrl = thumb.dataset.buttonUrl;

    // Update thumbnail states
    thumbs.forEach(t => {
      t.classList.remove("active");
      t.style.borderColor = inactiveBorder;
      t.style.opacity = '0.7';
      t.style.transform = '';
      t.style.marginInline = '10px';
    });

    // Set active thumbnail styles
    thumb.classList.add("active");
    thumb.style.borderColor = activeBorder;
    thumb.style.opacity = '1';
    thumb.style.transform = 'scale(1.1)';
    thumb.style.marginInline = '15px';

    // Clear previous overlays and timers
    clearOverlaysAndTimers();

    // Find and activate matching video
    let foundVideo = false;
    videos.forEach((video, index) => {
      const source = video.querySelector("source");
      
      if (source && source.src === newVideoSrc) {
        foundVideo = true;
        video.classList.add("loaded");
        video.currentTime = 0;

        // Attempt playback with mute fallback
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            video.muted = true;
            video.play();
          });
        }

        // Set overlay timer if overlay exists
        const overlay = overlays[index];
        if (overlay) {
          const timer = setTimeout(() => {
            if (video.classList.contains("loaded")) {
              overlay.classList.add("visible");
              overlay.style.pointerEvents = "auto";
            }
          }, 3000);
          overlayTimers.push(timer);
        }
      } else {
        video.classList.remove("loaded");
        video.pause();
      }
    });

    // Fallback for unmatched videos
    if (!foundVideo && videos.length > 0) {
      const fallbackVideo = videos[0];
      const source = fallbackVideo.querySelector("source");
      
      if (source) {
        source.src = newVideoSrc;
        fallbackVideo.load();
        
        fallbackVideo.addEventListener('loadeddata', function handler() {
          this.classList.add("loaded");
          
          const playPromise = this.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              this.muted = true;
              this.play();
            });
          }

          const overlay = overlays[0];
          if (overlay) {
            const timer = setTimeout(() => {
              if (this.classList.contains("loaded")) {
                overlay.classList.add("visible");
                overlay.style.pointerEvents = "auto";
              }
            }, 3000);
            overlayTimers.push(timer);
          }
          
          this.removeEventListener('loadeddata', handler);
        });
      }
    }
  };

  // Event listeners for thumbnails
  thumbs.forEach(thumb => {
    // Click handler
    thumb.addEventListener("click", () => activateThumb(thumb));
    
    // Keyboard accessibility
    thumb.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateThumb(thumb);
      }
    });
  });

  // Intersection Observer for video playback
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (!entry.isIntersecting) {
        video.pause();
      } else if (video.classList.contains("loaded")) {
        video.play().catch(() => {
          video.muted = true;
          video.play();
        });
      }
    });
  }, { threshold: 0.25 });

  // Observe all videos
  videos.forEach(video => observer.observe(video));

  // Initialize first thumb if active
  const firstActiveThumb = section.querySelector(".navigation li.active");
  if (firstActiveThumb) {
    activateThumb(firstActiveThumb);
  }
});