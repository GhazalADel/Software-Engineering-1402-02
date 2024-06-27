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
    last_review = models.DateTimeField(null=True, blank=True)
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
        last_review DATETIME DEFAULT NULL, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id_box_number (user_id, box_number),
        CHECK (box_number > 0 AND box_number < 6)
    );
    """
    create_table(mydb, query)


def is_front_unique(front):
    mydb = get_db_connection()
    cursor = mydb.cursor()
    try:
        query = f"SELECT * FROM cards WHERE front_value = %s"
        cursor.execute(query, (front,))

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


def fetch_cards(user_id):
    mydb = get_db_connection()
    my_cursor = mydb.cursor()

    list_cards_query = """
        SELECT front_value, back_value
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