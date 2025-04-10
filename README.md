# Topics in Software Engineering

Hello! This is the project proposal for RemindRx!

## Description
Everyone has busy lives and often struggle to stay on top of their day-to-day tasks. One of the most commonly overlooked daily tasks is taking your medications on time. Having previously worked in the Pharmaceutical field, I've seen firsthand the amount of people who neglect to take their medications on time and the results of that. Not taking your medication on time can lead to your symptoms continuing, and in worst case symptoms get worse. The goal of RemindRx is to allow users to scan in their prescriptions from their cameras, recommend for them the best times to take their medications (ie if the medication  says take twice a day it recommends a time in the morning and a time at night), and sending SMS notifications so that users will always be reminded of their pending prescriptions to take for the day. 


## The Tech Stack
- The first aspect, scanning prescriptions, will require the use of the OpenCV library in order to scan the prescriptions from the camera
- Alongside scanning prescriptions, we will need to be able to detect only prescription labels and filter the text. This will need a classification model using either scikit-learn(simpler, faling into more data science) or tensorflow (advanced, falling more into ml)
- We will need another model to recommend times based on the prescription name and the directions on the labels, again using scikit-learn or tensorflow
- We need to actually remind our users of their prescriptions, so I intend to use the Twilio API
- As we want to store the prescription information, we will need a real-time database to store a user's prescriptions and recommended times. Any rt-db is fine
- We want to handle logins so we can either have a database to handle logins the old fashioned way, or alternatively use a dedicated login library like Clerk
- As this is a web-app, I am open to any front-end and back-end frameworks, so this is flexible. However it must be mobile-friendly for the best user-experience

## End Users
- I intend this to be useful to a wide variety of people. I want everyone to be able to be on top of their health so they can focus on other tasks. When I worked in the pharmaceutical industry, my main customers were the elderly. I want to make sure the elderly are able to use this app, accounting for any handicaps or disabilities also.

Testing for the webhook
