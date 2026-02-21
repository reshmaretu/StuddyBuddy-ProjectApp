        // ==================== DATA ====================
        let tasks = [
            { id: '1', name: 'Write ancient manuscript', type: 'creative', deadline: '2026-03-10', completed: false },
            { id: '2', name: 'Pay tribute to ancestors', type: 'urgent', deadline: '2026-03-05', completed: false },
            { id: '3', name: 'Meditate in crystal cave', type: 'recurring', deadline: '2026-03-06', completed: false },
            { id: '4', name: 'Decode mysterious scroll', type: 'creative', deadline: '2026-03-15', completed: false },
        ];

        let completedTasks = [];
        
        // Focus Score System
        let focusScore = 850;
        let sessionCount = 0;
        const SESSIONS_FOR_BRAIN_RESET = 4;

        // ==================== SPARKS FEED QUOTES ====================
        const quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
            { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
            { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
        ];

        // ==================== STUDY BUDDY MESSAGES ====================
        const buddyMessages = [
            "Ready for your next quest? 🎮",
            "You're doing great! Keep going! 💪",
            "Time for a break? I'll be here ☕",
            "I believe in you! One quest at a time ✨",
            "Need motivation? You've got this! ⭐",
            "Your crystals are looking beautiful today 🔮",
            "Remember to breathe... in... and out... 🧘",
            "I'm here to help you succeed! 🌿"
        ];

        // ==================== UPDATE FOCUS SCORE ====================
        function t(change) {
            focusScore += change;
            if (focusScore < 0) focusScore = 0;
            
            document.getElementById('focusScoreDisplay').textContent = focusScore;
            document.getElementById('focusScoreMini').textContent = focusScore;
            
            // Update circle gradient
            const percentage = Math.min(100, (focusScore / 1000) * 100);
            const degrees = (percentage / 100) * 360;
            document.getElementById('focusScoreCircle').style.background = `conic-gradient(#ffd966 ${degrees}deg, #6bb5a8 0deg)`;
            
            // Update level text
            let levelText = '';
            if (focusScore >= 900) levelText = 'Legendary · Top 1%';
            else if (focusScore >= 700) levelText = 'Elite · Top 5%';
            else if (focusScore >= 500) levelText = 'Master · Top 15%';
            else if (focusScore >= 300) levelText = 'Apprentice · Getting there';
            else levelText = 'Novice · Keep going';
            
            document.getElementById('focusLevelText').textContent = levelText;
        }

        // ==================== SPARKS FEED ====================
        function updateSparksFeed() {
            const now = new Date();
            const lastUpdate = localStorage.getItem('lastSparksUpdate');
            let quoteIndex = 0;
            
            if (lastUpdate) {
                const hoursSinceUpdate = (now - new Date(parseInt(lastUpdate))) / (1000 * 60 * 60);
                if (hoursSinceUpdate < 6) {
                    // Use stored quote
                    quoteIndex = parseInt(localStorage.getItem('currentQuoteIndex')) || 0;
                } else {
                    // New day, new quote
                    quoteIndex = Math.floor(Math.random() * quotes.length);
                    localStorage.setItem('lastSparksUpdate', now.getTime());
                    localStorage.setItem('currentQuoteIndex', quoteIndex);
                }
            } else {
                quoteIndex = Math.floor(Math.random() * quotes.length);
                localStorage.setItem('lastSparksUpdate', now.getTime());
                localStorage.setItem('currentQuoteIndex', quoteIndex);
            }
            
            document.getElementById('sparksQuote').textContent = `"${quotes[quoteIndex].text}"`;
            document.getElementById('sparksAuthor').textContent = `— ${quotes[quoteIndex].author}`;
            
            // Update refresh timer
            updateSparksTimer();
        }

        function updateSparksTimer() {
            const lastUpdate = localStorage.getItem('lastSparksUpdate');
            if (lastUpdate) {
                const nextUpdate = new Date(parseInt(lastUpdate) + (6 * 60 * 60 * 1000));
                const now = new Date();
                const hoursLeft = Math.floor((nextUpdate - now) / (1000 * 60 * 60));
                const minutesLeft = Math.floor(((nextUpdate - now) % (1000 * 60 * 60)) / (1000 * 60));
                
                if (hoursLeft >= 0) {
                    document.getElementById('sparksTimer').textContent = `Refreshes in ${hoursLeft}h ${minutesLeft}m`;
                } else {
                    document.getElementById('sparksTimer').textContent = 'Refreshing soon...';
                }
            }
        }

        // ==================== RENDER FUNCTIONS ====================
        function renderCrystals() {
            const grid = document.getElementById('crystalGrid');
            const activeTasks = tasks.filter(t => !t.completed);
            
            document.getElementById('activeQuestCount').textContent = `+${activeTasks.length} active quests`;
            document.getElementById('pendingCount').textContent = activeTasks.length;
            
            if (activeTasks.length === 0) {
                grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:#8fc1b5;">✨ No active quests. Summon a new crystal!</div>';
                return;
            }

            let html = '';
            activeTasks.forEach(task => {
                const icon = task.type === 'urgent' ? '🔴' : task.type === 'creative' ? '🎵' : '⚙️';
                html += `
                    <div class="crystal-card" data-id="${task.id}">
                        <div class="card-icon">${icon}</div>
                        <div class="card-title">${task.name}</div>
                        <div class="card-type">${task.type}</div>
                        <div class="card-deadline">📅 ${task.deadline || 'no date'}</div>
                    </div>
                `;
            });
            grid.innerHTML = html;
            
            // Add click to complete functionality with confirmation
document.querySelectorAll('.crystal-card').forEach(card => {
    card.addEventListener('click', function() {
        const id = this.dataset.id;
        const taskIndex = tasks.findIndex(t => t.id === id && !t.completed);
        if (taskIndex !== -1) {
            const task = tasks[taskIndex];
            
            // Create custom confirmation dialog
            const confirmModal = document.createElement('div');
            confirmModal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 25, 22, 0.95);
                backdrop-filter: blur(10px);
                z-index: 20000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            confirmModal.innerHTML = `
                <div style="
                    background: #1a3330;
                    border-radius: 50px;
                    padding: 40px;
                    border: 3px solid #6bb5a8;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                ">
                    <h3 style="color: #ffd966; margin-bottom: 20px; font-size: 1.5rem;">✨ Complete Quest?</h3>
                    <p style="color: #e0f7f0; margin-bottom: 30px; font-size: 1.2rem;">"${task.name}"</p>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button class="confirm-yes" style="
                            background: #3d6b63;
                            border: none;
                            color: white;
                            padding: 12px 30px;
                            border-radius: 40px;
                            font-size: 1.1rem;
                            font-weight: 600;
                            cursor: pointer;
                            border: 2px solid #6bb5a8;
                        ">✓ YES</button>
                        <button class="confirm-no" style="
                            background: #2a4a45;
                            border: none;
                            color: #b0d9d0;
                            padding: 12px 30px;
                            border-radius: 40px;
                            font-size: 1.1rem;
                            font-weight: 600;
                            cursor: pointer;
                            border: 2px solid #3a605a;
                        ">✗ NO</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(confirmModal);
            
            // Handle YES click
            confirmModal.querySelector('.confirm-yes').addEventListener('click', function() {
                const completed = { ...tasks[taskIndex], completed: true };
                completedTasks.unshift(completed);
                tasks.splice(taskIndex, 1);
                renderCrystals();
                renderLegacyHall();
                renderCalendar();
                updateBuddyMessage(`✨ Completed: ${completed.name}`);
                updateFocusScore(25);
                document.body.removeChild(confirmModal);
            });
            
            // Handle NO click
            confirmModal.querySelector('.confirm-no').addEventListener('click', function() {
                document.body.removeChild(confirmModal);
                updateBuddyMessage(`👌 Quest kept: "${task.name}"`);
            });
            
            // Close if clicking outside (optional)
            confirmModal.addEventListener('click', function(e) {
                if (e.target === confirmModal) {
                    document.body.removeChild(confirmModal);
                }
            });
        }
    });
});
        }

        function renderLegacyHall() {
            const container = document.getElementById('relicsContainer');
            document.getElementById('completedCount').textContent = completedTasks.length;
            document.getElementById('totalRelicsSidebar').textContent = completedTasks.length;
            
            if (completedTasks.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding:20px; color:#8fc1b5;">🏺 No completed quests yet</div>';
                return;
            }

            let html = '';
            completedTasks.slice(0, 4).forEach(task => {
                const icon = task.type === 'urgent' ? '🔴' : task.type === 'creative' ? '🎵' : '⚙️';
                html += `
                    <div class="download-item">
                        <span class="download-icon">${icon}</span>
                        <div class="download-info">
                            <div class="download-title">${task.name}</div>
                            <div class="download-meta">${task.type} · Completed</div>
                            <div class="download-progress"><div class="bar" style="width:100%"></div></div>
                        </div>
                        <span class="download-size">${task.deadline || ''}</span>
                    </div>
                `;
            });
            container.innerHTML = html;
        }

        // ==================== CALENDAR ====================
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        function renderCalendar() {
            const grid = document.getElementById('calendarGrid');
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            document.getElementById('currentMonthYear').textContent = `${monthNames[currentMonth]} ${currentYear}`;
            
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
            const today = new Date();
            
            let html = '';
            
            for (let i = 0; i < firstDay; i++) {
                html += '<div class="cal-day"></div>';
            }
            
            for (let d = 1; d <= lastDate; d++) {
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const hasTask = tasks.some(t => t.deadline === dateStr && !t.completed);
                const isToday = today.getDate() === d && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
                
                html += `<div class="cal-day ${hasTask ? 'has-task' : ''} ${isToday ? 'today' : ''}">${d}</div>`;
            }
            
            grid.innerHTML = html;
        }

        // ==================== UPDATE BUDDY MESSAGE ====================
        function updateBuddyMessage(message) {
            document.getElementById('buddyMessage').textContent = message;
        }

        // ==================== POMODORO TIMER ====================
let pomodoroTime = 1500; // 25 minutes
let pomodoroInterval = null;
let pomodoroActive = false;
let isBreakTime = false; // Track if we're on break
let focusSessionsCompleted = 0;
const mainTimer = document.getElementById('mainTimer');
const ghostTimer = document.getElementById('ghostTimer');
const sessionCountSpan = document.getElementById('sessionCount');

// Audio context for sound (simple beep)
function playBeep() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function updateTimerDisplay() {
    const mins = Math.floor(pomodoroTime / 60);
    const secs = pomodoroTime % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    mainTimer.textContent = timeStr;
    if (ghostTimer) ghostTimer.textContent = timeStr;
}

function checkBrainResetReminder() {
    if (sessionCount >= SESSIONS_FOR_BRAIN_RESET) {
        document.getElementById('brainReminder').textContent = '🧘 Time!';
        document.getElementById('brainReminder').style.background = '#ffd966';
        document.getElementById('brainReminder').style.color = '#1a3330';
        updateBuddyMessage("🧠 Time for a Brain Reset! 4 sessions completed!");
    }
}

// Close confirmation modal when clicking outside
document.getElementById('confirmationModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

// Close break modal when clicking outside (optional - but ready button is main action)
document.getElementById('breakModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
        // Optional: automatically start break? Or just close
        // startBreak(); // Uncomment if you want auto-start on outside click
    }
});

// Show break modal
function showBreakModal() {
    playBeep();
    document.getElementById('breakModal').style.display = 'flex';
}

// Start break
function startBreak() {
    isBreakTime = true;
    pomodoroTime = 300; // 5 minutes
    updateTimerDisplay();
    document.getElementById('breakModal').style.display = 'none';
    updateBuddyMessage("☕ Break time! 5 minutes to recharge.");
    
    // Auto-start break timer
    if (pomodoroInterval) clearInterval(pomodoroInterval);
    pomodoroActive = true;
    pomodoroInterval = setInterval(() => {
        if (pomodoroTime > 0 && pomodoroActive) {
            pomodoroTime--;
            updateTimerDisplay();
        } else if (pomodoroTime === 0) {
            clearInterval(pomodoroInterval);
            // Break ended, go back to focus
            isBreakTime = false;
            pomodoroTime = 1500; // 25 minutes
            updateTimerDisplay();
            updateBuddyMessage("⏰ Break's over! Ready for another focus session?");
            playBeep();
        }
    }, 1000);
}

// Confirmation modal functionality
function showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmationModal').style.display = 'flex';
    
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    
    // Remove previous listeners
    const newConfirmYes = confirmYes.cloneNode(true);
    const newConfirmNo = confirmNo.cloneNode(true);
    confirmYes.parentNode.replaceChild(newConfirmYes, confirmYes);
    confirmNo.parentNode.replaceChild(newConfirmNo, confirmNo);
    
    // Add new listeners
    newConfirmYes.addEventListener('click', function() {
        document.getElementById('confirmationModal').style.display = 'none';
        onConfirm();
    });
    
    newConfirmNo.addEventListener('click', function() {
        document.getElementById('confirmationModal').style.display = 'none';
    });
}

// Timer controls with confirmation
document.getElementById('mainPauseTimer').addEventListener('click', function() {
    showConfirmModal(
        '⏸️ Pause Timer?',
        'Are you sure you want to pause the current session?',
        function() {
            pomodoroActive = false;
            clearInterval(pomodoroInterval);
            updateBuddyMessage("⏸️ Timer paused");
        }
    );
});

document.getElementById('mainResetTimer').addEventListener('click', function() {
    showConfirmModal(
        '↺ Reset Timer?',
        'Are you sure you want to reset the timer? Current progress will be lost.',
        function() {
            pomodoroActive = false;
            clearInterval(pomodoroInterval);
            pomodoroTime = isBreakTime ? 300 : 1500;
            updateTimerDisplay();
            updateBuddyMessage("↺ Timer reset");
        }
    );
});

// Debug button - 10 seconds
document.getElementById('debugTimerBtn').addEventListener('click', function() {
    showConfirmModal(
        '🐛 Debug Mode',
        'Set timer to 10 seconds for testing?',
        function() {
            pomodoroActive = false;
            clearInterval(pomodoroInterval);
            pomodoroTime = 10; // 10 seconds
            isBreakTime = false;
            updateTimerDisplay();
            updateBuddyMessage("🐛 Debug mode: 10 seconds");
        }
    );
});

// Start timer (no confirmation needed)
document.getElementById('mainStartTimer').addEventListener('click', function() {
    if (pomodoroInterval) clearInterval(pomodoroInterval);
    pomodoroActive = true;
    pomodoroInterval = setInterval(() => {
        if (pomodoroTime > 0 && pomodoroActive) {
            pomodoroTime--;
            updateTimerDisplay();
        } else if (pomodoroTime === 0) {
            clearInterval(pomodoroInterval);
            
            if (isBreakTime) {
                // Break ended
                isBreakTime = false;
                pomodoroTime = 1500; // 25 minutes
                updateTimerDisplay();
                updateBuddyMessage("⏰ Break's over! Ready for another focus session?");
                playBeep();
            } else {
                // Focus session ended
                focusSessionsCompleted++;
                sessionCount++;
                sessionCountSpan.textContent = sessionCount;
                updateFocusScore(25);
                checkBrainResetReminder();
                
                // Show break modal
                showBreakModal();
                playBeep();
            }
        }
    }, 1000);
});

// Ready for break button
document.getElementById('readyBreakBtn').addEventListener('click', function() {
    startBreak();
});

        // ==================== EVENT LISTENERS ====================
        document.addEventListener('DOMContentLoaded', function() {
            renderCrystals();
            renderLegacyHall();
            renderCalendar();
            updateTimerDisplay();
            updateFocusScore(0);
            updateSparksFeed();
            setInterval(updateSparksTimer, 60000); // Update timer every minute
            
            // Rotate buddy messages
            let msgIndex = 0;
            setInterval(() => {
                msgIndex = (msgIndex + 1) % buddyMessages.length;
                document.getElementById('buddyMessage').textContent = buddyMessages[msgIndex];
            }, 8000);
        });

        // Summon new task
        document.getElementById('summonTaskBtn').addEventListener('click', function() {
            const nameInput = document.getElementById('taskNameInput');
            const name = nameInput.value.trim();
            
            if (!name) {
                updateBuddyMessage("✨ Give your quest a name!");
                return;
            }
            
            const activeType = document.querySelector('.type-option.active');
            const type = activeType ? activeType.dataset.type : 'creative';
            const deadline = document.getElementById('taskDateInput').value;
            
            const newTask = {
                id: Date.now() + '',
                name: name,
                type: type,
                deadline: deadline,
                completed: false
            };
            
            tasks.push(newTask);
            renderCrystals();
            renderCalendar();
            
            nameInput.value = '';
            updateBuddyMessage(`✨ New quest: "${name}"`);
        });

        // Type selector
        document.querySelectorAll('.type-option').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.type-option').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Calendar navigation
        document.getElementById('prevMonthBtn').addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });

        document.getElementById('nextMonthBtn').addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });

        // Music player
        document.querySelectorAll('.track-item').forEach(track => {
            track.addEventListener('click', function() {
                document.querySelectorAll('.track-item').forEach(t => t.classList.remove('playing'));
                this.classList.add('playing');
                const trackName = this.querySelector('.track-name').textContent;
                updateBuddyMessage(`🎵 Playing: ${trackName}`);
            });
        });

        // Buddy click
        document.getElementById('buddyAvatar').addEventListener('click', function() {
            const randomMsg = buddyMessages[Math.floor(Math.random() * buddyMessages.length)];
            updateBuddyMessage(randomMsg);
            
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });

        // Timer controls
        document.getElementById('mainStartTimer').addEventListener('click', function() {
            if (pomodoroInterval) clearInterval(pomodoroInterval);
            pomodoroActive = true;
            pomodoroInterval = setInterval(() => {
                if (pomodoroTime > 0 && pomodoroActive) {
                    pomodoroTime--;
                    updateTimerDisplay();
                } else if (pomodoroTime === 0) {
                    clearInterval(pomodoroInterval);
                    sessionCount++;
                    document.getElementById('sessionCount').textContent = sessionCount;
                    updateBuddyMessage("⏰ Session complete! Great focus! +25 focus");
                    updateFocusScore(25);
                    checkBrainResetReminder();
                    
                    // Reset to next session
                    pomodoroTime = 1500;
                    updateTimerDisplay();
                }
            }, 1000);
        });

        document.getElementById('mainPauseTimer').addEventListener('click', function() {
            pomodoroActive = false;
            clearInterval(pomodoroInterval);
        });

        document.getElementById('mainResetTimer').addEventListener('click', function() {
            pomodoroActive = false;
            clearInterval(pomodoroInterval);
            pomodoroTime = 1500;
            updateTimerDisplay();
        });

        // Ghost mode
        document.getElementById('enterGhostModeBtn')?.addEventListener('click', function() {
            const activeTasks = tasks.filter(t => !t.completed);
            if (activeTasks.length === 0) {
                updateBuddyMessage("✨ Summon a crystal first!");
                return;
            }
            
            const randomTask = activeTasks[Math.floor(Math.random() * activeTasks.length)];
            document.getElementById('ghostTask').textContent = randomTask.name;
            document.getElementById('ghostDimension').classList.add('active');
            document.body.style.overflow = 'hidden';
            ghostTimer.textContent = mainTimer.textContent;
        });

        document.getElementById('ghostExit').addEventListener('click', function() {
            document.getElementById('ghostDimension').classList.remove('active');
            document.body.style.overflow = '';
            updateFocusScore(-15); // -15 for leaving early
            updateBuddyMessage("👻 Left ghost mode early. Focus -15");
        });

        document.getElementById('ghostComplete').addEventListener('click', function() {
            const taskName = document.getElementById('ghostTask').textContent;
            const taskIndex = tasks.findIndex(t => t.name === taskName && !t.completed);
            
            if (taskIndex !== -1) {
                const completed = { ...tasks[taskIndex], completed: true };
                completedTasks.unshift(completed);
                tasks.splice(taskIndex, 1);
                renderCrystals();
                renderLegacyHall();
                renderCalendar();
                updateBuddyMessage(`✨ Completed: ${taskName}`);
                updateFocusScore(30); // +30 for completing in ghost mode
            }
            
            const activeTasks = tasks.filter(t => !t.completed);
            if (activeTasks.length > 0) {
                const nextTask = activeTasks[Math.floor(Math.random() * activeTasks.length)];
                document.getElementById('ghostTask').textContent = nextTask.name;
            } else {
                document.getElementById('ghostDimension').classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Brain reset
        const brainModal = document.getElementById('brainResetModal');
        document.getElementById('brainResetBtn').addEventListener('click', function() {
            brainModal.classList.add('active');
            if (sessionCount >= SESSIONS_FOR_BRAIN_RESET) {
                sessionCount = 0;
                document.getElementById('sessionCount').textContent = sessionCount;
                document.getElementById('brainReminder').textContent = 'Ready';
                document.getElementById('brainReminder').style.background = '#ffd966';
            }
        });

        document.getElementById('closeMeditationBtn').addEventListener('click', function() {
            brainModal.classList.remove('active');
            if (meditationInterval) clearInterval(meditationInterval);
        });

        // Meditation
        let meditationInterval = null;
        let meditationSeconds = 30;
        const breathingPhase = document.getElementById('breathingPhase');
        const meditationTimer = document.getElementById('meditationTimer');

        document.getElementById('startMeditationBtn').addEventListener('click', function() {
            if (meditationInterval) clearInterval(meditationInterval);
            
            meditationSeconds = 30;
            meditationTimer.textContent = '00:30';
            
            meditationInterval = setInterval(() => {
                meditationSeconds--;
                const mins = Math.floor(meditationSeconds / 60);
                const secs = meditationSeconds % 60;
                meditationTimer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                
                if (meditationSeconds % 10 < 5) {
                    breathingPhase.textContent = 'INHALE';
                } else {
                    breathingPhase.textContent = 'EXHALE';
                }
                
                if (meditationSeconds <= 0) {
                    clearInterval(meditationInterval);
                    meditationTimer.textContent = '00:00';
                    breathingPhase.textContent = '✨ DONE';
                    updateBuddyMessage("🧘 Brain reset complete! +50 focus!");
                    updateFocusScore(50);
                }
            }, 1000);
        });