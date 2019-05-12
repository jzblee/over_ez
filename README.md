# Over EZ
This repository contains a suite of tools to aid brothers in creating editions of the EZ Digest.
## EZ Digest
The EZ Digest is a weekly email sent to brothers of the Epsilon Zeta chapter of Alpha Phi Omega at Rensselaer Polytechnic Institute. Created with HTML and CSS, it provides details and sign-up links to upcoming chapter events, and includes minutes for recent brotherhood and committee meetings.
## Installation and Deployment
1. To get the files, you can either:
    - Clone this git repository by running the following command in a Git-enabled terminal:
        - `> git clone https://github.com/jzblee/over_ez.git`
    - Or, click the green button on the top right of the GitHub code page to download the files.
2. Install the following tools to proceed:
  - [Git](https://git-scm.com/)
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
5. Make a copy of `config.example.json` and save it as `config.json`, and fill in the information. This file contains information that usually remains the same over the course of a semester, such as officer and meeting details.
6. Start the server:
```
> npm start
```

## Usage
1. Enter the digest publication date on the top left.
2. The stylesheet, `digest.css`, contains the default color scheme for the digest as well as other layout information. Change this value to swap between the default and any other style sheets you may make.
3. Fill out the information for each event. You can use the sign-up sheets and calendars to populate these sections. The "SPECIAL EVENTS" section is for notable occasions such as the Pledge Ceremony, Overnighter, and Initiations.
4. Add committees and their meeting locations, and links to minutes, in the final two sections.
5. As you're adding information in the panel on the left, the preview on the right will automatically update. If you can't send the digest out just yet, click "Save" at the top of the page. Your brower will remember what you entered in the text boxes and will restore the information the next time you load the page.
6. Once you're done, you may copy and paste the formatted preview into an email client (Apple Mail works very well for sending messages with HTML code).
7. Send the digest out to the brotherhood!

## Future Work
- Handle digest storage and distribution on the server instead of on the client
    - Requires persistent database
    - Requires authentication
    - Requires mailer
- Improve digest editor usage
    - Add quick day-of-week selectors
    - Simplify digest CSS selection
