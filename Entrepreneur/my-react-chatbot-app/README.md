# My React Chatbot App

This project is a React-based chatbot application that reuses the existing chatbot API model from the portfolio app. The application is designed to provide a seamless chat interface for users to interact with the chatbot.

## Features

- Chat interface for real-time messaging
- Integration with a chatbot API for AI responses
- Custom hooks for managing chat state
- Responsive design with modern styling

## Project Structure

```
my-react-chatbot-app
├── src
│   ├── app
│   │   ├── App.tsx          # Main application component
│   │   └── App.css          # Styles for the App component
│   ├── components
│   │   ├── ChatWindow.tsx   # Chat interface component
│   │   ├── ChatMessage.tsx   # Individual chat message component
│   │   └── index.ts         # Exports for components
│   ├── config
│   │   └── env.ts           # Environment variable configurations
│   ├── hooks
│   │   └── useChatbot.ts     # Custom hook for chat management
│   ├── services
│   │   └── chatbot.ts        # API interaction for chatbot
│   ├── styles
│   │   └── globals.css       # Global styles
│   ├── types
│   │   └── index.ts          # TypeScript types and interfaces
│   ├── main.tsx              # Entry point of the application
│   └── vite-env.d.ts         # Type definitions for Vite
├── .env.example               # Template for environment variables
├── .gitignore                 # Git ignore file
├── index.html                 # Main HTML file
├── package.json               # npm configuration file
├── tsconfig.json              # TypeScript configuration
├── tsconfig.node.json         # Node.js specific TypeScript configuration
├── vite.config.ts             # Vite configuration
├── README.md                  # Project documentation
└── eslint.config.js           # ESLint configuration
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd my-react-chatbot-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file based on the `.env.example` template and fill in the required environment variables.

5. Start the development server:
   ```
   npm run dev
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.