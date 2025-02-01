# Initialize the Supabase client
import json
import time
from supabase import create_client, Client
import requests
from PIL import Image
from io import BytesIO
import os
import re

with open("meow.txt", "r") as constants:
    global SUPABASE_URL
    SUPABASE_URL = constants.readline()[:-1]
    global SUPABASE_KEY
    SUPABASE_KEY = constants.readline()

GOOGLE_URL = 'https://lh5.googleusercontent.com/d/'
doc_id_regex = re.compile("/d/[a-zA-Z0-9-_]+/")

supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def download_google_doc_as_pdf(doc_link):
    preview_doc_link = GOOGLE_URL + re.findall(doc_id_regex, doc_link)[0][3:-1]
    r = requests.get(preview_doc_link, stream=True)
    return r.content


def fetch_cvs_data():
    response = supabase_client.table("cvs").select("id, document_link").execute()
    data = [
        {
            "document_link": record["document_link"],
            "id": record["id"]
        }
        for record in response.data
    ]
    return data


def save_cvs_data_to_json():
    data = fetch_cvs_data()
    for entry in data:
        try:
            doc_id = entry["document_link"]
            image_bytes = download_google_doc_as_pdf(doc_id)
            if b"PNG" not in image_bytes:
                continue
            im = Image.open(BytesIO(image_bytes))
            entry['preview_image_location'] = 'images/{entry_id}.{im_format}'.format(entry_id=entry['id'],
                                                                                     im_format=im.format)
            with open(entry['preview_image_location'], 'wb') as f:
                im.save(f)
        except:
            continue
    if data is not None:
        with open("cvs.json", "w") as json_file:
            json.dump(data, json_file, indent=4)
        print("Data saved to cvs.json")
    else:
        print("Failed to fetch data.")


def get_supabase_objects():
    """Retrieves a list of objects from the Supabase bucket."""
    try:
        response = supabase_client.storage.from_("cvs").list()
        return [obj['id'] + '.PNG' for obj in response]
    except Exception as e:
        print(f"An error occurred while retrieving object list from Supabase: {e}")
        return []

def get_local_images(local_images_folder):
    """Retrieves a list of image filenames from the local folder."""
    try:
        return os.listdir(local_images_folder)
    except FileNotFoundError:
        print(f"Local images folder '{local_images_folder}' not found.")
        return []

def upload_to_supabase(file_path):
    try:
        with open(file_path, "rb") as f:
            response = supabase_client.storage.from_("cvs").upload(
                os.path.basename(file_path), f
            )
            if response.statusCode == 200:
                print(f"Uploaded '{file_path}' to Supabase successfully.")
            else:
                print(f"Upload failed for '{file_path}': {response.statusCode}")
    except Exception as e:
        print(f"An error occurred while uploading '{file_path}': {e}")

def compare_and_upload():
    supabase_objects = get_supabase_objects()
    local_images = get_local_images("images")

    for image in local_images:
        if image not in supabase_objects:
            full_path = os.path.join("images", image)
            upload_to_supabase(full_path)


def main():
    try:
        os.mkdir("images")
    except FileExistsError:
        pass
    while True:
        save_cvs_data_to_json()
        compare_and_upload()
        print("Worked!")
        time.sleep(10)


if __name__ == "__main__":
    main()


