const injectMeetingControls = (webContents) => {
    const script = `
        function executeControl(action) {
            const url = window.location.href;

            // Google Meet Controls
            if (url.includes('meet.google.com')) {
                switch (action) {
                    case 'mute':
                        // Toggle mute/unmute (handles both states)
                        const muteBtn = document.querySelector('[aria-label="Turn off microphone"]') || 
                                       document.querySelector('[aria-label="Turn on microphone"]');
                        if (muteBtn) muteBtn.click();
                        break;
                    case 'video':
                        // Toggle video on/off
                        const videoBtn = document.querySelector('[aria-label="Turn off camera"]') || 
                                        document.querySelector('[aria-label="Turn on camera"]');
                        if (videoBtn) videoBtn.click();
                        break;
                    case 'share':
                        // Trigger screen sharing dialog
                        const shareBtn = document.querySelector('[aria-label="Present now"]');
                        if (!shareBtn) {
                            console.log("Share button not found");
                            return;
                        }
                        shareBtn.click();

                        // Step 2: Wait for the sharing tray to appear and select Window
                        setTimeout(() => {
                            // This is an educated guess - the exact aria-label might differ
                            const windowOption = document.querySelector('[aria-label*="window" i]') || 
                                            document.querySelector('[aria-label="Share a window"]') ||
                                            document.querySelector('[title="Window"]'); // Fallback to title attribute
                            
                            if (windowOption) {
                                windowOption.click();
                                console.log("Window sharing initiated");
                            } else {
                                console.log("Window option not found - check the sharing tray's aria-labels");
                                // Optional: Log all available options for debugging
                                const shareOptions = document.querySelectorAll('[aria-label]');
                                shareOptions.forEach(option => console.log(option.getAttribute('aria-label')));
                            }
                        }, 500)
                        break;
                    case 'hand':
                        // Toggle raise/lower hand
                        const handBtn = document.querySelector('[aria-label*="Raise hand"]') || 
                                       document.querySelector('[aria-label*="Lower hand"]');
                        if (handBtn) handBtn.click();
                        break;
                    case 'leave':
                        const leaveBtn = document.querySelector('[aria-label="Leave call"]');
                        if (leaveBtn) leaveBtn.click();
                        break;
                }
            } 
            // Microsoft Teams Controls
            else if (url.includes('teams.microsoft.com')) {
                switch (action) {
                    case 'mute':
                        const muteBtn = document.querySelector('[aria-label="Mute mic"]') ||
                                        document.querySelector('[aria-label="Unmute mic"]')
                        if (muteBtn) muteBtn.click();
                        break;
                    case 'video':
                        const videoBtn = document.querySelector('[aria-label="Turn camera on"]') ||
                                        document.querySelector('[aria-label="Turn camera off"]')

                        if (videoBtn) videoBtn.click();
                        break;
                    case 'share':
                        const shareBtn = document.querySelector('[data-tid="call-control-share"]');
                        if (shareBtn) {
                            shareBtn.click();
                            setTimeout(() => {
                                const screenShareBtn = document.querySelector('[data-tid="share-screen-option"]');
                                if (screenShareBtn) screenShareBtn.click();
                            }, 500);
                        }
                        break;
                    case 'hand':
                        const handBtn = document.querySelector('[aria-label="Raise"]');
                        if (handBtn) {
                            handBtn.click();
                        }
                        break;
                    case 'leave':
                        const leaveBtn = document.querySelector('[aria-label="Leave (Ctrl+Shift+H)"]');
                        if (leaveBtn) leaveBtn.click();
                        break;
                }
            } 
            // Zoom Controls
            else if (url.includes('zoom.us')) {
                switch (action) {
                    case 'mute':
                        const muteBtn = document.querySelector('[aria-label="mute my microphone"]') || 
                                       document.querySelector('[aria-label="unmute my microphone"]');
                        if (muteBtn) muteBtn.click();
                        break;
                    case 'video':
                        const videoBtn = document.querySelector('[aria-label="stop my video"]') || 
                                        document.querySelector('[aria-label="start my video"]');
                        if (videoBtn) videoBtn.click();
                        break;
                    case 'share':
                        const shareBtn = document.querySelector('[aria-label="Share Screen"]') || 
                                       document.querySelector('[aria-label="share screen"]');
                        if (shareBtn) {
                            shareBtn.click();
                            setTimeout(() => {
                                const screenOption = document.querySelector('#share-desktop-option') || 
                                                    document.querySelector('button:contains("Your Screen")');
                                if (screenOption) screenOption.click();
                            }, 500);
                        }
                        break;
                    case 'hand':
                        const handBtn = document.querySelector('[aria-label="Raise Hand"]') || 
                                       document.querySelector('[aria-label="Lower Hand"]');
                        if (handBtn) handBtn.click();
                        break;
                    case 'leave':
                        const leaveBtn = document.querySelector('[aria-label="Leave Meeting"]');
                        if (leaveBtn) leaveBtn.click();
                        break;
                }
            }
        }

        function autoJoin() {
            const url = window.location.href.toLowerCase(); // Normalize URL case
            console.log("Current URL:", url);

            // Shared polling function
            const pollForButton = (selector, textFilter, callback) => {
                const interval = setInterval(() => {
                    const buttons = document.querySelectorAll(selector);
                    const targetButton = Array.from(buttons).find(el => 
                        el.textContent.trim().toLowerCase().includes(textFilter.toLowerCase())
                    );
                    if (targetButton) {
                        targetButton.click();
                        clearInterval(interval);
                        if (callback) callback();
                    }
                }, 5000); // Poll every 500ms
            };

            // Google Meet
            if (url.includes('meet.google.com')) {
                console.log("Detected Google Meet");
                pollForButton('div[role="button"], button', 'join now', () => {
                    console.log("Successfully joined Google Meet");
                });
            }
            // Microsoft Teams
            else if (url.includes('teams.live.com') || url.includes('teams')) {
                console.log("Detected Microsoft Teams");
                pollForButton('[aria-label="Join now"], button[data-tid*="join"]', 'join', () => {
                    console.log("Successfully joined Teams");
                });
            }
            else {
                console.log("No supported meeting platform detected");
            }
        }

        // Run on page load and immediately
        window.addEventListener('load', autoJoin);
        autoJoin();
    `;

    webContents.executeJavaScript(script).catch((err) => console.error('Injection failed:', err));
};

module.exports = injectMeetingControls;