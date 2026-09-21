# Advanced Disk Scheduling Simulator

A real-time interactive web application to simulate, visualize, and compare Operating System disk scheduling algorithms:
- **FCFS** (First Come, First Served)
- **SSTF** (Shortest Seek Time First)
- **SCAN** (Elevator Algorithm)
- **C-SCAN** (Circular SCAN)

## Features
- **Real-Time Visualizations**: Includes animated disk platter track head and seek path charts.
- **Performance Metrics**: Calculates total seek distance, average seek time, throughput, and relative efficiency.
- **Comparative Analysis**: Bar charts comparing performance across all algorithms for the same request queue.
- **Customizable Inputs**: Modify disk size (cylinders), head position, request queue, animation speed, and seek direction.

---

## Live Demo & Deployment

This project is built using standard static web technologies (`HTML5`, `CSS3`, `JavaScript`) and can be deployed for free on various static hosting platforms.

### Option 1: GitHub Pages (Recommended)
1. Push this repository to GitHub.
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Build and deployment**:
   - **Source**: Select `GitHub Actions` (or `Deploy from a branch` -> `main` / root).
4. Save settings. Your site will be live at:
   `https://<your-username>.github.io/Advanced-Disk-Scheduling--Simulator/`

### Option 2: Vercel
1. Install Vercel CLI (`npm i -g vercel`) or log into [vercel.com](https://vercel.com).
2. Import the GitHub repository or run `vercel` in the project root directory.

### Option 3: Netlify
1. Log into [netlify.com](https://netlify.com).
2. Drag and drop the repository folder or import from GitHub.

---

## Local Development
To test locally, simply open `index.html` in any web browser, or launch a local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js npx
npx serve .
```
Then visit `http://localhost:8000` in your browser.
