import psycopg2
import smtplib
from email.mime.text import MIMEText
from datetime import datetime
import pytz
import time
import logging
from dotenv import load_dotenv
import os

load_dotenv()

# Database connection details
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Email credentials
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# Set up logging
LOG_PATH = os.path.join(os.path.dirname(__file__), 'medication_reminder.log')
logging.basicConfig(filename=LOG_PATH, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

def get_due_medications():
    """Fetch users who need to take their medication now and haven't received a reminder yet."""
    conn = psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
    )
    cursor = conn.cursor()

    # Get current time in UTC
    now = datetime.now(pytz.utc)

    query = """
    SELECT u.email, u.first_name, p.medication, p.amount, p.description, p.id
    FROM prescriptions p
    JOIN users u ON p.patient = u.id
    WHERE p.next_scheduled_time <= %s
    AND (p.last_sent_time IS NULL OR p.last_sent_time < p.next_scheduled_time)
    AND u.email IS NOT NULL;
    """
    
    cursor.execute(query, (now,))
    results = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return results

def mark_email_sent(prescription_id):
    """Mark that an email has been sent for this prescription."""
    conn = psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
    )
    cursor = conn.cursor()
    query = "UPDATE prescriptions SET last_sent_time = %s WHERE id = %s"
    cursor.execute(query, (datetime.now(pytz.utc), prescription_id))
    conn.commit()
    cursor.close()
    conn.close()
    logging.info(f"Updated last_sent_time for prescription ID {prescription_id}.")

def send_email(to_email, first_name, medication, amount, description, prescription_id):
    """Send email reminder."""
    subject = f"Time for your {medication} medication"
    body = f"Hi {first_name},\n\nIt's time to take your {medication} medication. Take {amount} pills."
    
    # Add the description only if it's not null or empty
    if description:
        body += f"\n\nMedication Description: {description}"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.sendmail(EMAIL_ADDRESS, to_email, msg.as_string())
        server.quit()
        logging.info(f"Email sent to {to_email} for medication {medication}.")

        # Update last_sent_time after successful email send
        mark_email_sent(prescription_id)
    except Exception as e:
        logging.error(f"Error sending email to {to_email}: {e}")

def main():
    """Main function to check and send medication reminders."""
    while True:
        due_medications = get_due_medications()
        if due_medications:
            for email, first_name, medication, amount, description, prescription_id in due_medications:
                send_email(email, first_name, medication, amount, description, prescription_id)
        else:
            logging.info("No medications are due at this time.")
        
        # Sleep for 60 seconds before checking again
        time.sleep(60)

if __name__ == "__main__":
    logging.info("Starting medication reminder script.")
    main()
