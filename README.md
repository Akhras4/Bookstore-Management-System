# registration-system
registration system using express and mongodb
<p dir=auto>
<a href=""><img alt="NPM Version" src="https://img.shields.io/npm/v/registration-system"></a>
<a href=""><img alt="NPM License" src="https://img.shields.io/npm/l/registration-system"></a>
<a href="https://www.npmjs.com/package/registration-system?activeTab=readme"><img alt="NPM Collaborators" src="https://img.shields.io/npm/collaborators/registration-system"></a>

</p>
# User Authentication and Profile Management System

This repository contains code for a user authentication and profile management system. The system provides functionalities for user signup, email verification, login, JWT authentication, logout, and user profile rendering.

## Functionality Overview

- **User Signup:** Allows users to register by providing their email address and choosing a username.
- **Email Verification:** Sends a verification email containing a unique token to the user's email address for validation.
- **Login:** Allows registered users to log in using their email address and password.
- **JWT Authentication:** Generates JSON Web Tokens (JWT) upon successful login for secure authentication of subsequent requests.
- **Logout:** Logs the user out of the system, invalidating their current session.
- **User Profile Rendering:** Displays user-specific information such as username and profile details.

## Parameters Explanation

- **email:** Stores the email address of the user. Used for signup, login, verification, and identification in the database.
- **UserName:** Stores the username of the user. Used for signup, login, and displaying user-specific information.
- **emailtoken:** A unique token generated for each user during signup. Used for email verification and validation.

## Email Verification Process

1. During signup, a random emailtoken is generated for each user.
2. This token is sent to the user's email address for verification.
3. Once the user clicks on the verification link containing the token, their email is verified.

## Installation and Usage

To use this system, follow these steps:

1. Clone the repository to your local machine.
2. Install any required dependencies.
3. Configure the database connection settings.
4. Run the application.

## Contributing

Contributions are welcome! If you find any bugs or want to suggest improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
