// /src/electron/meeting-preload.js

(function () {
    window.executeControl = function (action) {
        const url = window.location.href;

        // === Google Meet ===
        if (url.includes('meet.google.com')) {
            switch (action) {
                case 'mute':
                    (document.querySelector('[aria-label="Turn off microphone"]') ||
                     document.querySelector('[aria-label="Turn on microphone"]'))?.click();
                    break;
                case 'video':
                    (document.querySelector('[aria-label="Turn off camera"]') ||
                     document.querySelector('[aria-label="Turn on camera"]'))?.click();
                    break;
                case 'hand':
                    (document.querySelector('[aria-label*="Raise hand"]') ||
                     document.querySelector('[aria-label*="Lower hand"]'))?.click();
                    break;
                case 'leave':
                    document.querySelector('[aria-label="Leave call"]')?.click();
                    break;
            }
        }

        // === Microsoft Teams ===
        else if (url.includes('teams.microsoft.com') || url.includes('teams')) {
            switch (action) {
                case 'mute':
                    (document.querySelector('[aria-label="Mute mic"]') ||
                     document.querySelector('[aria-label="Unmute mic"]'))?.click();
                    break;
                case 'video':
                    (document.querySelector('[aria-label="Turn camera on"]') ||
                     document.querySelector('[aria-label="Turn camera off"]'))?.click();
                    break;
                case 'leave':
                    document.querySelector('[aria-label="Leave (Ctrl+Shift+H)"]')?.click();
                    break;
            }
        }

        // === Zoom ===
        else if (url.includes('zoom.us')) {
            switch (action) {
                case 'mute':
                    (document.querySelector('[aria-label="mute my microphone"]') ||
                     document.querySelector('[aria-label="unmute my microphone"]'))?.click();
                    break;
                case 'video':
                    (document.querySelector('[aria-label="stop my video"]') ||
                     document.querySelector('[aria-label="start my video"]'))?.click();
                    break;
                case 'leave':
                    const leaveBtn = document.querySelector('[aria-label="Leave"]') ||
                                     document.querySelector('[aria-label="End"]');
                    if (leaveBtn) {
                        leaveBtn.click();
                        setTimeout(() => {
                            document.querySelector('.leave-meeting-options__btn--danger')?.click();
                        }, 1000);
                    }
                    break;
            }
        }

        // === Webex ===
        else if (url.includes('webex.com')) {
            switch (action) {
                case 'mute':
                    (document.querySelector('[aria-label*="unmuted"]') ||
                     document.querySelector('[aria-label*="muted"]'))?.click();
                    break;
                case 'video':
                    (document.querySelector('[aria-label*="video is currently disabled"]') ||
                     document.querySelector('[aria-label*="video is currently enabled"]'))?.click();
                    break;
                case 'hand':
                    (document.querySelector('[data-test="raise-hand-button"]') ||
                     document.querySelector('[data-test="lower-hand-button"]'))?.click();
                    break;
                case 'leave':
                    document.querySelector('[aria-label="Leave meeting"]')?.click();
                    setTimeout(() => {
                        document.querySelector('[data-key="leave-meeting"]')?.click();
                    }, 1000);
                    break;
            }
        }
    };

    function autoJoin() {
        const url = window.location.href.toLowerCase();
        console.log("AutoJoin running on:", url);

        const pollForButton = (selector, textFilter, callback) => {
            const interval = setInterval(() => {
                const buttons = document.querySelectorAll(selector);
                const target = Array.from(buttons).find(el =>
                    el.textContent.trim().toLowerCase().includes(textFilter.toLowerCase())
                );
                if (target) {
                    target.click();
                    console.log("Clicked:", textFilter);
                    clearInterval(interval);
                    if (callback) callback();
                }
            }, 3000);
        };

        if (url.includes('meet.google.com')) {
            pollForButton('div[role="button"], button', 'join now');
            pollForButton('div[role="button"], button', 'ask to join');
            pollForButton('div[role="button"], button', 'other ways to join');
            pollForButton('div[role="button"], button', 'join here too');
        } else if (url.includes('teams.live.com') || url.includes('teams')) {
            pollForButton('[aria-label="Join meeting from this browser"], button[data-tid*="joinOnWeb"]', 'continue');
            pollForButton('[aria-label="Join now"], button[data-tid*="join"]', 'join');
        } else if (url.includes('zoom.us')) {
            pollForButton('.preview-join-button, button[data-tid*="join"]', 'join');
        } else if (url.includes('webex.com')) {
            pollForButton('[aria-label="Join from browser"], div[role="button"], button', 'join');
            pollForButton('[data-test="join-button"]', 'join meeting');
        }
    }

    window.addEventListener("load", autoJoin);
    autoJoin();
})();
