# 🔍 Keyword Research Panel

A modern React-based keyword research tool that integrates with RapidAPI to provide real-time keyword suggestions, search volume data, and difficulty metrics.

## ✨ Features

- **Real-time Keyword Research**: Search for keywords using RapidAPI integration
- **Debounced Search**: Automatic search after 300ms pause for better performance
- **Bookmark System**: Star and save important keywords for later reference
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Dark Mode Support**: Automatic theme switching
- **Loading States**: Smooth loading animations and error handling
- **Volume & Difficulty Metrics**: View search volume ranges and competition difficulty

## 🚀 Live Demo

[Add your deployed URL here]

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **RapidAPI** for keyword research data
- **Ahrefs DR Rank Checker API** for keyword metrics

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sirajahmadzai/keyword-research-panel.git
   cd keyword-research-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_RAPIDAPI_KEY=your_rapidapi_key_here
   ```

4. **Get your RapidAPI key**
   - Sign up at [RapidAPI](https://rapidapi.com)
   - Subscribe to the "Ahrefs DR Rank Checker" API
   - Copy your API key and add it to the `.env` file

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎯 Usage

1. **Search for Keywords**: Enter a topic or keyword in the search box
2. **View Results**: See keyword suggestions with volume and difficulty metrics
3. **Bookmark Keywords**: Click the star icon to save important keywords
4. **Debounced Search**: Results appear automatically after you stop typing

## 📊 API Data

The app uses the Ahrefs DR Rank Checker API to provide:
- **Keyword Suggestions**: Related keywords and phrases
- **Search Volume**: Monthly search volume ranges (e.g., "10,000+")
- **Difficulty Levels**: Competition difficulty (Easy, Medium, Hard, Unknown)

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   └── KeywordResearchPanel.tsx  # Main component
├── App.tsx                       # App wrapper
├── main.tsx                      # Entry point
└── index.css                     # Global styles
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_RAPIDAPI_KEY` | Your RapidAPI authentication key | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [RapidAPI](https://rapidapi.com) for providing the keyword research API
- [Ahrefs](https://ahrefs.com) for the keyword data
- [TailwindCSS](https://tailwindcss.com) for the styling framework
- [Vite](https://vitejs.dev) for the build tool

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/sirajahmadzai/keyword-research-panel/issues) page
2. Create a new issue with detailed information
3. Include your environment and steps to reproduce

---

**Made with ❤️ by [Your Name]**
