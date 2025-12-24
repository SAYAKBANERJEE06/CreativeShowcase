# 🎨 Creative Showcase

Creative Showcase is a professional-grade digital portfolio platform designed for artists to curate, organize, and share their work. The application features a high-performance masonry gallery and an integrated critique engine that provides technical feedback on every uploaded piece.

## ✨ Key Features

- **Responsive Masonry Gallery**: A fluid, Pinterest-style layout optimized for various aspect ratios, ensuring artwork is displayed without cropping.
- **Automated Critique Engine**: Utilizes advanced vision processing to analyze artwork titles, descriptions, and visual content, providing professional artistic feedback.
- **Persistent Authentication**: A complete Signup and Login flow with session persistence via LocalStorage.
- **Artist Dashboard**: A private workspace for managing portfolios, tracking uploads, and reviewing critiques.
- **Public Profiles**: Dynamic routing (`#/profile/username`) that allows artists to share their curated collections with the world.
- **Premium Design System**: Built with Tailwind CSS using a "Stone & Indigo" aesthetic, paired with **Playfair Display** and **Inter** typography.

## 🚀 Tech Stack

- **Frontend**: React 19 (Hooks & Functional Architecture)
- **Routing**: React Router 7
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome 6
- **Analysis Engine**: Google Generative AI SDK (`@google/genai`)
- **Storage**: Browser LocalStorage API

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (LTS)
- A Google Gemini API Key (for the critique feature)

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/your-username/creative-showcase.git](https://github.com/your-username/creative-showcase.git)
   cd creative-showcase