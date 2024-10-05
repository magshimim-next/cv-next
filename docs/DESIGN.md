# CV NEXT - Design Page

If you can't see the markdown well, a PDF version is found [here](./Project_Outlines.pdf)

## App designation

The application will operate as a platform for uploading and reviewing CV files between the members of the Magshimim-Next community.

**Only verified members will be able to use the website.**

This will allow us to improve and maximize the potential of every member’s CV – by getting a lot of input from various users.

## How will it work?

Upon entering the platform, a user will have to register/sign in with a Google account. \
After that, an admin must change the user type of the new user (read more about the user type in the data schemas section).

- This is done because we want only Magshimim Next members to be able to join.

Once the user is signed in and with the correct permissions – he will be able to upload as well as view and comment on the various CVs of the active platform members.

### Uploading a CV

A user can choose to upload a link that withstands the following standards:

- The link must be a link to a **Google Docs** file.
- The file must be open to view to anyone with the link.

Once a user submits a link, it will be added with the user’s ID.

- This means a user can upload several CVs.

Each CV must also include a brief description of the CV.

Upon submission – each CV should also be linked to at least one job category (read more about categories in the data schemes section).

### Viewing a CV

A user can view any CVs that he’d like – the CVs will be shown on a feed-like page. \
The feed will have filtering options but in default settings – will show the most recently
Uploaded CVs.

- There will also be an option to filter by category (read more about categories in the data schemes section), by description, and by the user uploading.

Once a user has clicked on a CV, he will be sent to a page dedicated to the CV where he can leave a detailed review of that CV and even resolve any of his reviews.

- Liking comments and commenting under other comments are also available.

### User Data and Interactions

Users can define several fields to better explain themselves.

#### Username

Each user can set a different username that would be previewed instead of the name given from Gmail.

#### Work Status

Each user can set a work status that would be presented to all other users who check his profile.

- The status can be empty, open to work, or hiring.

#### Work Status Categories

To better explain the status itself, a user can choose up to 3 categories that the work status relates to.

- For example, if a user is set to open to work, he can define the categories to match the fields he wants to work on.

## Technologies

**Hosting:** Digital Ocean

**DB:** Supabase

**JS Framework:** Next.js

**UI:** Tailwind CSS

## Workflow and Logic

### CV Previews

Each request to the feed will try to update the image in the bucket if the hash of the file changes. \
The request will fetch the image from the bucket, save it to the cache, and render it along with the uploader’s name, the relevant categories, and the upload date.

> We may think of a way to improve the number of requests and conflicts that could occur. Cron jobs and other similar ideas are still thought about.

### User Permissions

When a user signs in, he automatically receives the inactive type, which means he has no way of doing anything and he is always redirected to an “access denied” page. \
An admin must change the type on the admin page/the Supabase console at the perms table.

The active role holders can do anything **to themselves** except for updating their role (they can only do things that are implemented in the code – if something is changeable and not referenced at any point in the code, it can’t be updated).

Admins can do anything they like (change names, delete comments, delete CVs, etc). This is enforced on the DB using Row Level Security and on the backend.

## High-Level Frontend Layout

![Frontend image](./Frontend_High_Level_Design.drawio.svg)

Also, feel free to see the XML yourself on the draw.io website!
