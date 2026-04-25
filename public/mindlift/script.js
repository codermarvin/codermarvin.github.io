const MOODS = {
    STRESSED: {
        name: 'Stressed',
        class: 'mood-stressed',
        energy: 'High / Erratic',
        suggestions: ['Take a 30-sec breath', 'Listen to Lo-Fi beats', 'Step away from screens'],
        quotes: ['"This too shall pass."', '"Breathe. It is just a bad day, not a bad life."', '"Calm is a superpower."'],
        words: ['Breathe', 'Release', 'Quiet', 'Stillness']
    },
    HAPPY: {
        name: 'Happy',
        class: 'mood-happy',
        energy: 'Radiant',
        suggestions: ['Share this joy', 'Dance for 1 minute', 'Write down what made you smile'],
        quotes: ['"Happiness is a direction, not a place."', '"Keep shining."', '"Joy is contagious."'],
        words: ['Glow', 'Bright', 'Soar', 'Limitless']
    },
    BORED: {
        name: 'Bored',
        class: 'mood-bored',
        energy: 'Low / Static',
        suggestions: ['Start a random doodle', 'Learn a new word', 'Try a 1-minute stretch'],
        quotes: ['"Curiosity is the cure for boredom."', '"Explore the unseen."', '"Create something small."'],
        words: ['Spark', 'Shift', 'Flow', 'Discovery']
    },
    LOST: {
        name: 'Lost',
        class: 'mood-lost',
        energy: 'Floating / Uncertain',
        suggestions: ['Ground yourself (5-4-3-2-1)', 'Drink some water', 'Look at the sky'],
        quotes: ['"Not all who wander are lost."', '"One step at a time."', '"Find peace in the unknown."'],
        words: ['Anchor', 'Path', 'North', 'Becoming']
    },
    NEUTRAL: {
        name: 'Calm',
        class: 'mood-neutral',
        energy: 'Stable',
        suggestions: ['Maintain this flow', 'Read a page', 'Deepen your focus'],
        quotes: ['"Peace begins with a smile."', '"Stay centered."', '"Balance is key."'],
        words: ['Poise', 'Center', 'Steady', 'Clear']
    }
};

const KEYWORDS = {
    stressed: ['stressed', 'overwhelmed', 'anxious', 'busy', 'pressure', 'hard', 'tired', 'help'],
    happy: ['happy', 'good', 'great', 'amazing', 'excited', 'love', 'wonderful', 'joy'],
    bored: ['bored', 'nothing', 'slow', 'meh', 'blah', 'waiting'],
    lost: ['lost', 'confused', 'where', 'stuck', 'sad', 'empty', 'lonely']
};

class MindLiftApp {
    constructor() {
        this.inputSection = document.getElementById('input-section');
        this.experienceSection = document.getElementById('experience-section');
        this.moodInput = document.getElementById('mood-input');
        this.liftOffBtn = document.getElementById('lift-off-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.detectedMoodEl = document.getElementById('detected-mood');
        this.energyLevelEl = document.getElementById('energy-level');
        this.canvas = document.getElementById('anti-gravity-canvas');
        this.appContainer = document.getElementById('app-container');
        this.suggestionOverlay = document.getElementById('suggestion-overlay');
        this.suggestionCard = document.querySelector('.suggestion-card');
        this.suggestionContent = document.getElementById('suggestion-content');
        this.closeSuggestion = document.querySelector('.close-suggestion');
        this.tags = document.querySelectorAll('.tag');
        this.voiceBtn = document.getElementById('voice-btn');

        this.bubbles = [];
        this.currentMood = MOODS.NEUTRAL;
        
        this.init();
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < 50; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 3;
            p.style.width = p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 100}%`;
            p.style.opacity = Math.random() * 0.5;
            this.appContainer.appendChild(p);
            
            // Subtle movement
            setInterval(() => {
                const top = parseFloat(p.style.top);
                p.style.top = `${(top - 0.05 + 100) % 100}%`;
            }, 50);
        }
    }

    init() {
        this.liftOffBtn.addEventListener('click', () => this.analyzeMood());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.closeSuggestion.addEventListener('click', () => this.hideSuggestion());
        
        this.moodInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.analyzeMood();
        });

        this.tags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.moodInput.value = tag.textContent;
                this.analyzeMood();
            });
        });

        this.setupVoice();
        this.startPhysicsLoop();

        // Background bubble loop - Even slower generation to avoid crowding
        setInterval(() => {
            if (this.experienceSection.classList.contains('visible') && this.bubbles.length < 8) {
                this.createBubble();
            }
        }, 4000);
    }

    setupVoice() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            this.voiceBtn.style.display = 'none';
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        this.voiceBtn.addEventListener('click', () => {
            recognition.start();
            this.voiceBtn.classList.add('recording');
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.moodInput.value = transcript;
            this.voiceBtn.classList.remove('recording');
            this.analyzeMood();
        };

        recognition.onerror = () => {
            this.voiceBtn.classList.remove('recording');
        };

        recognition.onend = () => {
            this.voiceBtn.classList.remove('recording');
        };
    }

    analyzeMood() {
        const text = this.moodInput.value.toLowerCase();
        if (!text) return;

        let detected = MOODS.NEUTRAL;

        if (this.containsAny(text, KEYWORDS.stressed)) detected = MOODS.STRESSED;
        else if (this.containsAny(text, KEYWORDS.happy)) detected = MOODS.HAPPY;
        else if (this.containsAny(text, KEYWORDS.bored)) detected = MOODS.BORED;
        else if (this.containsAny(text, KEYWORDS.lost)) detected = MOODS.LOST;

        this.currentMood = detected;
        this.transitionToExperience();
    }

    containsAny(text, keywords) {
        return keywords.some(k => text.includes(k));
    }

    transitionToExperience() {
        this.inputSection.classList.remove('visible');
        
        // Update Theme
        this.appContainer.className = this.currentMood.class;
        this.detectedMoodEl.textContent = `Current State: ${this.currentMood.name}`;
        this.energyLevelEl.textContent = `Energy: ${this.currentMood.energy}`;

        setTimeout(() => {
            this.experienceSection.style.display = 'block';
            setTimeout(() => {
                this.experienceSection.classList.add('visible');
                // Generate initial burst of bubbles - Fewer for less crowding
                for (let i = 0; i < 4; i++) {
                    setTimeout(() => this.createBubble(), i * 600);
                }
            }, 50);
        }, 800);
    }

    createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const type = Math.random();
        let content = '';
        let size = 120;
        
        if (type < 0.3) {
            content = this.getRandom(this.currentMood.words);
            size = 100;
        } else if (type < 0.7) {
            content = this.getRandom(this.currentMood.suggestions);
            size = 180;
            bubble.classList.add('suggestion-bubble');
            if (content.toLowerCase().includes('breath')) {
                bubble.classList.add('pulse');
            }
        } else {
            content = this.getRandom(this.currentMood.quotes);
            size = 220;
            bubble.style.borderRadius = '24px';
        }

        bubble.style.width = bubble.style.height = `${size}px`;
        bubble.textContent = content;
        
        // Remove left/top from style as we use transform
        bubble.style.position = 'absolute';
        bubble.style.left = '0';
        bubble.style.top = '0';
        
        const x = Math.random() * (window.innerWidth - size);
        const y = window.innerHeight + 100;
        
        const bubbleObj = {
            el: bubble,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: -0.8 - Math.random() * 1.5, // Re-balanced upward drift
            size: size,
            isDragging: false,
            lastX: x,
            lastY: y
        };

        bubble.addEventListener('click', () => {
            const isSquare = type >= 0.7; // Quotes are squares
            this.showSuggestion(content, isSquare);
        });

        this.makeDraggable(bubbleObj);
        this.canvas.appendChild(bubble);
        this.bubbles.push(bubbleObj);
    }

    makeDraggable(obj) {
        const el = obj.el;
        let startX, startY;

        const onStart = (e) => {
            obj.isDragging = true;
            const pos = e.touches ? e.touches[0] : e;
            startX = pos.clientX - obj.x;
            startY = pos.clientY - obj.y;
            el.style.zIndex = 1000;
            el.style.cursor = 'grabbing';
        };

        const onMove = (e) => {
            if (!obj.isDragging) return;
            const pos = e.touches ? e.touches[0] : e;
            obj.x = pos.clientX - startX;
            obj.y = pos.clientY - startY;
            
            // Calculate velocity while dragging
            obj.vx = (obj.x - obj.lastX) * 0.5;
            obj.vy = (obj.y - obj.lastY) * 0.5;
            obj.lastX = obj.x;
            obj.lastY = obj.y;
        };

        const onEnd = () => {
            obj.isDragging = false;
            el.style.zIndex = '';
            el.style.cursor = 'grab';
        };

        el.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        el.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('touchmove', (e) => {
            if (obj.isDragging) e.preventDefault();
            onMove(e);
        }, { passive: false });
        window.addEventListener('touchend', onEnd);
    }

    startPhysicsLoop() {
        const loop = () => {
            for (let i = this.bubbles.length - 1; i >= 0; i--) {
                const b = this.bubbles[i];
                if (!b.isDragging) {
                    // Apply physics
                    b.x += b.vx;
                    b.y += b.vy;

                    // Buoyancy (constant upward force) - Re-balanced
                    b.vy -= 0.015; 
                    if (b.vy < -2.2) b.vy = -2.2; // Balanced terminal velocity

                    // Air resistance / Friction
                    b.vx *= 0.99;
                    b.vy *= 0.99;

                    // Bounce off walls
                    if (b.x < 0) {
                        b.x = 0;
                        b.vx *= -0.8;
                    } else if (b.x > window.innerWidth - b.size) {
                        b.x = window.innerWidth - b.size;
                        b.vx *= -0.8;
                    }

                    // Remove if too far above
                    if (b.y < -b.size - 200) {
                        b.el.remove();
                        this.bubbles.splice(i, 1);
                        continue;
                    }
                }
                
                // Update element position
                b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    showSuggestion(content, isSquare) {
        this.suggestionContent.innerHTML = `
            <h3 style="color: var(--accent-primary); margin-bottom: 0.5rem;">${isSquare ? 'Reflection' : 'MindLift Hint'}</h3>
            <div style="font-size: 1.6rem; font-weight: 600; margin: 1.5rem 0; line-height: 1.2;">${content}</div>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Tap to release</p>
        `;
        
        this.suggestionCard.classList.remove('is-circle', 'is-square', 'popping');
        this.suggestionCard.classList.add(isSquare ? 'is-square' : 'is-circle');
        
        this.suggestionOverlay.style.display = 'flex';
        
        // Force reflow
        void this.suggestionCard.offsetWidth;
        
        this.suggestionCard.classList.add('active');
    }

    hideSuggestion() {
        this.suggestionCard.classList.add('popping');
        this.suggestionCard.classList.remove('active');
        
        setTimeout(() => {
            this.suggestionOverlay.style.display = 'none';
            this.suggestionCard.classList.remove('popping');
        }, 400);
    }

    getRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    reset() {
        this.experienceSection.classList.remove('visible');
        setTimeout(() => {
            this.experienceSection.style.display = 'none';
        }, 800);
        
        // Clear all bubbles
        this.bubbles.forEach(b => b.el.remove());
        this.bubbles = [];
        
        this.moodInput.value = '';
        this.appContainer.className = 'mood-neutral';
        
        setTimeout(() => {
            this.inputSection.classList.add('visible');
        }, 500);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new MindLiftApp();
});
