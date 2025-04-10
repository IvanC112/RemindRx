import os
import sys
import pytest
import tempfile
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scanner.e2e_scanner2db import scan_and_recommend

def create_test_image_with_text(text: str) -> str:
    """Create an image with given text and return its file path."""
    image = Image.new("RGB", (300, 100), color=(255, 255, 255))
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.load_default()
    except IOError:
        font = None
    draw.text((10, 40), text, fill=(0, 0, 0), font=font)

    temp_file = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    image.save(temp_file.name)
    temp_file.close()
    return temp_file.name

def test_scan_and_recommend():
    test_text = ""  # Modify to whatever your OCR expects to trigger [["06:00", "18:00"]]
    test_image_path = create_test_image_with_text(test_text)

    recommended_times = scan_and_recommend(test_image_path)

    os.remove(test_image_path)

    assert recommended_times == [["No matching times found"]]  # Update as needed to match actual logic
