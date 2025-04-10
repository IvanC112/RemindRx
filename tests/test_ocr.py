import os
import pytest
import tempfile
from PIL import Image, ImageDraw, ImageFont
from scanner.model import extract_text_from_label

# Get the absolute path to the tests directory
# TEST_ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")

def create_image(text=None, color=(255,255,255)) -> str:
    image = Image.new("RGB", (200,100), color=color)
    
    if text:
        draw = ImageDraw.Draw(image)
        try:
            font = ImageFont.load_default()
        except IOError:
            font = None
        
        draw.text((10,40), text, fill=(0,0,0), font=font)
        
    temp_file = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    image.save(temp_file.name)
    temp_file.close()
    return temp_file.name

def test_valid_label():
    image_path = create_image("Nothing")    
    detected_text = extract_text_from_label(image_path)
    os.remove(image_path)
    assert isinstance(detected_text, str)
    # nty corresponds to "nothing"
    assert detected_text.lower() == "nty"

def test_empty_image():
    image_path = create_image()
    detected_text = extract_text_from_label(image_path)
    os.remove(image_path)
    assert detected_text == ""

def test_non_existant_file():
    with pytest.raises(FileNotFoundError):
        extract_text_from_label("/some/random/nonexistant/file.jpg")

def test_invalid_image_format():
    with tempfile.NamedTemporaryFile(suffix=".txt", delete=False, mode="w") as f:
        f.write("This is not an image")
        invalid_file_path = f.name

    with pytest.raises(ValueError):
        extract_text_from_label(invalid_file_path)

    os.remove(invalid_file_path)
