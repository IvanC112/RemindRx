import streamlit as st
from scanner.e2e_scanner2db import scan_and_recommend
import os 
from dotenv import load_dotenv
load_dotenv()

st.title("Prescription Scanner and Recommender")
st.write("Upload a prescription label image to get recommended times for taking the medication.")
st.write("Note: This is a work in progress and may not always work. Upload a blank image to test the error handling.")
st.write("Please ensure the image is clear and legible.")

st.markdown("To view your prescriptions to take today, please visit the [Webpage](http://localhost:3000).")
uploaded_file = st.file_uploader("Upload an image of the prescription label", type=["png", "jpg", "jpeg"])


if uploaded_file is not None:
    temp_file_path = os.path.join("temp", uploaded_file.name)
    with open(temp_file_path, "wb") as f:
        f.write(uploaded_file.getbuffer())

    try:
        recommended_times = scan_and_recommend(temp_file_path)
        st.success("Recommended Times:")
        st.write(recommended_times)
    except Exception as e:
        st.error(f"An error occurred: {e}")
    finally:
        #clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
else:
    st.info("Please upload an image to proceed.")