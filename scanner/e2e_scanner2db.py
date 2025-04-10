import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))) #add the parent directory to the path

from scanner.model import extract_text_from_label
from recommend.recommend2db import recommend2db

def scan_and_recommend(file_path):
    # Extract text from the label
    text = extract_text_from_label(file_path)
    
    # Recommend times based on the extracted text
    recommended_times = recommend2db(text)
    
    return recommended_times
'''
file_path = os.path.join(os.path.dirname(__file__), "images", "test_description.png") #file path for the test image
recommended_times = scan_and_recommend(file_path)
print(recommended_times)'''