let openForm = function () {
    let main_button = document.getElementById('mainButton');
    main_button.className = 'active';
};

let checkBackInput = function (input) {
    input.className = 'active';
};

let checkFrontInput = function (input) {
    if (input.value.length > 0) {
        input.className = 'active';
    } else {
        input.className = '';
    }
};

let updateFront = function (input) {
    let frontText = input.value.trim();
    let frontElement = document.querySelector('.front');
    if (frontText !== '') {
        frontElement.textContent = frontText;
    } else {
        frontElement.textContent = '[Front!]';
    }
}

function updateBack(input) {
    let backText = input.value.trim();
    let backElement = document.querySelector('.back');
    if (backText !== '') {
        backElement.textContent = backText;
    } else {
        backElement.textContent = '[Back!]';
    }
}

let closeForm = function () {
    let main_button = document.getElementById('mainButton');
    main_button.className = '';
    clearError();
    clearInputs();
};

document.addEventListener("keyup", function (e) {
    if (e.key === "Escape" || e.key === "Enter") {
        closeForm();
    }
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.getElementById('add-card-btn').addEventListener('click', function () {
    let front_input = document.getElementById("front");
    let frontText = front_input.value.trim();
    let back_input = document.getElementById("back");
    let backText = back_input.value.trim();
    let errorLabel = document.getElementById("front_error");

    if (frontText === '') {
        errorLabel.textContent = 'front value can\'t be empty';
        errorLabel.style.display = 'block';
    } else {
        const data = {
            front: frontText,
            back: backText,
        };

        const csrftoken = getCookie('csrftoken');

        fetch('/group14/add-new-card/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                if (!data["error"]) {
                    closeForm()
                    showSuccessMessage('Card added successfully!')
                } else {
                    errorLabel.textContent = data["error"];
                    errorLabel.style.display = 'block';
                    clearInputs();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});

function clearError() {
    let errorLabel = document.getElementById("front_error");
    errorLabel.textContent = '';
    errorLabel.style.display = 'none';
}

function clearInputs() {
    let frontInput = document.getElementById("front");
    let backInput = document.getElementById("back");
    frontInput.value = '';
    backInput.value = '';
    let frontElement = document.querySelector('.front');
    frontElement.textContent = '[Front!]';
    let backElement = document.querySelector('.back');
    backElement.textContent = '[Back!]';
}

document.getElementById('list-cards-btn').addEventListener('click', fetchAndDisplayCards);

function fetchAndDisplayCards() {
    const csrftoken = getCookie('csrftoken');
    fetch('/group14/list-cards/',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        })
        .then(response => response.json())
        .then(data => {
            let cardsContainer = document.getElementById('cardsContainer');
            cardsContainer.innerHTML = '';  // Clear any existing content

            data.forEach(card => {
                let cardElement = document.createElement('div');
                cardElement.className = 'card-item';
                cardElement.dataset.id = card.id;

                let actionsElement = document.createElement('div');
                actionsElement.className = 'card-actions';

                let contentElement = document.createElement('div');
                contentElement.className = 'card-content';
                let frontElement = document.createElement('div');
                frontElement.className = 'updatedFront';
                frontElement.id = 'updatedFront';
                frontElement.textContent = card.front_value;
                let backElement = document.createElement('div');
                backElement.className = 'updatedBack';
                backElement.id = 'updatedBack';
                backElement.textContent = card.back_value;

                contentElement.appendChild(frontElement);
                contentElement.appendChild(backElement);
                cardElement.appendChild(contentElement);

                // Add edit button
                let editButton = document.createElement('button');
                editButton.className = 'edit-button';
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => openEditForm(card));
                actionsElement.appendChild(editButton);

                // Add delete button
                let deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteCard(card.id));
                actionsElement.appendChild(deleteButton);
                
                cardElement.appendChild(actionsElement);
                cardsContainer.appendChild(cardElement);
            });
            let modal = document.getElementById('cardsModal');
            modal.style.display = "block";
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

window.onclick = function(event) {
    
    if (event.target == cardsModal) {
        cardsModal.style.display = "none";
    }
    if (event.target == editCardModal) {
        closeEditForm();
    }
    if (event.target == sessionModal) {
        closeSessionModal();
    }
    if (event.target == feedbackModal) {
        closeFeedbackModal();
    }
    if (event.target == messageModal) {
        closeMessageModal();
    }
}

function closeModal() {
    let modal = document.getElementById('cardsModal');
    modal.style.display = "none";
}

let openEditForm = function(card) {
    let editForm = document.getElementById('editCardModal');
    let editCardIdInput = document.getElementById('editCardId');
    let editFrontInput = document.getElementById('editFront');
    let editBackInput = document.getElementById('editBack');
    let editFrontPreview = document.getElementById('editFrontPreview');
    let editBackPreview = document.getElementById('editBackPreview');

    // Set values from card data
    editCardIdInput.value = card.id;
    editFrontInput.value = card.front_value;
    editBackInput.value = card.back_value;
    editFrontPreview.textContent = card.front_value;
    editBackPreview.textContent = card.back_value;

    // Add event listeners to update previews
    editFrontInput.addEventListener('input', function() {
        editFrontPreview.textContent = this.value;
    });

    editBackInput.addEventListener('input', function() {
        editBackPreview.textContent = this.value;
    });

    editForm.style.display = "block";
};

let closeEditForm = function() {
    let editForm = document.getElementById('editCardModal');
    editForm.style.display = 'none'
    clearEditError();
    clearEditInputs();
    fetchAndDisplayCards();
};

document.getElementById('saveEditBtn').addEventListener('click', function () {
    const csrftoken = getCookie('csrftoken');
    const cardId = document.getElementById('editCardId').value;
    const updatedFront = document.getElementById('editFront').value;
    const updatedBack = document.getElementById('editBack').value;
    let errorLabel = document.getElementById("edit_front_error");

    if (updatedFront === '') {
        errorLabel.textContent = 'Front value can\'t be empty';
        errorLabel.style.display = 'block';
    } else {
        errorLabel.style.display = 'none';
        const data = {
            id: cardId,
            front: updatedFront,
            back: updatedBack,
        };
        fetch(`/group14/edit-card/${cardId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            // Update the card in the modal
            showSuccessMessage(data.message)
            let frontElement = document.querySelector('.updatedFront');
            let backElement = document.querySelector('.updatedBack');
            
            if (frontElement) {
                frontElement.textContent = updatedFront;
            } else {
                console.error('Front element not found');
            }

            if (backElement) {
                backElement.textContent = updatedBack;
            } else {
                console.error('Back element not found');
            }

            showSuccessMessage('Card edited successfully!')
            closeEditForm();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

function clearEditError() {
    let errorLabel = document.getElementById("edit_front_error");
    errorLabel.textContent = '';
    errorLabel.style.display = 'none';
}

function clearEditInputs() {
    document.getElementById("editFront").value = '';
    document.getElementById("editBack").value = '';
}

function deleteCard(cardId) {
    const csrftoken = getCookie('csrftoken');

    fetch(`/group14/delete-card/${cardId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        
        let cardElement = document.querySelector(`.card-item[data-id='${cardId}']`);

        if (cardElement) {
            cardElement.remove();
            showSuccessMessage('Card deleted successfully!');
        } else {
            console.error('Card element not found');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function showSuccessMessage(message) {
    let successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    document.body.appendChild(successMessage);

    // Remove success message after 2 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 2000);
}

function updateEditFront(input) {
    let frontText = input.value.trim();
    let frontElement = document.getElementById('editFrontPreview');
    if (frontText !== '') {
        frontElement.textContent = frontText;
    } else {
        frontElement.textContent = '[Front!]';
    }
}

// TODO: preview is not well located
// TODO: after success edit, modal is not updated

function updateEditBack(input) {
    let backText = input.value.trim();
    let backElement = document.getElementById('editBackPreview');
    if (backText !== '') {
        backElement.textContent = backText;
    } else {
        backElement.textContent = '[Back!]';
    }
}

document.getElementById('start-session-btn').addEventListener('click', function () {
    const csrftoken = getCookie('csrftoken');
    
    fetch('/group14/learn-cards/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    })
    .then(response => response.json())
    .then(data => {
        sessionMessage.textContent = data.message;
        if (data.message === 'Ready to start the session.') {
            document.getElementById('ready-btn').style.display = 'inline-block';
            document.getElementById('next-session-btn').style.display = 'none';
        } else if (data.message === 'No card to be reviewed. Click to go to the next session.') {
            document.getElementById('next-session-btn').style.display = 'inline-block';
            document.getElementById('ready-btn').style.display = 'none';
        }
        openSessionModal();
    })
    .catch(error => console.error('Error:', error));
});

function openSessionModal() {
    document.getElementById('sessionModal').style.display = 'block';
}

function closeSessionModal() {
    document.getElementById('sessionModal').style.display = 'none';
}

function nextSession () {
    const csrftoken = getCookie('csrftoken');
    
    fetch('/group14/increment-session/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    })
    .then(response => response.json())
    .then(data => {
        sessionMessage.textContent = data.message;
        showSuccessMessage("Proceeded to next session")
        if (data.message === 'Ready to start the session.') {
            document.getElementById('ready-btn').style.display = 'inline-block';
            document.getElementById('next-session-btn').style.display = 'none';
            openSessionModal();
        } else if (data.message === 'No card to be reviewed. Click to go to the next session.') {
            document.getElementById('next-session-btn').style.display = 'inline-block';
            document.getElementById('ready-btn').style.display = 'none';
        }
    })
    .catch(error => console.error('Error:', error));
};

function readySession() {
    const csrftoken = getCookie('csrftoken');

    fetch('/group14/learn-next-card/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    })
    .then(response => response.json())
    .then(card => {
        if (card.message) {
            alert(card.message);
        } else {
            document.getElementById('feedbackCard').querySelector('.front-text').textContent = card.front_value;
            document.getElementById('feedbackCard').querySelector('.back-text').textContent = card.back_value;
            document.getElementById('feedbackCard').querySelector('.front-id').dataset.id = card.id;
        }
        openFeedbackModal(card.front_value, card.back_value)
    })
    .catch(error => console.error('Error:', error));
    closeSessionModal();
}


let backText = document.querySelector(".back-text");
let frontText = document.querySelector(".front-text");

function openFeedbackModal(cardFront, cardBack) {
    let modal = document.getElementById('feedbackModal'); 
    let feedbackCard = document.getElementById('feedbackCard');
    frontText.textContent = cardFront;
    backText.textContent = cardBack;
    modal.style.display = 'block';
    feedbackCard.classList.remove('flipped');
}

function closeFeedbackModal() {
    document.getElementById('feedbackModal').style.display = 'none';
}
const feedbackButtons = document.getElementById('feedback-buttons');

feedbackCard.addEventListener('click', function() {
    if (!feedbackCard.classList.contains('flipped')) {
        feedbackCard.classList.add('flipped');
        feedbackButtons.classList.remove("hidden");
    } else {
        feedbackCard.classList.remove('flipped');
        feedbackButtons.classList.add("hidden");
    }
});

document.getElementById('feedbackCorrectBtn').addEventListener('click', function () {
    feedbackButtons.classList.add("hidden");
    sendFeedback(true);
});

document.getElementById('feedbackIncorrectBtn').addEventListener('click', function () {
    feedbackButtons.classList.add("hidden");
    sendFeedback(false);
});

function sendFeedback(correctGuess) {
    const cardId = document.getElementById('feedbackCard').querySelector('.front-id').dataset.id;
    const csrftoken = getCookie('csrftoken');

    fetch(`/group14/learn-feedback/${cardId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ guess: correctGuess }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            document.getElementById('start-session-btn').style.display = 'inline-block';
            document.getElementById('ready-btn').style.display = 'none';
            document.getElementById('next-session-btn').style.display = 'none';
            closeFeedbackModalAndShowMessage(data.message);
        } else {
            document.getElementById('feedbackCard').querySelector('.front-text').textContent = data.front_value;
            document.getElementById('feedbackCard').querySelector('.back-text').textContent = data.back_value;
            document.getElementById('feedbackCard').querySelector('.front-id').dataset.id = data.id;
            openFeedbackModal(data.front_value, data.back_value)
        }
    })
    .catch(error => console.error('Error:', error));
}

function closeMessageModal() {
    document.getElementById('messageModal').style.display = 'none';
}

function showMessageModal(message) {
    document.getElementById('messageContent').textContent = message;
    document.getElementById('messageModal').style.display = 'block';
}

function closeFeedbackModalAndShowMessage(message) {
    closeFeedbackModal();
    showMessageModal(message);
}