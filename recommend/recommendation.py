import pandas as pd
import numpy as np
import pickle #for saving and loading models
from sklearn.feature_extraction.text import TfidfVectorizer 
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity

dummy_data= {  #defining some data. will append more times and descriptions later
    "prescription_description": ["Take one tablet twice daily", "Take one tablet once daily", "Take one tablet thrice daily", "Take two tablets once a day", 'Take one tablet three times a day'],
    "prescription_time": [["06:00", "18:00"], ["13:00"], ["07:00", "13:00", "19:00"], ["11:00"], ["08:00", "14:00", "20:00"]]
}

#preproc stuff
mlb = MultiLabelBinarizer()
y = mlb.fit_transform(dummy_data["prescription_time"]) #transforming the prescription times into a binary format
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(dummy_data["prescription_description"])  #converting the prescription descriptions into a matrix of TF-IDF features

clf = RandomForestClassifier(n_estimators=100, random_state=42) #training a random forest classifier. initially i wanted to do a neural network but i dont have enough data for that
clf.fit(X, y) #affix data to the model

#never done this before, hopefully pickle works. in the past ive used tf save model but this is sklearn
with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

with open("classifier.pkl", "wb") as f:
    pickle.dump(clf, f)

with open("mlb.pkl", "wb") as f:
    pickle.dump(mlb, f)
# by now the model si saved. should be accessible now by other files 
def predict_times(description): #hardcoded recommender function
    try:
        if not isinstance(description, str): #validate input datatype to be string
                raise ValueError("Description must be a string")
        
        if not description.strip() or description=='': ##check if the string is empty or contains only whitespace
            return ["No matching times found"]
        
        with open("vectorizer.pkl", "rb") as f: #should be testing-safe
            vectorizer = pickle.load(f)

        with open("classifier.pkl", "rb") as f: #should be testing-safe
            clf = pickle.load(f)

        with open("mlb.pkl", "rb") as f: #should be testing-safe
            mlb = pickle.load(f)

        desc_vectorized = vectorizer.transform([description])

        training_descriptions = dummy_data["prescription_description"] #get the training descriptions from the dummy data
        train_tfidf = vectorizer.transform(training_descriptions)
        similarities = cosine_similarity(desc_vectorized, train_tfidf)
        max_sim = similarities.max()
        # If the maximum similarity is below a threshold, consider it a bad match.
        if max_sim < 0.3:
            return ["No matching times found"]

        #if we pass similarity check, we can proceed to predict the times
        predicted_labels = clf.predict(desc_vectorized)
        predicted_times = mlb.inverse_transform(predicted_labels)

        if predicted_times and predicted_times[0]: #check if there is a prediction and if it's not empty
            return list(predicted_times[0]) #typecasting to avoid weird formatting issues
        else:
            return ["No matching times found"] #if not, then return no matching times found
    except ValueError as ve:
            return [f"Bad Input: {str(ve)}"] #catch bad value errors as opposed to just bad output
    except Exception as e:
        return [f"Bad Output: {str(e)}"] #return the error if something goes wrong
    
    
''''
#example usage 

user_input = input("Enter a prescription description: ")
recommended_times = predict_times(user_input)
print(f"Recommended Times: {recommended_times}")
print(recommended_times)
'''
