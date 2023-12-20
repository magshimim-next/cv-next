# CV NEXT - Design Page
## App designation
The application will operate as a platform for uploading and reviewing CV files between the members of the Magshimim-Next community.
This will allow us to improve and maximize the potential of every member’s CV – by getting a lot of input from other users.

## How will it work?
Upon entering the platform, a user will have to register/sign in with a google account.
Once the user is signed in – he will be able to upload as well as view various CVs of the active platform members.

### Uploading a CV
A user can choose to upload any link he’d like to share – but a submitted link must be hosted on Google Drive, and the file must be in either .docx or .pdf format 
-	Once a user submits a link, the latest link is bound to his registered account.
-	Upon submission – each CV should also be linked to a job category (read more about categories in the data schemes section).

### Viewing a CV
The CVs will be shown in a feed-like page.
The feed will have filtering options but in default settings – will show the most recently
Uploaded CVs.
There will also be an option to filter by category.

Once a user has clicked on a CV, he will be sent to the provided CV link – where he can leave a detailed review using the built in comment tools in Google Drive (for .docx files),
We will also provide a general comment section under each post.

## Technologies
**Hosting:** AWS

**DB:** Firebase Firestore

**JS Framework:** Next.js

**UI:** Tailwind CSS

## Schemas & Collections
### Categories
- Undefined
- General
- Medical
- Insurance
- Financial
- Legal
- Education
- Fullstack
- Frontend
- Backend
- Devops
- Cybersecurity
### Users
|field|type|
|:---|:---|
|created|datetime|
| lastLogin|datetime|
|email|string|
|name|string|
|userTypeID|number|
### CVs
|field|type|
|:---|:---|
|categoryID|number|
|deleted|boolean|
|description|string|
|documentLink|string|
|resolved|boolean|
|uploadDate|datetime|
|userID|string|
### Comments
to be planned out..
