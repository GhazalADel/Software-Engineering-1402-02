# My Django Project

## Project Description
This project is a web application built using Django that allows users to manage and learn from flashcards. Users can add new cards, edit, delete, and review cards in learning sessions.

## Installation

### Prerequisites
- Python 3.10
- Docker (optional for containerized setup)

### Steps
1. Clone the repository:
    ```sh
    git clone https://github.com/GhazalADel/Software-Engineering-1402-02
    ```

2. Create and activate a virtual environment:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install dependencies:
    ```sh
    pip install -r requirements.txt
    ```

4. Set up the database:
    ```sh
    python manage.py migrate
    ```

5. Create a superuser for the admin site:
    ```sh
    python manage.py createsuperuser
    ```

6. Run the development server:
    ```sh
    python manage.py runserver
    ```

## Using Docker

1. Build the Docker image:
    ```sh
    docker build -t my_django_app .
    ```

2. Run the Docker container:
    ```sh
    docker run -p 8000:8000 my_django_app
    ```

## Usage

### Available Endpoints
- **Home**: `/` - Displays the homepage.
- **Add New Card**: `/add-new-card/` - Endpoint to add a new flashcard.
- **List Cards**: `/list-cards/` - Endpoint to list all flashcards.
- **Edit Card**: `/edit-card/<int:card_id>/` - Endpoint to edit a specific flashcard.
- **Delete Card**: `/delete-card/<int:card_id>/` - Endpoint to delete a specific flashcard.
- **Learn Cards**: `/learn-cards/` - Endpoint to start a learning session with flashcards.
- **Increment Session**: `/increment-session/` - Endpoint to increment the learning session.
- **Learn Next Card**: `/learn-next-card/` - Endpoint to review the next card in the session.
- **Learn Feedback**: `/learn-feedback/<int:card_id>/` - Endpoint to provide feedback on a specific card.

### Configuration
Ensure you have the following environment variables set in `secret.py`:

```python
DB_NAME = 'defaultdb'
DB_USER = 'avnadmin'
DB_PASSWORD = 'AVNS_QXs1v9qBTveDtLIXZfW'
DB_HOST = 'mysql-374f4726-majidnamiiiii-e945.a.aivencloud.com'
DB_PORT = '11741'
