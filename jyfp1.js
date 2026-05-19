
    const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']; // 8对
    const TOTAL_PAIRS = 8;
    const TOTAL_CARDS = TOTAL_PAIRS * 2;

    let cards = [];                 // card list
    let flippedIndices = [];        // current flipped index
    let matchedCount = 0;           // matched number
    let moves = 0;                  // steps
    let canFlip = true;             // whether can flip

    let historyList = [];   // user flip history list

    const boardEl = document.getElementById('gameBoard');
    const matchesSpan = document.getElementById('matchesCount');
    const movesSpan = document.getElementById('movesCount');
    const messageEl = document.getElementById('messageArea');
    const historyListEl = document.getElementById('historyList');
    const resetBtn = document.getElementById('resetBtn');

    // initial cards function
    function initCards() {
        let cards = [];
        for (let i = 0; i < TOTAL_PAIRS; i++) {
            cards.push({ emoji: EMOJIS[i], matched: false, flipped: false });
            cards.push({ emoji: EMOJIS[i], matched: false, flipped: false });
        }
        // reset cards
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }

    // update board 
    function renderBoard() {
        let html = '';
        cards.forEach((card, index) => {
            let cardClass = 'card';
            if (card.matched) cardClass += ' matched';
            else if (card.flipped) cardClass += ' flipped';
            
            html += `<div class="${cardClass}" data-index="${index}">`;
            if (card.matched || card.flipped) {
                html += card.emoji;
            } else {
                html += '❓';  // backside
            }
            html += '</div>';
        });
        boardEl.innerHTML = html;
        
        // update matched number and moves
        matchesSpan.textContent = matchedCount;
        movesSpan.textContent = moves;
    }

    // update history function
    function addHistoryRecord(action, emoji1 = '', emoji2 = '', result = '') {
        let record = '';
        
        historyList.push(record);
        
        updateHistoryDisplay();  // update display
    }

    // update history
    function updateHistoryDisplay() {
        historyListEl.innerHTML = '';
        if (historyList.length == 0) {
            historyListEl.innerHTML = '<div class="history-item">游戏开始</div>';
        } else {
            historyList.forEach(item => {
                const div = document.createElement('div');
                div.className = 'history-item';
                div.textContent = item;
                historyListEl.appendChild(div);
            });
        }
    }

    // define check if two cards matched
    function checkMatch(index1, index2) {
        
        const card1 = cards[index1];
        const card2 = cards[index2];
        
        // check if the two emoji matched
        if (card1.emoji == card2.emoji) {
            // matched
            card1.matched = true;
            card2.matched = true;
            matchedCount++;
            
            // check if win
            if (matchedCount == TOTAL_PAIRS) {
                messageEl.textContent = '🎉 Congratulations! 🎉';
            }
            
            return true;
        } else {
            // not matched
            return false;
        }
    }

    // flip
    function handleCardClick(index) {
        // can not flip
        if (!canFlip) return;
        if (cards[index].matched) return;  
        if (cards[index].flipped) return; 
        if (flippedIndices.length == 2) return;

        // flip a card
        cards[index].flipped = true;
        flippedIndices.push(index);
        
        // flip another card
        if (flippedIndices.length == 2) {
            moves++;
            movesSpan.textContent = moves;
            const idx1 = flippedIndices[0];
            const idx2 = flippedIndices[1];
            
            // call check if matched
            const isMatch = checkMatch(idx1, idx2);
            
            if (isMatch) {
                flippedIndices = [];
                renderBoard();
            } else {
                canFlip = false;
                renderBoard();
                
                
                timeoutId = setTimeout(() => {
                    // flip back
                    cards[idx1].flipped = false;
                    cards[idx2].flipped = false;
                    flippedIndices = [];
                    canFlip = true;
                    renderBoard();
                    timeoutId = null;
                }, 800);
            }
        }
        
        renderBoard();
    }

    // reset game
    function resetGame() {
        cards = initCards();
        flippedIndices = [];
        matchedCount = 0;
        moves = 0;
        canFlip = true;
        
        // clear history list
        historyList = [];
        addHistoryRecord('reset');
        
        messageEl.textContent = '';  //win or not
        
        renderBoard();
    }

    // add event listener
    boardEl.addEventListener('click', (e) => {
        const cardDiv = e.target.closest('.card');
        if (!cardDiv) return;
        
        const index = cardDiv.dataset.index;
        if (index !== undefined) {
            handleCardClick(parseInt(index));
        }
    });

    resetBtn.addEventListener('click', resetGame);

    resetGame();

