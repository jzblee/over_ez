# Over EZ
This repository contains a MEAN stack application which aids brothers in creating editions of the EZ Digest.
## EZ Digest
The EZ Digest is a weekly email sent to brothers of the Epsilon Zeta chapter of Alpha Phi Omega at Rensselaer Polytechnic Institute. This HTML publication provides details and sign-up links to upcoming chapter events, and includes minutes for recent brotherhood and committee meetings.
## Installation and Deployment
1. To get the files, you can either:
    - Clone this git repository by running the following command in a Git-enabled terminal:
        - `> git clone https://github.com/jzblee/over_ez.git`
    - Or, click the green button on the top right of the GitHub repo page to download the files.
2. Install the following tools to proceed:
    - [Node.js](nodejs.org)
    - [MongoDB](https://www.mongodb.org/)
3. Navigate into the directory of the application:
```
> cd over_ez
```
4. Install all dependencies (Bower is needed for some front-end ones):
```
> npm install -g bower
> npm install
```
5. Make a copy of `config.example.js` and save it as `config.js`, and fill in the information. This file contains information that usually remains the same over the course of a semester, such as officer and meeting details.
6. Make a copy of `render.example.js` and save it as `render.js`, and fill in the username and password for some account on the website to use for serverside rendering. In addition, specify the SMTP account information for outgoing mail. A dedicated SMTP service such as SendGrid works best. `TODO: account creation is not currently possible directly through the frontend.`
7. Start the server (ensure the Mongo database is running):
```
> npm start
```

## Usage
1. Enter the digest publication date on the top left.
2. The stylesheet, `digest.css`, contains the default color scheme for the digest as well as other layout information. Change this value to swap between the default and any other style sheets you may make.
3. Fill out the information for each event. You can use the sign-up sheets and calendars to populate these sections. The "SPECIAL EVENTS" section is for notable occasions such as the Pledge Ceremony, Overnighter, and Initiations.
4. Add committees and their meeting locations, and links to minutes, in the final two sections.
5. As you're adding information in the panel on the left, the preview on the right will automatically update. If you can't send the digest out just yet, click "Save" at the top of the page to open a menu with two options: saving the digest information to your browser's internal storage, to be restored the next time you load the page, and saving the digest information to the server, in which case you may later recall it with the Open menu. Only one digest may be saved for each date.
6. Once you're done entering all the details, click "Save and publish" at the top of the page. This will save the digest information, and then send an email message using the settings in `render.js`.

## Future Work
- Reinstate digest CSS linking
- Improve digest editor usage
    - Add quick day-of-week selectors
    - Simplify digest CSS selection
