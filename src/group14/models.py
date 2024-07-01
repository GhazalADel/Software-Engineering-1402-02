from django.db import models
from database.query import create_db_connection, create_table
from database.secret import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
import mysql.connector as mysql

db_connection = None

class Card(models.Model):
    id = models.AutoField(primary_key=True)
    front_value = models.CharField(max_length=255)
    back_value = models.CharField(max_length=255)
    box_number = models.IntegerField()
    # user = models.ForeignKey(Users, on_delete=models.CASCADE)
    last_review = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)


def get_db_connection():
    global db_connection
    if db_connection is None:
        db_connection = create_db_connection(DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
    return db_connection


def create_card_table():
    mydb = get_db_connection()
    query = """
    CREATE TABLE cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        front_value VARCHAR(255) NOT NULL UNIQUE,
        back_value VARCHAR(255) NOT NULL,
        box_number INT NOT NULL DEFAULT 1,
        user_id INT NOT NULL,
        last_review INT DEFAULT 0, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id_box_number (user_id, box_number),
        CHECK (box_number >= 0 AND box_number < 6)
    );
    """
    create_table(mydb, query)


def is_front_unique(front, excluded_card_id):
    mydb = get_db_connection()
    cursor = mydb.cursor()
    try:
        if excluded_card_id is None:
            query = f"SELECT * FROM cards WHERE front_value = %s"
            cursor.execute(query, (front,))
        else:
            query = f"SELECT * FROM cards WHERE front_value = %s AND id != %s"
            cursor.execute(query, (front, excluded_card_id))
        
        result = cursor.fetchone()

        if result:
            return False
    except Exception as e:
        print(f"The error '{e}' occurred")
        return None
    finally:
        cursor.close()
    return True


def create_card(front,back,user_id):
    mydb = get_db_connection()
    my_cursor = mydb.cursor()

    add_card_query = """
       INSERT INTO cards (front_value, back_value, user_id)
       VALUES (%s, %s, %s);
       """

    try:
        my_cursor.execute(add_card_query, (front, back, user_id))
        mydb.commit()
        print("Card saved successfully.")
    except mysql.Error as err:
        print("Failed to insert user:", err)
    finally:
        my_cursor.close()

def update_card(front,back,card_id):
    mydb = get_db_connection()
    my_cursor = mydb.cursor()

    update_card_query = """
       UPDATE cards
       SET front_value=%s, back_value=%s
       WHERE id = %s;
       """

    try:
        my_cursor.execute(update_card_query, (front, back, card_id))
        mydb.commit()
        print("Card saved successfully.")
    except mysql.Error as err:
        print("Failed to save card:", err)
    finally:
        my_cursor.close()

def fetch_cards(user_id):
    mydb = get_db_connection()
    my_cursor = mydb.cursor()

    list_cards_query = """
        SELECT id, front_value, back_value
        FROM cards
        WHERE user_id = %s;
        """
    
    try:
        my_cursor.execute(list_cards_query, (user_id,))
        rows = my_cursor.fetchall()
        columns = [col[0] for col in my_cursor.description]
        cards = [
            dict(zip(columns, row))
            for row in rows
        ]

        print("Cards retreived successfully.")
    except mysql.Error as err:
        print("Failed to list cards:", err)
    finally:
        my_cursor.close()
    return cards

def delete_desired_card(card_id):
    mydb = get_db_connection()
    my_cursor = mydb.cursor()

    delete_card_query = """
       DELETE FROM cards
       WHERE id = %s;
       """

    try:
        my_cursor.execute(delete_card_query, (card_id,))
        mydb.commit()
        print("Card deleted successfully.")
    except mysql.Error as err:
        print("Failed to delete card:", err)
    finally:
        my_cursor.close()

def get_this_session_cards(user_id, this_session_num):
    # Each box has a number assigned to it. We use that number to make intervals to review sessions.
    # E.g. if a card is in box_number 2, the 2nd time the user clicks on review, the card is shown to the user. 
    # Box1: 0. Initial box. First (next) session.
    # Box2: 1. Second session.
    # Box3: 3. Fourth session.
    # Box4: 5. Sixth session.
    # Box5: 8. Ninth session.

    mydb = get_db_connection()
    my_cursor = mydb.cursor()

    list_this_session_cards_query = """
        SELECT c.id, c.front_value, c.back_value, c.last_review, c.box_number
        FROM cards c
        WHERE user_id = %s AND 
            %s - c.last_review >= (
                CASE
                    WHEN c.box_number = 1 THEN 0
                    WHEN c.box_number = 2 THEN 1
                    WHEN c.box_number = 3 THEN 3
                    WHEN c.box_number = 4 THEN 5
                    WHEN c.box_number = 5 THEN 8
                END
            );
        """
    
    try:
        my_cursor.execute(list_this_session_cards_query, (user_id, this_session_num))
        rows = my_cursor.fetchall()
        columns = [col[0] for col in my_cursor.description]
        cards = [
            dict(zip(columns, row))
            for row in rows
        ]

        print("This session's cards retreived successfully.")
    except mysql.Error as err:
        print("Failed to list this session's cards:", err)
    finally:
        my_cursor.close()
    return cards

def feedback_card(this_session_num, correct_guess, user_id, card_id):
    mydb = get_db_connection()
    my_cursor = mydb.cursor()

    if correct_guess:
        feedback_query = """
            UPDATE cards
            SET last_review = %s,
            box_number = CASE
                WHEN box_number < 5 THEN box_number + 1
                ELSE box_number
            END
            WHERE user_id = %s AND id = %s;
        """
    else:
        feedback_query = """
            UPDATE cards
            SET last_review = %s,
            box_number = 0
            WHERE user_id = %s AND id = %s;
        """

    try:
        my_cursor.execute(feedback_query, (this_session_num, user_id, card_id))
        mydb.commit()
        print("Card updated successfully.")
    except mysql.Error as err:
        print("Failed to update card:", err)
    finally:
        my_cursor.close()