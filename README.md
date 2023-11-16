# Online Coding Web Application

This project is an online coding web application designed for remote mentoring sessions in JavaScript. It allows a mentor and a student to interact with code blocks in real time, with a mentor watching the code and observing the student's edits in real-time.

## Features

- **Lobby Page**: Users can choose from a list of JavaScript code blocks.
- **Code Block Page**: Supports roles for mentor (read-only) and student (editable).
- **Real-Time Code Editing**: Utilizes web sockets for displaying code changes in real time.
- **Syntax Highlighting**: Uses a library like Highlight.js for JavaScript syntax highlighting.

## Pages

### Lobby Page

- Title: "Choose code block."
- A list of at least four JavaScript code blocks, each with a unique name.
- Users can select a code block to navigate to its dedicated page.

### Code Block Page

- Differentiates between mentor and student based on arrival order.
- The mentor, as the first user, views the code in read-only mode.
- The student can edit the code, with changes reflected in real-time.
- Implements socket technology for real-time updates.
- Syntax highlighting focused on JavaScript.

## Technology Stack

- **Frontend**: React.js with SASS (SCSS) for styling.
- **Backend**: Node.js with Express.
- **Database**: PostgreSQL for any data persistence needs.
- **Real-Time Communication**: Socket.IO for real-time interaction.
- **Syntax Highlighting**: Highlight.js for code syntax highlighting.

- ## Setup and Installation

1. **Clone the Repository**: git clone [[(https://github.com/GLDGN98/student-mentor-assignment/edit/main/README.md)]](https://github.com/GLDGN98/student-mentor-assignment/edit/main/README.md)
2. **Install Dependencies**: Navigate to the project directory in each enviorement (frontend and backend) and install dependencies (npm i)
3.  **Start the Backend Server**: node server.js
4.  **Launch the Frontend Application**: npm run dev
