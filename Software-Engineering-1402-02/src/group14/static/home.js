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

document.getElementById('list-cards-btn').addEventListener('click', function () {
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
                cardElement.className = 'card';
                let contentElement = document.createElement('div');
                contentElement.className = 'content';
                let frontElement = document.createElement('div');
                frontElement.className = 'front';
                frontElement.textContent = card.front_value;
                let backElement = document.createElement('div');
                backElement.className = 'back';
                backElement.textContent = card.back_value;
                contentElement.appendChild(frontElement);
                contentElement.appendChild(backElement);
                cardElement.appendChild(contentElement);
                cardsContainer.appendChild(cardElement);
            });
            let modal = document.getElementById('cardsModal');
            modal.style.display = "block";
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Function to close the modal
function closeModal() {
    let modal = document.getElementById('cardsModal');
    modal.style.display = "none";
}

// Close the modal when the user clicks anywhere outside of it
window.onclick = function(event) {
    let modal = document.getElementById('cardsModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}