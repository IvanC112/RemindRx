from supabase import create_client, Client
import os
from dotenv import load_dotenv
from recommend.recommendation import predict_times

def recommend2db(text):

    load_dotenv(dotenv_path='.env', override=True)   #pathing for my env in root
    url= os.getenv("SUPABASE_URL")
    key= os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise EnvironmentError("Missing or invalid Supabase URL or key. Please check thee .env file.")

    supabase = create_client(url, key)
    response= supabase.table("prescriptions").select("recommended_times").execute()
    #print(response.data)
    #print("Inserting a new prescription into the database hopefully...")
    supabase.table("prescriptions").insert({"patient": 6,"description": text, "recommended_times": predict_times(text)}).execute() # try text for "Take one tablet twice daily"
    response = supabase.table("prescriptions").select("recommended_times").order("created_at", desc=True).limit(1).execute() #get latest entry and ensure order by created_at desc

    all_lists = [row["recommended_times"] for row in response.data]
    return all_lists  # return the latest entry (as a list)

def delete(time):

    load_dotenv(dotenv_path='.env', override=True)   #pathing for my env in root

    url= os.getenv("SUPABASE_URL")
    key= os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise EnvironmentError("Missing or invalid Supabase URL or key. Please check thee .env file.")

    supabase = create_client(url, key)
    response = supabase.table("prescriptions").delete().eq("recommended_times", ["06:00", "18:00"]).execute() #if the insert works it'll delete this from the database
    return response