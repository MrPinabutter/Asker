# 📋 Asker

A beautiful, interactive CLI tool for creating and managing forms directly in your terminal. Built with TypeScript and Bun for blazing-fast performance.

![Terminal Form Demo](./assets/demo.gif)

<!-- TODO: Add a demo GIF showing the main menu and navigation -->

## ✨ Features

- 🎨 **Beautiful Terminal UI** - Colorful, intuitive interface with keyboard navigation
- 📝 **Create Custom Forms** - Build forms with unlimited questions
- ✅ **Answer Forms** - Fill out forms interactively with guided prompts
- 💾 **Persistent Storage** - All forms and answers are saved as text files
- ⌨️ **Keyboard Navigation** - Navigate menus with arrow keys
- 🚀 **Fast & Lightweight** - Built with Bun for optimal performance

## 📸 Screenshots

### Main Menu

<!-- TODO: Add screenshot of the main menu -->

![Main Menu](./assets/main-menu.png)

### Creating a Form

<!-- TODO: Add screenshot/GIF of form creation process -->

![Create Form](./assets/create-form.gif)

### Answering a Form

<!-- TODO: Add screenshot/GIF of answering a form -->

![Answer Form](./assets/answer-form.gif)

### Form Selection

<!-- TODO: Add screenshot of form selection menu -->

![Select Form](./assets/select-form.png)

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/asker.git

# Navigate to the project directory
cd asker

# Install dependencies
bun install
```

### Usage

```bash
# Run the application
bun run main.ts
```

## 🎮 Controls

| Key       | Action                |
| --------- | --------------------- |
| `↑` / `↓` | Navigate menu options |
| `Enter`   | Select option         |
| `Ctrl+C`  | Exit application      |

## 📁 Project Structure

```
asker/
├── main.ts              # Application entry point
├── core/
│   ├── input/           # Keyboard input handling
│   │   ├── keycodes.ts  # Key code definitions
│   │   └── menu.ts      # Menu navigation logic
│   └── terminal/        # Terminal utilities
│       ├── colors.ts    # ANSI color codes
│       ├── cursor.ts    # Cursor visibility control
│       └── screen.ts    # Screen manipulation
├── menus/
│   ├── start/           # Main menu
│   ├── createForm/      # Form creation flow
│   ├── answerForm/      # Form answering flow
│   └── lookAnswers/     # View answers (WIP)
├── forms/               # Saved form templates
├── answers/             # Completed form responses
├── navigate/            # Menu navigation system
├── state/               # Application state management
└── utils/               # Utility functions
```

## 📝 How It Works

### Creating a Form

1. Select **"Create form"** from the main menu
2. Enter a title for your form
3. Add questions one by one
4. Press `Enter` with an empty input to finish

Forms are saved as `.txt` files in the `forms/` directory.

### Answering a Form

1. Select **"Start form"** from the main menu
2. Choose a form from the list
3. Answer each question when prompted
4. Responses are automatically saved to the `answers/` directory

### Form File Format

Forms are stored as simple text files:

```
Form Title
Question 1?
Question 2?
Question 3?
```

### Answer File Format

Answers are stored with timestamps:

```
[form_id] - Form Title

Q: Question 1?
A: User's answer

Q: Question 2?
A: User's answer
```

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime
- **Language**: TypeScript
- **Dependencies**:
  - `dayjs` - Date/time formatting

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with ❤️ using [Bun](https://bun.sh)
- Inspired by the need for simple, terminal-based form management

---

<p align="center">
  Made with ☕ and TypeScript
</p>
