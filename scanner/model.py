import cv2
import os
import pytesseract
import numpy as np



VALID_IMG_TYPES = {'.jpg', '.jpeg', '.png', 'bmp', '.tiff'}

def is_blank_image(image):
    mean_intensity = np.mean(image)
    print(mean_intensity)
    return mean_intensity > 250 # if the intensity is closer to 255, we know there is not much variation in the image, i.e., things are the same color with no text on it 

def preprocess_image(image_path): 
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image at {image_path} could not be found")

    _, extension = os.path.splitext(image_path)

    if extension.lower() not in VALID_IMG_TYPES:
        raise ValueError(f"Invalid file type: {extension}. Only {', '.join(VALID_IMG_TYPES)} are supported")
    
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(f"Image at {image_path} could not be read. It may be corrupted or in an unsupported format.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian Blur (helps reduce noise)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Apply Adaptive Thresholding to enhance contrast
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    return thresh


def extract_text_from_label(image_path):
    try:
        processed_image = preprocess_image(image_path)
    except FileNotFoundError as e: 
       print(f"Error: {e}")
       raise e
    except ValueError as e:
        print(f"Error: {e}")
        raise e

    # if is_blank_image(processed_image):
    #     return ""

    # Find contours of text regions
    contours, _ = cv2.findContours(
        processed_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    extracted_texts = []

    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)

        if w < 30 or h < 10:
            continue

        text_region = processed_image[y : y + h, x : x + w]

        # Apply OCR (Tesseract)
        text = pytesseract.image_to_string(text_region, config="--psm 6").strip()

        if text:  # Ignore empty results
            extracted_texts.append(text)

    return "".join(extracted_texts)

# Example usage
# image_path = "./images/hi.txt"
# detected_text = extract_text_from_label(image_path)
# print("Extracted Text:", detected_text)

