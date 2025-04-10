# Everything to Know about Classification Model

### Inputs
- The model handles `string` inputs that detail when to take a prescription. These are the notes a doctor sends to a pharmacy that describe when the patient should take a prescription
- With these string inputs, in the general form of "take `x` tablets `y` times a day",  we can recommend a list of times for a patient to take their prescriptions

### Outputs
- The output of our model is a `list` of `strings`, in the format of "Hr:Min" (formatted to two digits for the hours and the mins). This allows for seamless database uploading without having to worry about the conversion to timestamps or datetime. 

### Interactions with other components
- For sms cron job, this will have to be:
1) Queried from the database
2) Converted into the 

- For computer vision component, we will need the description gathered from OCR

- For the database we will need to:
1) Insert the data for the given user, assuming a user is logged in
2) Have the data be readily accessible for the cron job's scheduled sms notifications

- For the frontend, we want a checkbox with the time to take the prescriptions so we can keep track of when a user takes their prescriptions
