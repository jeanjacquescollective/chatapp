# Installation Steps

## Frontend (Next.js) - without pusher

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Initialize a new Next.js project:
    ```bash
    npx create-next-app@latest
    ```
3. Follow the prompts to set up your Next.js project.
4. Install socket.io-client for real-time communication:
    ```bash
    npm install socket.io-client
    ```


5. Install Nodemailer for sending emails:
    ```bash
    npm install nodemailer
    ```

6. Create a configuration file for Nodemailer (e.g., `nodemailer.config.js`):
    ```javascript
    // nodemailer.config.js
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    module.exports = transporter;
    ```

7. Add environment variables for your email credentials in a `.env` file:
    ```
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-email-password
    ```

8. Use Nodemailer in your application to send emails:
    ```javascript
    const transporter = require('./nodemailer.config');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'recipient@example.com',
        subject: 'Test Email',
        text: 'This is a test email sent from Nodemailer.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
    ```
## Frontend (Next.js) - with pusher

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Initialize a new Next.js project:
    ```bash
    npx create-next-app@latest
    ```

3. Follow the prompts to set up your Next.js project.

4. Install Pusher for real-time communication:
    ```bash
npm install @pusher/pusher-websocket-react-native
    ```

## Backend (Strapi)

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```

2. Create a new Strapi project:
    ```bash
    npx create-strapi-app@latest my-project --quickstart
    ```

3. Follow the prompts to set up your Strapi project.

4. Install Pusher for real-time communication:
    ```bash
    npm install strapi-plugin-pusher
    ```

You have now set up Next.js in the frontend folder and Strapi in the backend folder, with Pusher installed for real-time communication.