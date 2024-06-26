# dymo-pnp

## Intro

This project introduces a comprehensive web application built on the MERN (MongoDB, Express, React, Node.js) stack, tailored for customizable label printing with seamless integration of a DYMO PNP LabelManager. The primary objective is to provide users with a robust platform where they can effortlessly create, customize, and print labels according to their specific requirements.

The application architecture is divided into two main components: a Node.js backend serving as the server-side logic and API endpoints, and a React frontend offering an intuitive user interface for label customization and management. Additionally, a local server component facilitates the direct connection to a DYMO PNP LabelManager device for printing commands.

This version of the project needs to be run both on a local and remote server. For more details, check out the two repositories that are needed to deploy this project: the [local server](https://github.com/niclasgrunau/dymo-pnp-local.git) and the [main application](https://github.com/niclasgrunau/dymo-pnp.git).


## Deployment

The frontend is already deployed on the [lehre server](https://lehre.bpm.in.tum.de/). To deploy the remote server and local server of the project, follow these steps:

### Local server

Clone the following project to your local machine:

```bash
git clone https://github.com/niclasgrunau/dymo-pnp-local.git
```

To prevent errors, you might install express and cors before running the server:

```bash
cd dymo-pnp-local
npm install express
npm install cors
```

Navigate to the root directory of the project and start local server:

```bash
node localServer.js
```

Also, you need to install 2 essential packages.

#### ImageMagick

ImageMagick is a powerful software suite used for manipulating images. It is employed to resize labels to a fitting size for the DYMO PNP LabelManager without compromising quality. You can download it from [here](https://imagemagick.org/script/download.php).

#### CUPS

CUPS (Common Unix Printing System) is a printing system for Unix-like operating systems, including Linux and MacOS. It facilitates printing tasks and is utilized to print labels via a shell script in this application. You can find instructions for downloading it for [Linux](https://ubuntu.com/server/docs/service-cups), [MacOS](https://x-series-support.lightspeedhq.com/hc/en-us/articles/205052024-Enabling-CUPS-Printer-Interface-for-Mac) or [Windows](https://project-insanity.org/2022/11/01/use-cups-printing-server-on-windows-10/).




### Remote server

#### Connected to initial directory

If you are able to run "npm start" on [https://lehre.bpm.in.tum.de/~ge83neb/dymo-pnp/backend/](https://lehre.bpm.in.tum.de/~ge83neb/dymo-pnp/backend/) while being conected to the lehre server, the web application will run [on the server port](https://lehre.bpm.in.tum.de/ports/6982/) and [here](https://lehre.bpm.in.tum.de/~ge83neb/dymo-pnp/frontend/build/). If not, follow the steps below.

#### Else

First, connect via SSH to the [lehre server](https://lehre.bpm.in.tum.de/) and change to a directory where you want to save the project.

Then, clone the following project to your server index:

```bash
git clone https://github.com/niclasgrunau/dymo-pnp.git
```

Navigate to the root directory of the project and install dependencies:

```bash
cd dymo-pnp
npm install
```

Then, navigate to the backend directory and install backend dependencies:

```bash
cd backend
npm install
```

Next, navigate to the frontend directory and install frontend dependencies:

```bash
cd ../frontend
npm install
```

For deploying, navigate to the frontend directory and create a static build of the frontend:

```bash
npm run build
```

Lastly, navigate to the backend directory and start the server:

```bash
cd ../backend
npm start
```

Now, the web application will run [on the server port](https://lehre.bpm.in.tum.de/ports/6982/) and [here](https://lehre.bpm.in.tum.de/~ge83neb/dymo-pnp/frontend/build/).

---

### Frontend

![Screenshot 1](https://github.com/niclasgrunau/dymo-pnp-localhost/blob/main/docs/frontend_img1.png)

![Screenshot 2](https://github.com/niclasgrunau/dymo-pnp-localhost/blob/main/docs/frontend_img2.png)

---

### Sequence diagram

#### Use of the application via frontend and Lehre server

![Sequence diagram 1](https://github.com/niclasgrunau/dymo-pnp/blob/main/sequence-diagrams/projectmodell_frontend_lehre.png)


#### Use of the application via CPEE

![Sequence diagram 2](https://github.com/niclasgrunau/dymo-pnp/blob/main/sequence-diagrams/projectmodell_cpee.png)


---
### CPEE

CPEE (Cloud Process Execution Engine) is a process execution engine. Different process sequences that occur in the application are shown below in CPEE.

#### The following 3 process instances require interaction with the application [on the server](https://lehre.bpm.in.tum.de/ports/6982/).

#### Screenshot 1: User endpoints ([see instance](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-1.xml))
![Screenshot 1](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-1.png)

**Description:**
- Get attributes of specific user (returns the attributes of a specific user as a list)
- Get attributes of all users (returns the attributes of a all users as a list within dictionaries representing users)
- Get emails of all users (returns the emails of a all users as a list)
- User registration (return status 200 message indicating that the user has been registered successfully)
- User login (return status 200 message indicating that the user logged in and a list of the attributes of the logged in user)
- Delete specific user (return status 200 message indicating that the user has been deleted successfully)


 #### Screenshot 2: Label endpoints ([see instance](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-2.xml))
![Screenshot 2](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-2.png)

**Description:**
- All labels of specific user (returns the attributes of a all labels of a user as a list within dictionaries representing labels)
- Save label for a user (return status 200 message indicating that the labels has been saved successfully)
- Delete label of a user (return status 200 message indicating that the label has been deleted successfully)
- Get attributes of label (returns the attributes of a specific label as a list)
- Get all labels with an url (returns the label, user and timestamp of a all labels with a specific URL as a list within dictionaries representing labels)
- Update user of a label (return status 200 message indicating that the user of a label has been updated successfully and the id of the new user)


 #### Screenshot 3: Label endpoints ([see instance](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-3.xml))
![Screenshot 2](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-3.png)

**Description:**
- Create a PDF label with a specified text (returns a CUPS command line for printing the created PDF with a specific text)
- Create a PDF label with a specified QR Code (returns a CUPS command line for printing the created PDF with a specific QR Code)
- Create a PDF label with a specified text and QR Code (returns a CUPS command line for printing the created PDF with a specific text and QR Code)


#### The following 4 process instances require interaction with the application [on the server](https://lehre.bpm.in.tum.de/ports/6982/).

#### Screenshot 4: Print Label ([see instance](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-41.xml))
![Screenshot 4](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-41.png)

**Description:**
- While print button not clicked:
  - Check if print button was clicked
- Save image
- Resize image
- Print image


#### Screenshot 5: Login + Save Label ([see instance](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-42.xml))
![Screenshot 5](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-42.png)

**Description:**
- While user not logged in:
  - Check if login button was clicked and 200 status was sent
- While save label button not clicked:
  - Check if save label button was clicked and 200 status was sent
- Saved label


#### Screenshot 6: Login + Delete Label ([see instance](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-43.xml))
![Screenshot 6](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-43.png)

**Description:**
- While user not logged in:
  - Check if login button was clicked and 200 status was sent
- While delete label button not clicked:
  - Check if delete label button was clicked and 200 status was sent
- Deleted label


#### Screenshot 7: Registering ([see instance](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-44.xml))
![Screenshot 7](https://github.com/niclasgrunau/dymo-pnp/blob/main/cpee-instances/dymo-pnp-44.png)

**Description:**
- While user not logged in:
  - Check if register button was clicked and 200 status was sent


---

### API Endpoints for process execution via frontend
## User Routes

#### `GET /users/getUsers`

This endpoint retrieves all users from the database.

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| None      |        |             |

#### Response

- 200 OK: Returns an array of users.
- 404 Not Found: No users found in the database.


#### `POST /users/register`

This endpoint registers a new user with the provided name, email, and password.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `name`    | string | The name of the user.             |
| `email`   | string | The email of the user.            |
| `password`| string | The password of the user.         |

#### Response

- 201 Created: User registered successfully.
- 400 Bad Request: Email already registered.
- 500 Error: Internal Server Error.


#### `POST /users/login`

This endpoint authenticates a user with the provided email and password.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `email`   | string | The email of the user.            |
| `password`| string | The password of the user.         |

#### Response

- 200 OK: Login successful.
- 401 Unauthorized: Invalid credentials.
- 500 Error: Internal Server Error.

## Label Routes

#### `POST /labels/save`

This endpoint saves a new label to the database.

| Parameter          | Type    | Description                              |
| ------------------ | ------- | ---------------------------------------- |
| `userId`           | string  | The ID of the user associated with the label. |
| `name`             | string  | The name of the label.                   |
| `text`             | string  | The text content of the label.           |
| `fontStyle`        | string  | The font style of the label.             |
| `fontSize`         | number  | The font size of the label.              |
| `isBold`           | boolean | Indicates if the label text is bold.     |
| `isItalic`         | boolean | Indicates if the label text is italicized. |
| `isUnderline`      | boolean | Indicates if the label text is underlined. |
| `textAlignment`    | string  | The text alignment of the label.         |
| `verticalAlignment`| string  | The vertical alignment of the label.     |
| `isQRCodeUsed`     | boolean | Indicates if a QR code is used in the label. |
| `url`              | string  | The URL associated with the label.       |
| `shortenedUrl`     | string  | The shortened URL associated with the label. |
| `createdAt`        | Date    | The creation date of the label.          |

#### Response

- 201 Created: Label saved successfully.
- 500 Internal Server Error: Error saving label.

#### `GET /labels/allLabelsOfUser/:userId`

This endpoint retrieves all labels associated with a specific user.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `userId`  | string | The ID of the user.                |

#### Response

- 200 OK: Returns an array of labels.
- 404 Not Found: User not found.
- 500 Error: Internal Server Error.

#### `DELETE /labels/:labelId`

This endpoint deletes a label with the specified ID.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `labelId` | string | The ID of the label to be deleted. |

#### Response

- 200 OK: Label deleted successfully.
- 500 Internal Server Error: Error deleting label.
  
## Image Routes

#### `POST /image/saveImage`

This endpoint saves the generated image to the server.

| Parameter   | Type   | Description                                    |
| ----------- | ------ | ---------------------------------------------- |
| `imageData` | string | The base64 encoded image data to be saved.     |

#### Response

- 200 OK: Image saved successfully.
- 500 Internal Server Error: Error saving the image.

#### `POST /image/resize`

This endpoint resizes the saved image by executing a shell script with the package ImageMagick.

#### Response

- 200 OK: Image resized successfully.
- 500 Internal Server Error: Error resizing the image.

#### `POST /image/download-command`

This endpoint downloads the resized image and sends a print command to a printer by executing a shell script with the package CUPS.

#### Response

- 200 OK: Download command executed successfully.
- 500 Internal Server Error: Error executing the download command.

---

### API Endpoints for process execution via CPEE (REST)
### User Routes

#### `POST /users/register-query`

Registers a new user with the provided name, email, and password.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `name`    | string | The name of the user.             |
| `email`   | string | The email of the user.            |
| `password`| string | The password of the user.         |

#### Response

- 200 OK: User registered successfully.
- 400 Bad Request: Email already registered.
- 500 Error: Internal Server Error.


#### `POST /users/login-query`

Authenticates a user with the provided email and password.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `email`   | string | The email of the user.            |
| `password`| string | The password of the user.         |

#### Response

- 200 OK: Login successful.
- 401 Unauthorized: Invalid credentials.
- 500 Error: Internal Server Error.

#### `GET /users/getInfoOfUser/:userId`

Retrieves information about a specific user by their user ID.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `userId`  | string | The ID of the user.                |

#### Response

- 200 OK: Returns the attributes of a specific user as a list.
- 404 Not Found: User not found.
- 500 Error: Internal Server Error.

#### `GET /users/getInfoOfAllUsers`

Retrieves information about all users.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| None      |        |                                    |

#### Response

- 200 OK: Returns the attributes of a all users as a list within dictionaries representing users.
- 500 Error: Internal Server Error.

#### `GET /users/getAllUserEmails`

Retrieves the emails of all users.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| None      |        |                                    |

#### Response

- 200 OK: Returns the emails of a all users as a list.
- 500 Error: Internal Server Error.

#### `DELETE /users/deleteUser/:userId`

Deletes a user with the specified user ID.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `userId`  | string | The ID of the user to be deleted.  |

#### Response

- 200 OK: User deleted successfully.
- 400 Bad Request: No userId provided.
- 500 Error: Internal Server Error.

## Label Routes

#### `POST /labels/save-query`

Saves a new label to the database with the provided details.

| Parameter          | Type    | Description                              |
| ------------------ | ------- | ---------------------------------------- |
| `userId`           | string  | The ID of the user associated with the label. |
| `name`             | string  | The name of the label.                   |
| `text`             | string  | The text content of the label.           |
| `fontStyle`        | string  | The font style of the label.             |
| `fontSize`         | number  | The font size of the label.              |
| `isBold`           | boolean | Indicates if the label text is bold.     |
| `isItalic`         | boolean | Indicates if the label text is italicized. |
| `isUnderline`      | boolean | Indicates if the label text is underlined. |
| `textAlignment`    | string  | The text alignment of the label.         |
| `verticalAlignment`| string  | The vertical alignment of the label.     |
| `isQRCodeUsed`     | boolean | Indicates if a QR code is used in the label. |
| `url`              | string  | The URL associated with the label.       |
| `shortenedUrl`     | string  | The shortened URL associated with the label. |
| `createdAt`        | Date    | The creation date of the label.          |

#### Response

- 200 OK: Label saved successfully.
- 500 Internal Server Error: Error saving label.

#### `DELETE /labels/deleteLabel/:labelId`

Deletes a label with the specified ID.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `labelId` | string | The ID of the label to be deleted. |

#### Response

- 200 OK: Label deleted successfully.
- 400 Bad Request: No labelId provided.
- 500 Internal Server Error: Error deleting label.

#### `GET /labels/getInfoOfLabel/:labelId`

Retrieves information about a specific label by its ID.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `labelId` | string | The ID of the label.               |

#### Response

- 200 OK: Returns the attributes of a specific label as a list.
- 404 Not Found: Label not found.
- 500 Internal Server Error: Internal Server Error.

#### `GET /labels/labelWithUrl/:url`

Retrieves labels with the specified URL.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `url`     | string | The URL associated with the label. |

#### Response

- 200 OK: Returns the label, user and timestamp of a all labels with a specific URL as a list within dictionaries representing labels.
- 404 Not Found: No labels found with the specified URL.
- 500 Internal Server Error: Internal Server Error.

#### `GET /labels/allLabelsWithUrl`

Retrieves information about all labels.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| None      |        |                                    |

#### Response

- 200 OK: Returns the label, user and timestamp of a all labels with an URL as a list within dictionaries representing labels.
- 404 Not Found: No labels found.
- 500 Internal Server Error: Internal Server Error.

#### `PUT /labels/updateUserOfLabel/:labelId/:newUserId`

Updates the user associated with a label.

| Parameter   | Type   | Description                           |
| ----------- | ------ | ------------------------------------- |
| `labelId`   | string | The ID of the label to be updated.    |
| `newUserId` | string | The ID of the new user for the label. |

#### Response

- 200 OK: Label user updated successfully and returns the id of the new user.
- 400 Bad Request: LabelId or newUserId not provided.
- 404 Not Found: Label not found or User not found.
- 500 Internal Server Error: Internal Server Error.

## Image (PDF) Routes

#### `POST /pdf/createPDFWithQRCode/:text`

Creates a PDF document containing a QR code generated from the provided text.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `text`    | string | The text to generate QR code from. |

#### Response

- 200 OK: Created a PDF label with a specified QR Code and returns a CUPS command line for printing the created PDF with a specific QR Code.
- 500 Internal Server Error: Error generating PDF.

#### `POST /pdf/createPDFWithText/:text`

Creates a PDF document containing the provided text.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `text`    | string | The text to include in the PDF.    |

#### Response

- 200 OK: Createde a PDF label with a specified text and returns a CUPS command line for printing the created PDF with a specific text.
- 500 Internal Server Error: Error generating PDF.

#### `GET /pdf/createPDFWithTextAndQRCode-query`

Creates a PDF document containing both text and a QR code.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `text`    | string | The text to include in the PDF.    |
| `url`     | string | The URL to generate QR code from. |

#### Response

- 200 OK: Created a PDF label with a specified text and QR Code and returns a CUPS command line for printing the created PDF with a specific text and QR Code.
- 500 Internal Server Error: Error generating PDF.


---

### Other Routes

#### TinyURL

If the URL entered by the user is too long, the QR code becomes too detailed to be read after printing. For this reason, a TinyURL API has been integrated to shorten entered URLs. In this way, the QR code refers to the shortened URL and the shortened URL leads to the entered URL.

| Parameter   | Type   | Description                                    |
| ----------- | ------ | ---------------------------------------------- |
| `url`       | string | The URL input by the user                      |
| `domain`    | string | tinyurl.com                                    |

---

### MongoDB Models

#### User Model

| Attribute  | Type     | Required | Unique |
| ---------- | -------- | -------- | ------ |
| _id        | ObjectId | Yes      | No     |
| name       | String   | Yes      | No     |
| email      | String   | Yes      | Yes    |
| password   | String   | Yes      | No     |
| labels     | Array    | No       | No     |

#### Label Model

| Attribute          | Type     | Required | Unique |
| ------------------ | -------- | -------- | ------ |
| _id                | ObjectId | Yes      | No     |
| user               | ObjectId | Yes      | No     |
| name               | String   | Yes      | No     |
| text               | String   | No       | No     |
| fontStyle          | String   | Yes      | No     |
| fontSize           | Number   | Yes      | No     |
| isBold             | Boolean  | Yes      | No     |
| isItalic           | Boolean  | Yes      | No     |
| isUnderline        | Boolean  | Yes      | No     |
| textAlignment      | String   | Yes      | No     |
| verticalAlignment  | String   | Yes      | No     |
| isQRCodeUsed       | Boolean  | Yes      | No     |
| url                | String   | No       | No     |
| shortenedUrl       | String   | No       | No     |
| createdAt          | Date     | Yes      | No     |

---
