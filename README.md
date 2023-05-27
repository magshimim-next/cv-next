# CV_Next



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/maghsimimnext/cv_next.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/maghsimimnext/cv_next/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)

## Name
CV_Next

## Description
A simple peer review and cv upload system

## Badges

## Visuals

## Installation

## Usage

## Support

## Roadmap
A simple web app that will also use the Gooogle Drive API and google firebase firestore

The application will be able to authenticate with the drive API and upload docx files to a specfic directory.
The directory will have a default "comment only" permission which means that the CVs will be stored there and anyone will be able to comment on them.
After this works we should also intergrate meta data of the documents using the Firestore - we will run a script which will "archive" any old CVs so that the folder doesnt end up too clogged.

We could also create sub directories for the types of jobs the CVs are meant for - e.g Fullstack, back, front, data science...

## Contributing

## Authors and acknowledgment

## License

## Project status

## Suggested technologies:
React.next(TS), Firestore, Drive API. AWS + Docker Image.