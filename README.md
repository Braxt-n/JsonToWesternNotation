# HarmonyHub Notation Prototype

An open-source, lightweight web renderer designed to transform generative musical exercise data into standard Western staff notation. This project was developed as a technical challenge to bridge the gap between AI-generated JSON and human-readable sheet music.

## Features
* **Dynamic Measure Partitioning**: Automatically calculates measure boundaries based on time signature metadata (e.g., 12 units for 3/4, 16 units for 4/4).
* **Intelligent Note Splitting**: Handles notes that cross measure boundaries by automatically splitting them into tied segments to maintain rhythmic integrity.
* **Musical Engraving Rules**: Includes custom logic for automated stem directions, beaming for eighth/sixteenth notes, and proper whole-note rendering.
* **Responsive Grid Layout**: Renders music in a professional 3-measure-per-line grid rather than a single vertical stack, optimizing page space.

## How It Works
The program uses a custom JavaScript parser to translate HarmonyHub's 8th-note unit system into VexFlow's EasyScore strings:
1.  **Input**: A JSON object containing an `exercise` array (note/duration pairs) and `metadata` (key, time signature).
2.  **Processing**: The `convertJsonToVexString` function partitions the raw data into a measure-based array of strings.
3.  **Rendering**: A React component iterates through the array to draw each measure onto a coordinated canvas using **VexFlow**.

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm or yarn

### Installation
1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/USERNAME/REPO-NAME.git](https://github.com/USERNAME/REPO-NAME.git)
    cd REPO-NAME
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Usage
To render your own exercises, simply update the `src/mock-data.json` file with your generated data. The app utilizes React's lifecycle to automatically re-render the notation based on the updated notes and metadata.
