import pytest
import os
from PIL import Image, ImageDraw, ImageFont
import tempfile

from recommend.recommendation import predict_times
from scanner.model import extract_text_from_label

# Integration test: extract + recommend
def create_test_image_with_text(text: str) -> str:
    """Creates a temporary image with given text and returns its path."""
    image = Image.new("RGB", (300, 100), color=(255, 255, 255))
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()
    draw.text((10, 40), text, fill=(0, 0, 0), font=font)

    temp_file = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    image.save(temp_file.name)
    return temp_file.name

def test_recommendation_from_text():
    """Integration test for extract_text_from_label + predict_times."""
    image_path = create_test_image_with_text("Take twice a day")
    detected_text = extract_text_from_label(image_path)
    os.remove(image_path)

    assert isinstance(detected_text, str)
    assert len(detected_text) > 0

    times = predict_times(detected_text)
    assert isinstance(times, list)
    assert len(times) > 0

# === Individual behavior tests ===

def test_non_existent_image_raises():
    """Test that a missing image path raises FileNotFoundError."""
    with pytest.raises(FileNotFoundError):
        extract_text_from_label("/path/to/non_existent.jpg")

def test_corrupted_image_raises():
    """Test that a corrupted image raises a ValueError."""
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False, mode="wb") as f:
        f.write(b"This is not a valid image file")
        corrupted_image_path = f.name

    with pytest.raises(ValueError, match="could not be read"):
        extract_text_from_label(corrupted_image_path)

    os.remove(corrupted_image_path)

def test_predict_times_with_empty_text():
    """Test that predict_times handles empty text gracefully."""
    predicted_times = predict_times("")
    assert predicted_times == ["No matching times found"], "Expected fallback message for empty input"
