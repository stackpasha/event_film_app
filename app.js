/**
 * EVENT FILM - POV Gallery & Camera SPA Logic
 * Features:
 * - Multi-Event & Multi-Host State Engine (localStorage persisted)
 * - Guest Join validation & Host PIN login checks
 * - Host Create Event Modal Flow (Dynamic new rolls)
 * - WebRTC Webcam viewfinder capture with analog-style Canvas Filters
 * - Chemical development timer countdown simulation
 * - Web Audio API Camera shutter click & flash charger synthesizer
 * - JSZip export packager
 */

// --- SEED DATA (Used for fresh local storage initialization) ---
const INITIAL_PHOTOS = [
    {
        id: "mock-1",
        frameNumber: "01",
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeBesp8FU_mFTfMoCjvk-jduPQLIIIhJf8QMNPXZ0UYaMcF3ojVdk8njoQTcUWU2ryAkvoUK45H9dZHirtiZmgSet0M5WSdgX8CxNr4mC3hJ4gLCJip6bZnDMQkUgGzr5PFp9_MgaPdRpHBW-ZyvVXcWt3NJ7CNcY4rLTgsP62b60OG16aMltUZD3VDFjnlJEaUa3whoD-dMh8OCwSstNrHBUCol5eOix7b5JnVjrgu-5wvlnBbMB1SMs8HxK01kqmnp6f15YBmMw",
        status: "READY",
        developProgress: 0,
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hrs ago
        guestName: "Host"
    },
    {
        id: "mock-2",
        frameNumber: "02",
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRb8cdm4aRac95qmBAyEZZQlCUW7hhkmPEJxsfddqGL4tsSIVJnEwJA_oArkoDEzLjHVetgT-HOnVqWgJFHu6d8UbCLYNRT1S7W30lHJebyJuY8QVN_sVxmbHrIYMULksFlKcYesOf_wSQ1i_MMvauU231HWa_JXAmB61SDJxFt-UBMJd4xOe-PLLl2WdcCGNHhHA2wAaZ74rcyx_CAiaNhozG8Kn_z9j4ubGHUi-MHB8Y6J8WjWBZ_u_aMy8XHpHnFK_SMIA1Xoo",
        status: "DEVELOPING",
        developProgress: 165, // 2m 45s
        timestamp: new Date(Date.now() - 60000).toISOString(), // 1 min ago
        guestName: "You"
    },
    {
        id: "mock-3",
        frameNumber: "03",
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3lOpNsmBlSJH_SHQjj3fzWafsibOe9OLjbScHVN9xlQqteOtjuuhSktJ5oF2i6AhpAzDnk0JHJPcuHDoTtxSvJG7Ib6yJpcawxZzEl6ulkN0WIbRcuH22Wj4zEA2Fi7bRrhkBJQbqGZK76awOg-VT2_kt5efxbTwJcmPXAYqX65B_UEybG8ZlOZsZovV9vN5eNYu34elVE4tdxVU28PU-s85nBjtwfB8nbL_Q4B18ASd26GdXg0LKBbLzvT3Ha4LLwwd6xUPf6k8",
        status: "READY",
        developProgress: 0,
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        guestName: "Sarah Jenkins"
    },
    {
        id: "mock-4",
        frameNumber: "04",
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuChT86BtvajU_TrkpwGSzM1ByUZ1Mu8BHpzE9_gv0mfQPr3vdpUQmfI3DAeddoKlvUX2iZzPSa4MLgjfQ1dcBH7YizgmnDhcbGA8CPsmUj9ZA4Xir-dFMZmIIsus_7lQL1fxHRwhzQxl2hPpFowSRGEUSQtVc690V5lcdk-bdbwFgdi5F2ZdU6hVaL3cyZWecHnE_CimosPiVXLq7X92aPaDay9gX2VjG1bQi0WvRZOHk7gyKe_Ul90K8Dyk-u-J9bQCQCOy32iCOU",
        status: "DRYING",
        developProgress: 492, // 8m 12s
        timestamp: new Date(Date.now() - 120000).toISOString(),
        guestName: "Marcus Chen"
    },
    {
        id: "mock-5",
        frameNumber: "05",
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFRx0ACSxYfNHPNI1iRO4mlgLKtIgOxt5NCVsF5FKKrQbibzBZL1Io9hH47NmEWYBwNuLk_Ye7E9ypRpoj1485AGpJsGavIG6C-mRwLrjagaWyVFhZTNgVCNEazbfHxCxme2eVvDgORh6-U_rTAKM9MTBI0Iftp0YYQ8qAKcfSUyz9AFQfCDu0EB5KpVv7MOhiPhNHezXem15jEoNvc7uwwnqyIE1FDwoieLAGCEO-7qaNvVUwbjvBcHB9OhzEmfhCcEOvos2Wa8Q",
        status: "READY",
        developProgress: 0,
        timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
        guestName: "Leo Rodriguez"
    },
    {
        id: "mock-6",
        frameNumber: "06",
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqmhIOVkvhDFX50TYYl05JuxqInNk9PuPng2udMZfDyUskBd1azrSfbrd0an8oIfCOoY0z3WtgFjgj740bAU7h-uA2E3Z6vOF--XPZlYBSMS5P9U7QwWAGip9S_VkwYkRq1N9l1UZVJ8yxYYtFhWeoLtj_aV1g-9kyIRlcqsiwldyLFQSS95WXyN-MEWM_1Qikqle8F2C_xOoQLHPaVxO6pAhO2ebgWzveZLQtiXKB_cCqwQrZKLHinXoOn0CugF4s4ulTfRaDQJw",
        status: "READY",
        developProgress: 0,
        timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(),
        guestName: "Sarah Jenkins"
    },
    {
        id: "mock-7",
        frameNumber: "07",
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkmYLZy66SASLxNRqAXO5KULpN3Rb3GxyvTTlUX5-gzgnKcqZEGdqULtC3m0f6d71hIC9fK-uzKHAx-03KWzfK5nUHNQxtG4fqMU2vY35Zt1sO1wVpWoBHuXypUsYC-V8q5UOxKoZeOpxZNaOARA06h0aO3bj7igh_pvdiJhVwTiOe5WJNLWszBLgPE4eTmMlp7v7kmgMj8thWIXwi_TGf1Zf0D_7UYc79GCwBayuIPsza16_pxx96nWGPpnjoWiGZc_EU7_UMdXo",
        status: "DEVELOPING",
        developProgress: 82, // 1m 22s
        timestamp: new Date(Date.now() - 30000).toISOString(),
        guestName: "Marcus Chen"
    }
];

const PREDEFINED_SHUTTER_FALLBACKS = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCeBesp8FU_mFTfMoCjvk-jduPQLIIIhJf8QMNPXZ0UYaMcF3ojVdk8njoQTcUWU2ryAkvoUK45H9dZHirtiZmgSet0M5WSdgX8CxNr4mC3hJ4gLCJip6bZnDMQkUgGzr5PFp9_MgaPdRpHBW-ZyvVXcWt3NJ7CNcY4rLTgsP62b60OG16aMltUZD3VDFjnlJEaUa3whoD-dMh8OCwSstNrHBUCol5eOix7b5JnVjrgu-5wvlnBbMB1SMs8HxK01kqmnp6f15YBmMw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD3lOpNsmBlSJH_SHQjj3fzWafsibOe9OLjbScHVN9xlQqteOtjuuhSktJ5oF2i6AhpAzDnk0JHJPcuHDoTtxSvJG7Ib6yJpcawxZzEl6ulkN0WIbRcuH22Wj4zEA2Fi7bRrhkBJQbqGZK76awOg-VT2_kt5efxbTwJcmPXAYqX65B_UEybG8ZlOZsZovV9vN5eNYu34elVE4tdxVU28PU-s85nBjtwfB8nbL_Q4B18ASd26GdXg0LKBbLzvT3Ha4LLwwd6xUPf6k8",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAFRx0ACSxYfNHPNI1iRO4mlgLKtIgOxt5NCVsF5FKKrQbibzBZL1Io9hH47NmEWYBwNuLk_Ye7E9ypRpoj1485AGpJsGavIG6C-mRwLrjagaWyVFhZTNgVCNEazbfHxCxme2eVvDgORh6-U_rTAKM9MTBI0Iftp0YYQ8qAKcfSUyz9AFQfCDu0EB5KpVv7MOhiPhNHezXem15jEoNvc7uwwnqyIE1FDwoieLAGCEO-7qaNvVUwbjvBcHB9OhzEmfhCcEOvos2Wa8Q",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAqmhIOVkvhDFX50TYYl05JuxqInNk9PuPng2udMZfDyUskBd1azrSfbrd0an8oIfCOoY0z3WtgFjgj740bAU7h-uA2E3Z6vOF--XPZlYBSMS5P9U7QwWAGip9S_VkwYkRq1N9l1UZVJ8yxYYtFhWeoLtj_aV1g-9kyIRlcqsiwldyLFQSS95WXyN-MEWM_1Qikqle8F2C_xOoQLHPaVxO6pAhO2ebgWzveZLQtiXKB_cCqwQrZKLHinXoOn0CugF4s4ulTfRaDQJw"
];

// --- STATE MANAGER ---
class EventFilmApp {
    constructor() {
        this.loadState();
        this.initDOM();
        this.initAudio();
        this.initCamera();
        this.initTimers();
        this.bindEvents();
        this.render();
    }

    loadState() {
        const stored = localStorage.getItem('event_film_state_v2');
        if (stored) {
            try {
                this.state = JSON.parse(stored);
                // Auto-migration: if joined but role is missing, force logout to clean state
                if (this.state.isJoined && !this.state.userRole) {
                    this.state.isJoined = false;
                    this.state.currentEventCode = "SUMMER-24";
                }
            } catch (e) {
                console.error("State loading error, resetting to default", e);
                this.resetToDefaultState();
            }
        } else {
            this.resetToDefaultState();
        }
    }

    resetToDefaultState() {
        this.state = {
            isJoined: false,
            userRole: null, // 'guest' or 'host'
            currentEventCode: "SUMMER-24", // active joined event roll
            events: [
                {
                    code: "SUMMER-24",
                    name: "Summer Solstice 2024",
                    hostPin: "HOST-4921",
                    totalExposures: 36,
                    remainingFrames: 12,
                    photos: [...INITIAL_PHOTOS],
                    dashboardPhotoCountSeed: 1284,
                    guests: [
                        { id: 1, name: "Marcus Chen", joinedText: "JOINED 2M AGO", status: "LIVE", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAd9TFZNVeyjyK1DQABjuNMY6J50skC5jqKeyBTE8A2rFcsrtCMWV-u7wdFLealzEEXUQtwzQkjRVJPVRlUFSvm0iSTxflE0VykKmTyJXRoYAjhfLf4vSy-ofMOH24R8Jw5f89vOcTuqRTRajESzMn6PVXAPBqgyBiI7V-IRJOFXJMUry76Es5MJS9RpF_1uVu8g9vxaK0qTnxHFFYQs7wZ2R4dkKDtfYPozJlISM6y764ZsfQ92snm7wpF-E3nj2SQ-CTTYhU5_9k" },
                        { id: 2, name: "Sarah Jenkins", joinedText: "JOINED 15M AGO", status: "SYNCED", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AOeNQH9Nwo7nVotV8SCB2KR90vLsOFQCor5nYObY5zhJIWvKFyXjy0DZ5pWqliMhQoNiZlf_TG1kX_XaO1ryjRNKWnf0D-7njnl7x2TY7QSgD8jf8t-yMAIQDM8mKYccRg7MD9J6r5cTFR_XJXJefqvtYRHQezDidOcqoxDiCIcZmHyB0HHxQAmkgovrvggrV6I1cEF8HpxlEz5tZM-uO8lMTQd5vYbwpaQp4NKwnUOJ_-cxZnwci0dWVhkYRD7ATCUi-IXXRlXWw" },
                        { id: 3, name: "Leo Rodriguez", joinedText: "JOINED 42M AGO", status: "SYNCED", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0YR7t9JVVk3VxB2Uio70gmQXJaxlxsFdo5adbbGvXM6QuMuQ-vCKgyYN4Dj9iu1nZ5RcuMHTAfh8TMi2pvwdz_eCEP3011_G8O-zFDYfh3JppB1xEVcZThicNDhXchkMkoTKrNUPrDes_JZHz1OhV6KyQEvDHjzgTqp_fbQVvLnEFsvRAL7TKmjXwQd86O2ryBZcICGQUbZZ-X9z7VIwJ3siV10AS1gzot9CzJMdt2Pr76PkyqtMKX5KA6KyT2nMuQ1LGmyiogsw" }
                    ]
                },
                {
                    code: "POV-LAUNCH",
                    name: "POV Gallery Launch",
                    hostPin: "HOST-POV",
                    totalExposures: 24,
                    remainingFrames: 24,
                    photos: [],
                    dashboardPhotoCountSeed: 0,
                    guests: []
                }
            ],
            flashActive: false,
            cameraFacingMode: 'environment'
        };
        this.saveState();
    }

    saveState() {
        localStorage.setItem('event_film_state_v2', JSON.stringify(this.state));
    }

    // Dynamic Getter for currently active Event
    get activeEvent() {
        return this.state.events.find(e => e.code === this.state.currentEventCode) || this.state.events[0];
    }

    initDOM() {
        // Screens
        this.screens = {
            join: document.getElementById('screen-join'),
            camera: document.getElementById('screen-camera'),
            gallery: document.getElementById('screen-gallery'),
            dashboard: document.getElementById('screen-dashboard')
        };

        // Navigation elements
        this.headerCodePill = document.getElementById('header-code-pill');
        this.headerLogo = document.getElementById('header-logo');
        this.bottomNav = document.getElementById('bottom-nav');
        this.navButtons = {
            dashboard: document.getElementById('nav-dashboard'),
            camera: document.getElementById('nav-camera'),
            gallery: document.getElementById('nav-gallery')
        };

        // Join Elements
        this.inputCode = document.getElementById('event-code');
        this.btnJoin = document.getElementById('join-btn');
        this.progressJoin = document.getElementById('progress');
        this.successOverlay = document.getElementById('success-overlay');
        this.successRollCount = document.getElementById('success-roll-count');
        this.btnSuccessContinue = document.getElementById('success-continue-btn');
        
        // Segment role controls
        this.tabGuest = document.getElementById('tab-guest');
        this.tabHost = document.getElementById('tab-host');
        this.joinHeadline = document.getElementById('join-headline');
        this.inputLabel = document.getElementById('input-label');
        this.joinBtnText = document.getElementById('join-btn-text');

        // Disconnect Elements
        this.disconnectOverlay = document.getElementById('disconnect-overlay');
        this.disconnectDesc = document.getElementById('disconnect-description');
        this.disconnectCancelBtn = document.getElementById('disconnect-cancel-btn');
        this.disconnectConfirmBtn = document.getElementById('disconnect-confirm-btn');

        // Guest Camera view Exit Elements
        this.guestExitContainer = document.getElementById('guest-exit-container');
        this.btnGuestExit = document.getElementById('btn-guest-exit');

        // Create Event Overlay Elements
        this.createEventOverlay = document.getElementById('create-event-overlay');
        this.newEventNameInput = document.getElementById('new-event-name');
        this.newEventCodeInput = document.getElementById('new-event-code');
        this.newEventExposuresSelect = document.getElementById('new-event-exposures');
        this.btnCreateEventCancel = document.getElementById('create-event-cancel');
        this.btnCreateEventConfirm = document.getElementById('create-event-confirm');

        // Camera Elements
        this.cameraVideo = document.getElementById('camera-video');
        this.cameraFallback = document.getElementById('camera-fallback');
        this.cameraRemainingCount = document.getElementById('camera-remaining-count');
        this.cameraProgressBar = document.getElementById('camera-progress-bar');
        this.cameraDevelopingStatus = document.getElementById('camera-developing-status');
        this.cameraDevelopingTxt = document.getElementById('camera-developing-txt');
        this.cameraFrameNum = document.getElementById('camera-frame-num');
        this.btnFlashToggle = document.getElementById('btn-flash-toggle');
        this.btnShutter = document.getElementById('shutter-btn');
        this.btnCameraFlip = document.getElementById('btn-camera-flip');
        this.flashEffect = document.getElementById('flash-effect');
        this.btnMockUpload = document.getElementById('btn-mock-upload');
        this.fileUploadInput = document.getElementById('file-upload-input');

        // Gallery Elements
        this.galleryEventTitle = document.getElementById('gallery-event-title');
        this.galleryExposureCount = document.getElementById('gallery-exposure-count');
        this.galleryProgressBar = document.getElementById('gallery-progress-bar');
        this.galleryMasonry = document.getElementById('gallery-masonry-container');
        this.btnDownloadZip = document.getElementById('download-zip-btn');

        // Dashboard Elements
        this.dashboardEventName = document.getElementById('dashboard-event-name');
        this.dashboardAccessCode = document.getElementById('dashboard-access-code');
        this.dashboardShareBtn = document.getElementById('dashboard-share-btn');
        this.dashboardPhotosCount = document.getElementById('dashboard-photos-count');
        this.dashboardGuestsCount = document.getElementById('dashboard-guests-count');
        this.dashboardTotalGuestsMono = document.getElementById('dashboard-total-guests-mono');
        this.dashboardGuestsList = document.getElementById('dashboard-guests-list');
        this.dashboardCapturesStrip = document.getElementById('dashboard-captures-strip');

        this.currentScreen = 'join';
        this.joinRole = 'guest'; // local segmented selection state
        this.pendingHostPin = ""; // local cache when host types non-existing PIN
    }

    initAudio() {
        this.audioCtx = null;
    }

    getAudioContext() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        return this.audioCtx;
    }

    playShutterSound() {
        try {
            const ctx = this.getAudioContext();
            
            // 1. Click burst noise
            const bufferSize = ctx.sampleRate * 0.15;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noiseNode = ctx.createBufferSource();
            noiseNode.buffer = buffer;

            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(1200, ctx.currentTime);
            noiseFilter.Q.setValueAtTime(3, ctx.currentTime);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

            noiseNode.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noiseNode.start();

            // 2. High metallic oscillator pop
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

            oscGain.gain.setValueAtTime(0.2, ctx.currentTime);
            oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(oscGain);
            oscGain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);

            // 3. Flash hum
            if (this.state.flashActive) {
                setTimeout(() => {
                    this.playFlashRechargeSound();
                }, 200);
            }
        } catch (e) {
            console.warn("AudioContext block/error:", e);
        }
    }

    playFlashRechargeSound() {
        try {
            const ctx = this.getAudioContext();
            const chargeOsc = ctx.createOscillator();
            const chargeGain = ctx.createGain();

            chargeOsc.type = 'sine';
            chargeOsc.frequency.setValueAtTime(800, ctx.currentTime);
            chargeOsc.frequency.exponentialRampToValueAtTime(5000, ctx.currentTime + 1.6);

            chargeGain.gain.setValueAtTime(0.0, ctx.currentTime);
            chargeGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.1);
            chargeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);

            chargeOsc.connect(chargeGain);
            chargeGain.connect(ctx.destination);
            chargeOsc.start();
            chargeOsc.stop(ctx.currentTime + 1.7);
        } catch (e) {}
    }

    playHapticBeep() {
        try {
            const ctx = this.getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2000, ctx.currentTime);
            
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.06);
        } catch (e) {}
    }

    async initCamera() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                if (this.cameraStream) {
                    this.cameraStream.getTracks().forEach(track => track.stop());
                }

                const constraints = {
                    video: {
                        facingMode: this.state.cameraFacingMode,
                        width: { ideal: 720 },
                        height: { ideal: 720 }
                    },
                    audio: false
                };

                this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
                this.cameraVideo.srcObject = this.cameraStream;
                this.cameraVideo.classList.remove('hidden');
                this.cameraFallback.classList.add('hidden');
            } catch (err) {
                this.cameraVideo.classList.add('hidden');
                this.cameraFallback.classList.remove('hidden');
            }
        } else {
            this.cameraVideo.classList.add('hidden');
            this.cameraFallback.classList.remove('hidden');
        }
    }

    initTimers() {
        setInterval(() => {
            let stateChanged = false;
            
            // Loop through all photos in all events to tick down development chemical timers
            this.state.events.forEach(evt => {
                evt.photos.forEach(photo => {
                    if (photo.status === 'DEVELOPING' || photo.status === 'DRYING' || photo.status === 'PROCESSING') {
                        photo.developProgress--;
                        stateChanged = true;

                        if (photo.developProgress <= 0) {
                            photo.status = 'READY';
                            photo.developProgress = 0;
                        } else if (photo.status === 'DEVELOPING' && photo.developProgress < 120 && photo.developProgress >= 45) {
                            photo.status = 'DRYING';
                        } else if (photo.status === 'PROCESSING' && photo.developProgress < 45) {
                            photo.status = 'DEVELOPING';
                        }
                    }
                });
            });

            if (stateChanged) {
                this.saveState();
                if (this.state.isJoined) {
                    this.renderGallery();
                    this.renderDashboard();
                    this.renderCameraStatus();
                }
            }
        }, 1000);
    }

    bindEvents() {
        // App bar
        this.headerLogo.addEventListener('click', () => {
            if (this.state.isJoined) {
                if (this.state.userRole === 'host') {
                    this.switchScreen('dashboard');
                } else {
                    this.switchScreen('camera');
                }
            }
        });
        
        this.headerCodePill.addEventListener('click', () => {
            if (this.state.isJoined) {
                this.showDisconnectModal();
            }
        });

        // Segment selector tabs (GUEST MODE / HOST MODE)
        this.tabGuest.addEventListener('click', () => {
            this.joinRole = 'guest';
            this.playHapticBeep();
            
            this.tabGuest.className = "flex-1 py-2 rounded-lg font-label-caps text-[10px] transition-all duration-200 bg-primary-container text-on-primary-fixed font-bold shadow-sm";
            this.tabHost.className = "flex-1 py-2 rounded-lg font-label-caps text-[10px] transition-all duration-200 text-on-surface-variant hover:text-on-surface";
            
            this.joinHeadline.innerText = "Enter event code to start capturing memories.";
            this.inputLabel.innerText = "Event Access Code";
            this.inputCode.placeholder = "SUMMER-24";
            this.joinBtnText.innerText = "JOIN EVENT";
        });

        this.tabHost.addEventListener('click', () => {
            this.joinRole = 'host';
            this.playHapticBeep();
            
            this.tabHost.className = "flex-1 py-2 rounded-lg font-label-caps text-[10px] transition-all duration-200 bg-primary-container text-on-primary-fixed font-bold shadow-sm";
            this.tabGuest.className = "flex-1 py-2 rounded-lg font-label-caps text-[10px] transition-all duration-200 text-on-surface-variant hover:text-on-surface";
            
            this.joinHeadline.innerText = "Access the Live Dashboard event manager.";
            this.inputLabel.innerText = "Host Access PIN";
            this.inputCode.placeholder = "HOST-4921";
            this.joinBtnText.innerText = "LOG IN AS HOST";
        });

        // Input
        this.inputCode.addEventListener('input', (e) => {
            const val = e.target.value;
            const clean = val.toUpperCase().replace(/[^A-Z0-9-]/g, '');
            this.inputCode.value = clean;
            
            const percentage = Math.min((clean.length / 9) * 100, 100);
            this.progressJoin.style.width = percentage + '%';
        });

        this.btnJoin.addEventListener('click', () => {
            this.joinEvent();
        });

        this.inputCode.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.joinEvent();
            }
        });

        this.btnSuccessContinue.addEventListener('click', () => {
            this.successOverlay.classList.remove('flex');
            this.successOverlay.classList.add('hidden');
            this.switchScreen('camera');
        });

        // Disconnect Modal
        this.disconnectCancelBtn.addEventListener('click', () => {
            this.disconnectOverlay.classList.remove('flex');
            this.disconnectOverlay.classList.add('hidden');
            this.playHapticBeep();
        });

        this.disconnectConfirmBtn.addEventListener('click', () => {
            this.disconnectOverlay.classList.remove('flex');
            this.disconnectOverlay.classList.add('hidden');
            this.logout();
        });

        // Guest View Exit Event button below controls
        this.btnGuestExit.addEventListener('click', () => {
            this.showDisconnectModal();
        });

        // Create Event Modal Events
        this.btnCreateEventCancel.addEventListener('click', () => {
            this.createEventOverlay.classList.add('hidden');
            this.createEventOverlay.classList.remove('flex');
            this.playHapticBeep();
            
            // Reset fields
            this.newEventNameInput.value = '';
            this.newEventCodeInput.value = '';
        });

        this.btnCreateEventConfirm.addEventListener('click', () => {
            this.createNewEvent();
        });

        // Navigation
        this.navButtons.dashboard.addEventListener('click', () => this.switchScreen('dashboard'));
        this.navButtons.camera.addEventListener('click', () => this.switchScreen('camera'));
        this.navButtons.gallery.addEventListener('click', () => this.switchScreen('gallery'));

        // Camera POV Controls
        this.btnFlashToggle.addEventListener('click', () => {
            this.state.flashActive = !this.state.flashActive;
            this.saveState();
            this.playHapticBeep();
            this.renderFlashButton();
        });

        this.btnCameraFlip.addEventListener('click', () => {
            this.state.cameraFacingMode = this.state.cameraFacingMode === 'environment' ? 'user' : 'environment';
            this.saveState();
            this.playHapticBeep();
            this.initCamera();
        });

        this.btnShutter.addEventListener('click', () => {
            this.capturePhoto();
        });

        // File Uploader mock capture
        this.fileUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.processCapturedImage(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        // ZIP Exporter
        this.btnDownloadZip.addEventListener('click', () => {
            this.downloadZipArchive();
        });

        // Host dashboard links
        this.dashboardShareBtn.addEventListener('click', () => {
            this.copyToClipboard(this.activeEvent.code, "Event Access Code copied to clipboard!");
        });
    }

    switchScreen(screenId) {
        // Restrictions
        if (this.state.isJoined && this.state.userRole === 'guest' && screenId !== 'camera') {
            return;
        }

        if (!this.screens[screenId]) return;
        this.playHapticBeep();

        Object.keys(this.screens).forEach(key => {
            this.screens[key].classList.add('hidden');
            this.screens[key].classList.remove('active');
        });

        this.screens[screenId].classList.remove('hidden');
        this.screens[screenId].offsetHeight;
        this.screens[screenId].classList.add('active');

        this.currentScreen = screenId;

        // Manage Bottom Navigation visibility
        if (screenId === 'join' || this.state.userRole === 'guest') {
            this.bottomNav.classList.add('hidden');
        } else {
            this.bottomNav.classList.remove('hidden');
            
            Object.keys(this.navButtons).forEach(key => {
                const btn = this.navButtons[key];
                if (key === screenId) {
                    btn.classList.add('bg-primary-container', 'text-on-primary-container', 'rounded-full', 'px-5', 'py-1', 'scale-90');
                    btn.classList.remove('text-on-surface-variant');
                } else {
                    btn.classList.remove('bg-primary-container', 'text-on-primary-container', 'rounded-full', 'px-5', 'py-1', 'scale-90');
                    btn.classList.add('text-on-surface-variant');
                }
            });
        }

        // Guest exit button below viewfinder
        if (screenId === 'camera' && this.state.userRole === 'guest') {
            this.guestExitContainer.classList.remove('hidden');
        } else {
            this.guestExitContainer.classList.add('hidden');
        }

        if (screenId === 'camera') {
            this.initCamera();
        }

        window.scrollTo(0, 0);
    }

    joinEvent() {
        const code = this.inputCode.value.trim().toUpperCase();
        if (code.length >= 4) {
            this.playHapticBeep();

            if (this.joinRole === 'guest') {
                // Look up event by Guest Access Code (e.g. SUMMER-24 or POV-LAUNCH)
                const matchedEvent = this.state.events.find(e => e.code.toUpperCase() === code);
                if (matchedEvent) {
                    this.state.isJoined = true;
                    this.state.userRole = 'guest';
                    this.state.currentEventCode = matchedEvent.code;
                    
                    this.saveState();
                    
                    this.progressJoin.style.width = '100%';
                    this.renderHeader();

                    // Show success roll modal
                    this.successRollCount.innerText = `${matchedEvent.remainingFrames} / ${matchedEvent.totalExposures}`;
                    setTimeout(() => {
                        this.successOverlay.classList.remove('hidden');
                        this.successOverlay.classList.add('flex');
                    }, 300);
                } else {
                    this.inputCode.animate([
                        { transform: 'translateX(0px)' },
                        { transform: 'translateX(-5px)' },
                        { transform: 'translateX(5px)' },
                        { transform: 'translateX(0px)' }
                    ], { duration: 200, iterations: 2 });
                    this.playShutterSound();
                    
                    // Show error popup toast
                    this.copyToClipboard("SUMMER-24", "Event code not found! Try entering 'SUMMER-24' or verify with host.");
                }
            } else {
                // Look up event by Host PIN code (e.g. HOST-4921 or HOST-POV)
                const matchedEvent = this.state.events.find(e => e.hostPin.toUpperCase() === code);
                if (matchedEvent) {
                    this.state.isJoined = true;
                    this.state.userRole = 'host';
                    this.state.currentEventCode = matchedEvent.code;
                    
                    this.saveState();
                    
                    this.progressJoin.style.width = '100%';
                    this.renderHeader();

                    setTimeout(() => {
                        this.switchScreen('dashboard');
                    }, 500);
                } else {
                    // Host PIN does not exist, trigger Create Event Overlay!
                    this.pendingHostPin = code;
                    this.newEventCodeInput.value = code.replace("HOST-", "").replace("PIN-", "") + "-ROLL";
                    
                    this.createEventOverlay.classList.remove('hidden');
                    this.createEventOverlay.classList.add('flex');
                }
            }
        } else {
            // Code too short shake
            this.inputCode.animate([
                { transform: 'translateX(0px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0px)' }
            ], { duration: 200, iterations: 2 });
            this.playShutterSound();
        }
    }

    createNewEvent() {
        const name = this.newEventNameInput.value.trim();
        const code = this.newEventCodeInput.value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
        const exposures = parseInt(this.newEventExposuresSelect.value);
        const hostPin = this.pendingHostPin;

        if (name.length < 3 || code.length < 3) {
            alert("Please provide valid Event Name and Access Code of at least 3 characters.");
            return;
        }

        // Check for duplicates
        if (this.state.events.some(e => e.code.toUpperCase() === code)) {
            alert("This Guest Access Code is already taken! Please provide a unique code.");
            return;
        }

        this.playShutterSound(); // feedback

        const newEventObj = {
            code: code,
            name: name,
            hostPin: hostPin,
            totalExposures: exposures,
            remainingFrames: exposures,
            photos: [],
            dashboardPhotoCountSeed: 0,
            guests: []
        };

        this.state.events.push(newEventObj);
        this.state.currentEventCode = code;
        this.state.isJoined = true;
        this.state.userRole = 'host';

        this.saveState();
        
        // Hide Modal
        this.createEventOverlay.classList.add('hidden');
        this.createEventOverlay.classList.remove('flex');

        // Reset inputs
        this.newEventNameInput.value = '';
        this.newEventCodeInput.value = '';

        this.render();
        this.switchScreen('dashboard');

        // Show welcome toast
        this.copyToClipboard(code, `Event roll "${name}" created! Guests can join using code: ${code}`);
    }

    showDisconnectModal() {
        this.playHapticBeep();
        if (this.state.userRole === 'host') {
            this.disconnectDesc.innerText = "Are you sure you want to sign out from the Host Dashboard? You will lock the event controls.";
        } else {
            this.disconnectDesc.innerText = "Are you sure you want to exit the event? You will lock the camera film roll.";
        }
        this.disconnectOverlay.classList.remove('hidden');
        this.disconnectOverlay.classList.add('flex');
    }

    logout() {
        this.playShutterSound();
        this.state.isJoined = false;
        this.state.userRole = null;
        this.saveState();
        
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }

        this.progressJoin.style.width = '0%';
        this.inputCode.value = '';

        this.render();
        this.switchScreen('join');
    }

    async capturePhoto() {
        const active = this.activeEvent;
        if (active.remainingFrames <= 0) {
            alert("No frames left on this film roll!");
            return;
        }

        this.playShutterSound();
        this.flashEffect.style.opacity = '1';
        setTimeout(() => {
            this.flashEffect.style.opacity = '0';
        }, 80);

        if ("vibrate" in navigator) {
            navigator.vibrate(200);
        }

        if (this.cameraVideo.srcObject && !this.cameraVideo.classList.contains('hidden')) {
            try {
                const canvas = document.createElement('canvas');
                const size = Math.min(this.cameraVideo.videoWidth, this.cameraVideo.videoHeight);
                canvas.width = 600;
                canvas.height = 600;
                
                const ctx = canvas.getContext('2d');
                
                const sx = (this.cameraVideo.videoWidth - size) / 2;
                const sy = (this.cameraVideo.videoHeight - size) / 2;
                
                ctx.drawImage(this.cameraVideo, sx, sy, size, size, 0, 0, 600, 600);
                this.applyVintageFilterToCanvas(canvas);
                
                const dataURL = canvas.toDataURL('image/jpeg', 0.85);
                this.processCapturedImage(dataURL);
            } catch (e) {
                console.error("Camera canvas grab failed, using mock", e);
                this.captureMockFallbackImage();
            }
        } else {
            this.captureMockFallbackImage();
        }
    }

    captureMockFallbackImage() {
        const active = this.activeEvent;
        const numPhotos = active.photos.length;
        const fallbackUrl = PREDEFINED_SHUTTER_FALLBACKS[numPhotos % PREDEFINED_SHUTTER_FALLBACKS.length];
        this.processCapturedImage(fallbackUrl);
    }

    applyVintageFilterToCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            
            let tr = (r * 0.393) + (g * 0.769) + (b * 0.189);
            let tg = (r * 0.349) + (g * 0.686) + (b * 0.168);
            let tb = (r * 0.272) + (g * 0.534) + (b * 0.131);
            
            r = Math.min(255, (tr * 0.8 + r * 0.2) * 1.05 + 10);
            g = Math.min(255, (tg * 0.8 + g * 0.2) * 0.95);
            b = Math.min(255, (tb * 0.8 + b * 0.2) * 0.85 - 10);
            
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
        }
        ctx.putImageData(imageData, 0, 0);
        
        const grad = ctx.createRadialGradient(
            canvas.width/2, canvas.height/2, canvas.width/2.8,
            canvas.width/2, canvas.height/2, canvas.width/1.3
        );
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(12, 12, 12, 0.7)');
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        for (let j = 0; j < 3000; j++) {
            const rx = Math.random() * canvas.width;
            const ry = Math.random() * canvas.height;
            const rsize = Math.random() * 1.5 + 0.5;
            ctx.fillRect(rx, ry, rsize, rsize);
        }
    }

    processCapturedImage(imgSource) {
        const active = this.activeEvent;
        active.remainingFrames = Math.max(0, active.remainingFrames - 1);
        
        const frameNum = (active.totalExposures - active.remainingFrames).toString().padStart(2, '0');
        
        const newPhoto = {
            id: `snap-${Date.now()}`,
            frameNumber: frameNum,
            imageSrc: imgSource,
            status: "PROCESSING",
            developProgress: 15, // 15 seconds
            timestamp: new Date().toISOString(),
            guestName: this.state.userRole === 'host' ? 'Host' : 'You'
        };
        
        active.photos.unshift(newPhoto);
        
        this.saveState();
        this.render();
        
        if (this.state.userRole === 'host') {
            setTimeout(() => {
                this.switchScreen('gallery');
            }, 400);
        } else {
            this.copyToClipboard("Developing...", "Photo captured! Developing negative...");
        }
    }

    async downloadZipArchive() {
        const active = this.activeEvent;
        const readyPhotos = active.photos.filter(p => p.status === 'READY');
        if (readyPhotos.length === 0) {
            alert("No developed photos to download yet. Wait for chemical development to complete!");
            return;
        }

        const oldHtml = this.btnDownloadZip.innerHTML;
        this.btnDownloadZip.disabled = true;
        this.btnDownloadZip.innerHTML = `
            <div class="w-5 h-5 border-2 border-on-primary-fixed border-t-transparent rounded-full animate-spin"></div>
            <span class="font-label-caps text-label-caps text-body-md">PACKAGING PHOTO ARCHIVE...</span>
        `;

        try {
            const zip = new JSZip();
            const fetchPromises = readyPhotos.map(async (photo) => {
                const filename = `event_film_frame_${photo.frameNumber}.jpg`;
                
                if (photo.imageSrc.startsWith('data:image')) {
                    const base64Data = photo.imageSrc.split(',')[1];
                    zip.file(filename, base64Data, { base64: true });
                } else {
                    try {
                        const res = await fetch(photo.imageSrc);
                        const blob = await res.blob();
                        zip.file(filename, blob);
                    } catch (err) {
                        console.warn(`Could not fetch remote file ${photo.imageSrc}, skipping.`, err);
                    }
                }
            });

            await Promise.all(fetchPromises);
            
            const content = await zip.generateAsync({ type: 'blob' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `event_roll_${active.code}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error("ZIP error:", e);
            alert("Failed to build ZIP file.");
        } finally {
            this.btnDownloadZip.disabled = false;
            this.btnDownloadZip.innerHTML = oldHtml;
        }
    }

    copyToClipboard(text, successMessage) {
        navigator.clipboard.writeText(text).then(() => {
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-28 left-1/2 transform -translate-x-1/2 z-50 bg-primary-container text-on-primary-fixed font-meta-mono text-label-caps px-4 py-2 rounded shadow-2xl animate-bounce';
            toast.innerText = successMessage;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
                setTimeout(() => toast.remove(), 300);
            }, 2500);
        });
    }

    render() {
        this.renderHeader();
        this.renderFlashButton();
        this.renderCameraStatus();
        this.renderGallery();
        this.renderDashboard();
    }

    renderHeader() {
        if (this.state.isJoined) {
            if (this.state.userRole === 'host') {
                this.headerCodePill.innerHTML = `👑 HOST #${this.activeEvent.code.slice(0, 4)}`;
            } else {
                this.headerCodePill.innerText = `#${this.activeEvent.code.slice(0, 6)}`;
            }
            this.headerCodePill.classList.remove('hidden');
        } else {
            this.headerCodePill.innerText = '#----';
        }
    }

    renderFlashButton() {
        if (this.state.flashActive) {
            this.btnFlashToggle.style.fontVariationSettings = "'FILL' 1";
            this.btnFlashToggle.classList.add('text-primary');
            this.btnFlashToggle.classList.remove('text-on-surface-variant');
        } else {
            this.btnFlashToggle.style.fontVariationSettings = "'FILL' 0";
            this.btnFlashToggle.classList.remove('text-primary');
            this.btnFlashToggle.classList.add('text-on-surface-variant');
        }
    }

    renderCameraStatus() {
        const active = this.activeEvent;
        const exposed = active.totalExposures - active.remainingFrames;
        
        this.cameraFrameNum.innerText = (exposed + 1).toString().padStart(3, '0');
        this.cameraRemainingCount.innerText = `${active.remainingFrames}/${active.totalExposures} PHOTOS LEFT`;
        
        const percentLeft = (active.remainingFrames / active.totalExposures) * 100;
        this.cameraProgressBar.style.width = percentLeft + '%';

        // Timer of developing roll snapshots
        const developing = active.photos.find(p => p.status !== 'READY');
        if (developing) {
            this.cameraDevelopingStatus.classList.remove('invisible');
            const minutes = Math.floor(developing.developProgress / 60);
            const seconds = developing.developProgress % 60;
            const timerStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (developing.status === 'PROCESSING') {
                this.cameraDevelopingTxt.innerText = `PROCESSING SNAPSHOT... ${timerStr}`;
            } else if (developing.status === 'DEVELOPING') {
                this.cameraDevelopingTxt.innerText = `DEVELOPING NEGATIVE... ${timerStr}`;
            } else {
                this.cameraDevelopingTxt.innerText = `DRYING EMULSION... ${timerStr}`;
            }
        } else {
            this.cameraDevelopingStatus.classList.add('invisible');
        }
    }

    renderGallery() {
        const active = this.activeEvent;
        const totalPhotosCount = active.photos.length;
        this.galleryExposureCount.innerText = `${totalPhotosCount}/${active.totalExposures} EXPOSURES`;
        
        const galleryPercentage = Math.min((totalPhotosCount / active.totalExposures) * 100, 100);
        this.galleryProgressBar.style.width = galleryPercentage + '%';
        this.galleryEventTitle.innerText = `${active.code} GALLERY`;

        this.galleryMasonry.innerHTML = '';
        
        if (active.photos.length === 0) {
            this.galleryMasonry.innerHTML = `
                <div class="col-span-full py-16 text-center text-on-surface-variant font-meta-mono">
                    <p class="text-lg">NO EXPOSURES FOUND</p>
                    <p class="text-xs mt-1">LOAD THE ROLL AND CAPTURE AN ACTIVE SHOT</p>
                </div>
            `;
            return;
        }

        active.photos.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'masonry-item relative group rounded-lg overflow-hidden border border-outline-variant';

            if (photo.status === 'READY') {
                card.innerHTML = `
                    <div class="absolute top-xs left-xs z-10 font-meta-mono text-[10px] text-white/70 bg-black/40 px-1 backdrop-blur-sm">
                        ${photo.frameNumber}
                    </div>
                    <img class="w-full rounded-lg border border-white/10 group-hover:opacity-90 transition-opacity" 
                         src="${photo.imageSrc}" 
                         alt="Captured frame ${photo.frameNumber} by ${photo.guestName}"/>
                `;
            } else {
                const minutes = Math.floor(photo.developProgress / 60);
                const seconds = photo.developProgress % 60;
                const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                let statusLabel = "DEVELOPING";
                let spinColor = "border-t-primary-container";

                if (photo.status === 'DRYING') {
                    statusLabel = "EMULSION DRYING";
                    spinColor = "border-t-surface-tint";
                } else if (photo.status === 'PROCESSING') {
                    statusLabel = "PROCESSING";
                    spinColor = "border-t-red-500";
                }

                card.innerHTML = `
                    <div class="absolute top-xs left-xs z-10 font-meta-mono text-[10px] text-on-surface-variant">${photo.frameNumber}</div>
                    <div class="relative w-full aspect-[3/4] bg-surface-container-high flex flex-col items-center justify-center p-md text-center">
                        <div class="w-12 h-12 border-4 border-surface-variant ${spinColor} rounded-full animate-spin mb-4"></div>
                        <span class="font-label-caps text-label-caps text-primary-container mb-xs tracking-wider">${statusLabel}</span>
                        <span class="font-meta-mono text-display-lg text-primary-container tracking-widest">${timeStr}</span>
                        <div class="absolute inset-0 -z-10 bg-gradient-to-br from-surface-container to-surface-dim opacity-50 blur-xl"></div>
                    </div>
                `;
            }
            this.galleryMasonry.appendChild(card);
        });
    }

    renderDashboard() {
        const active = this.activeEvent;
        this.dashboardEventName.innerText = `${active.name} Event Roll`;
        this.dashboardAccessCode.innerText = active.code;

        const newlyCaptured = active.photos.filter(p => !p.id.startsWith('mock-')).length;
        const totalDashboardPhotos = active.dashboardPhotoCountSeed + newlyCaptured;
        
        this.dashboardPhotosCount.innerText = totalDashboardPhotos.toLocaleString();
        this.dashboardGuestsCount.innerText = active.guests.length;
        this.dashboardTotalGuestsMono.innerText = `VIEW ALL (${active.guests.length})`;

        this.dashboardGuestsList.innerHTML = '';
        active.guests.forEach((guest, index) => {
            const isLive = guest.status === 'LIVE';
            const guestEl = document.createElement('div');
            guestEl.className = 'flex items-center gap-md p-4 bg-surface-container rounded-lg border border-transparent hover:border-surface-variant transition-colors group';
            
            guestEl.innerHTML = `
                <div class="font-meta-mono text-meta-mono text-surface-tint opacity-50">${(index+1).toString().padStart(2, '0')}</div>
                <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-variant">
                    <img src="${guest.avatar}" alt="${guest.name}" class="w-full h-full object-cover"/>
                </div>
                <div class="flex-1">
                    <p class="font-body-md text-body-md text-on-surface font-semibold">${guest.name}</p>
                    <p class="font-meta-mono text-meta-mono text-[10px] text-on-surface-variant">${guest.joinedText}</p>
                </div>
                <div class="px-3 py-1 rounded-full border ${isLive ? 'border-primary-container/30' : 'border-surface-variant'}">
                    <span class="font-label-caps text-[10px] ${isLive ? 'text-primary-container' : 'text-on-surface-variant'}">${guest.status}</span>
                </div>
            `;
            this.dashboardGuestsList.appendChild(guestEl);
        });

        // Captures horizontal strip
        this.dashboardCapturesStrip.innerHTML = '';
        const latestCaptures = active.photos.slice(0, 6);
        latestCaptures.forEach(photo => {
            const stripItem = document.createElement('div');
            stripItem.className = 'relative flex-none w-40 h-40 bg-surface-variant rounded overflow-hidden border border-outline-variant';
            
            if (photo.status === 'READY') {
                stripItem.innerHTML = `
                    <span class="absolute top-2 left-2 z-10 font-meta-mono text-[10px] bg-black/60 px-1 text-white">${photo.frameNumber}</span>
                    <img src="${photo.imageSrc}" class="w-full h-full object-cover" alt="Frame ${photo.frameNumber}"/>
                `;
            } else {
                stripItem.innerHTML = `
                    <span class="absolute top-2 left-2 z-10 font-meta-mono text-[10px] bg-black/60 px-1 text-white">${photo.frameNumber}</span>
                    <div class="w-full h-full bg-surface-container-high flex flex-col items-center justify-center p-2 text-center">
                        <span class="material-symbols-outlined text-surface-tint animate-pulse" style="font-size: 28px;">chemical_burn</span>
                        <span class="font-label-caps text-[8px] text-on-surface-variant mt-2">${photo.status}</span>
                    </div>
                `;
            }
            this.dashboardCapturesStrip.appendChild(stripItem);
        });
    }
}

// Window load init
window.addEventListener('load', () => {
    window.App = new EventFilmApp();

    if (window.App.state.isJoined) {
        if (window.App.state.userRole === 'host') {
            window.App.switchScreen('dashboard');
        } else {
            window.App.switchScreen('camera');
        }
    }
});
