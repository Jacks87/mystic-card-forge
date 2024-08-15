document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButton = document.getElementById('logout-link');
    const cardSection = document.getElementById('card-section');
    const authSection = document.getElementById('auth-section');
    const savedCardsSection = document.getElementById('saved-cards-section');
    const cardForm = document.getElementById('card-form'); 
    const loginLink = document.getElementById('login-link');
    const manaInput = document.getElementById('mana-cost');
    const manaCostDisplay = document.getElementById('mana-cost-display');
    const savedCardsContainer = document.getElementById('saved-cards');
    const createNewCardButton = document.getElementById('create-new-card-button');
    const viewSavedCardsButton = document.getElementById('view-saved-cards-button');
    const cardImageInput = document.getElementById('card-image');
    const previewImage = document.getElementById('preview-image');

    let savedCards = [];

    // Handle Login / Sign Up Link Click
    if (loginLink) {
        loginLink.addEventListener('click', function (e) {
            e.preventDefault();
            authSection.style.display = 'block'; // Show the auth section
            cardSection.style.display = 'none'; // Hide the card section
        });
    }

    // Logout Function
    if (logoutButton) {
        logoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('currentUser'); // Clear user data
            window.location.reload(); // Reload the page to reset the state
        });
    }

    // Check if the user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        authSection.style.display = 'none'; // Hide the auth section
        cardSection.style.display = 'block'; // Show the card section
        logoutButton.style.display = 'block'; // Show the logout link
        showSavedCardsSection(); // Show the saved cards section
    } else {
        authSection.style.display = 'block'; // Show the auth section
        cardSection.style.display = 'none'; // Hide the card section
        logoutButton.style.display = 'none'; // Hide the logout link
    }

    function showSavedCardsSection() {
        savedCardsSection.style.display = 'block';
        renderSavedCards();
    }

    // Handle Registration
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;

            localStorage.setItem(username, password); // Simulate registration
            alert('User registered successfully! Please log in.');

            document.getElementById('login-username').value = username;
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            const storedPassword = localStorage.getItem(username);
            if (storedPassword && storedPassword === password) {
                localStorage.setItem('currentUser', username);
                showCardSection(); // Display card creation section upon successful login
            } else {
                alert('Invalid credentials');
            }
        });
    }

    // Show card creation section after login
    function showCardSection() {
        authSection.style.display = 'none';
        cardSection.style.display = 'block';
        logoutButton.style.display = 'block';
        showSavedCardsSection();
    }

    // Handle Mana Cost Display
    if (manaInput) {
        manaInput.addEventListener('input', function () {
            const manaInputValue = this.value.toLowerCase();
            manaCostDisplay.innerHTML = ''; // Clear previous images

            const manaMap = {
                'red': 'images/red-mana.png',
                'black': 'images/black-mana.png',
                'white': 'images/white-mana.png',
                'blue': 'images/blue-mana.png',
                'green': 'images/green-mana.png',
                'colorless': 'images/colorless-mana.png',
                '1 generic': 'images/1-generic-mana.png',
                '2 generic': 'images/2-generic-mana.png',
                '3 generic': 'images/3-generic-mana.png',
                '4 generic': 'images/4-generic-mana.png',
                '5 generic': 'images/5-generic-mana.png',
                '6 generic': 'images/6-generic-mana.png',
                '7 generic': 'images/7-generic-mana.png',
                '8 generic': 'images/8-generic-mana.png',
                '9 generic': 'images/9-generic-mana.png',
                '10 generic': 'images/10-generic-mana.png'
            };

            const manaParts = manaInputValue.split(' ');

            for (let i = 0; i < manaParts.length; i += 2) {
                const count = parseInt(manaParts[i]);
                const color = manaParts[i + 1];

                if (!isNaN(count) && manaMap[`${count} ${color}`]) {
                    const manaImage = document.createElement('img');
                    manaImage.src = manaMap[`${count} ${color}`];
                    manaImage.alt = `${color} mana`;
                    manaImage.className = 'mana-icon';
                    manaCostDisplay.appendChild(manaImage);
                } else if (!isNaN(count) && manaMap[color]) {
                    for (let j = 0; j < count; j++) {
                        const manaImage = document.createElement('img');
                        manaImage.src = manaMap[color];
                        manaImage.alt = `${color} mana`;
                        manaImage.className = 'mana-icon';
                        manaCostDisplay.appendChild(manaImage);
                    }
                }
            }
        });
    }

    // Handle Image Upload
    if (cardImageInput) {
        cardImageInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    previewImage.src = event.target.result;
                    previewImage.style.display = 'block'; // Ensure the image is visible
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Handle Card Creation
    if (cardForm) {
        cardForm.addEventListener('submit', function (e) {
            e.preventDefault();
    
            // Collect card details
            const cardTitle = document.getElementById('card-title').value;
            const manaCost = document.getElementById('mana-cost-display').innerHTML;
            const rarity = document.getElementById('card-rarity').value;
            const cardType = document.getElementById('card-type').value; // Get the card type
            const subtype = document.getElementById('subtype').value; // Get the subtype
            const ability = document.getElementById('card-ability').value.replace(/\n/g, '<br>'); // Preserve line breaks
            const power = document.getElementById('card-power').value;
            const toughness = document.getElementById('card-toughness').value;
            const signature = document.getElementById('card-signature').value;
            const cardImageSrc = previewImage.src; // Capture the uploaded image source
    
            // Create card object and save it
            const card = {
                id: Date.now(), // Use a timestamp as a simple unique ID
                title: cardTitle,
                manaCost,
                rarity,
                cardType, // Store the card type
                subtype, // Store the subtype
                ability,
                power,
                toughness,
                signature,
                image: cardImageSrc, // Save the image source
                votes: 0
            };
    
            savedCards.push(card);
            renderSavedCards();
    
            // Redirect to saved cards section
            cardSection.style.display = 'none';
            savedCardsSection.style.display = 'block';
        });
    }
    

    function renderSavedCards() {
        savedCardsContainer.innerHTML = ''; // Clear existing cards

        savedCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
                <div class="card-header">
                    <h3>${card.title}</h3>
                    <div class="mana-cost">${card.manaCost}</div>
                </div>
                <div class="card-image">
                    <img src="${card.image}" alt="Card Image">
                </div>
                <div class="card-type">
                <p>${card.rarity} - ${card.subtype}</p> <!-- Displaying card type and subtype -->
                </div>
                <div class="card-text">
                    <p>${card.ability}</p>
                </div>
                <div class="card-footer">
                    <div class="power-toughness">${card.power} / ${card.toughness}</div>
                    <div class="signature">${card.signature}</div>
                </div>
                <div class="card-actions">
                    <button class="edit-card" data-id="${card.id}">Edit</button>
                    <button class="delete-card" data-id="${card.id}">Delete</button>
                    <button class="vote-card" data-id="${card.id}">Vote</button>
                    <span class="vote-count">Votes: ${card.votes}</span>
                </div>
            `;
            savedCardsContainer.appendChild(cardElement);
        });

        // Attach event listeners to the edit, delete, and vote buttons
        document.querySelectorAll('.edit-card').forEach(button => {
            button.addEventListener('click', handleEditCard);
        });

        document.querySelectorAll('.delete-card').forEach(button => {
            button.addEventListener('click', handleDeleteCard);
        });

        document.querySelectorAll('.vote-card').forEach(button => {
            button.addEventListener('click', handleVoteCard);
        });
    }

    function handleEditCard(e) {
        const cardId = e.target.getAttribute('data-id');
        const card = savedCards.find(c => c.id == cardId);

        if (card) {
            // Populate the form with the card's data for editing
            document.getElementById('card-title').value = card.title;
            document.getElementById('mana-cost-display').innerHTML = card.manaCost;
            document.getElementById('card-rarity').value = card.rarity;
            document.getElementById('card-ability').value = card.ability;
            document.getElementById('card-power').value = card.power;
            document.getElementById('card-toughness').value = card.toughness;
            document.getElementById('card-signature').value = card.signature;
            previewImage.src = card.image;

            // Remove the old card
            savedCards = savedCards.filter(c => c.id != cardId);

            // Show the card creation section
            cardSection.style.display = 'block';
            savedCardsSection.style.display = 'none';
        }
    }

    function handleDeleteCard(e) {
        const cardId = e.target.getAttribute('data-id');
        savedCards = savedCards.filter(c => c.id != cardId);
        renderSavedCards();
    }

    function handleVoteCard(e) {
        const cardId = e.target.getAttribute('data-id');
        const card = savedCards.find(c => c.id == cardId);
        const voteButton = e.target;
        const voteCountElement = voteButton.nextElementSibling;

        if (card && !voteButton.dataset.voted) {
            card.votes++;
            voteCountElement.textContent = `Votes: ${card.votes}`;
            voteButton.dataset.voted = true; // Mark that the user has voted
        }
    }

    // Handle "Create New Card" button click
    if (createNewCardButton) {
        createNewCardButton.addEventListener('click', function () {
            savedCardsSection.style.display = 'none'; // Hide the saved cards section
            cardSection.style.display = 'block'; // Show the card creation section
            cardForm.reset(); // Reset the form for a new card
            document.getElementById('mana-cost-display').innerHTML = ''; // Clear mana display
            previewImage.src = ''; // Clear the image preview
        });
    }

    // Handle "View Saved Cards" button click
    if (viewSavedCardsButton) {
        viewSavedCardsButton.addEventListener('click', function () {
            cardSection.style.display = 'none'; // Hide the card creation section
            savedCardsSection.style.display = 'block'; // Show the saved cards section
        });
    }
});
