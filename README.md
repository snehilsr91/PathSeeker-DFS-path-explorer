# PathSeeker: A DFS-Powered Graph Path Explorer

---

## Author Details

*   **Name:** [Your Full Name]
*   **Student ID/Roll No.:** [Your Student ID or Roll Number]
*   **Course:** Discrete Mathematical Structures
*   **Project Submission for:** [Professor's Name / Course Name & Number, e.g., DMS Experiential Learning Project]
*   **Email:** [Your Email Address (Optional)]
*   **GitHub Profile:** [Link to Your GitHub Profile (Optional, if you host it there)]

---

## Project Description

PathSeeker is an interactive web application designed as an educational tool to visualize and explore the process of finding all simple paths between two nodes in a graph using the **Depth-First Search (DFS)** algorithm.

The core purpose of this project is to provide users with a clear, step-by-step understanding of how DFS traverses a graph, including its crucial backtracking mechanism, to enumerate every possible route from a specified source to a destination. Users can:

*   **Create Custom Graphs:** Dynamically build their own graph structures by adding nodes and edges.
*   **Specify Graph Properties:** Define graphs as directed or undirected and assign optional weights to edges.
*   **Visualize DFS Traversal:** Observe an animation of the DFS algorithm, highlighting visited nodes, traversed edges, and backtracking steps.
*   **View All Discovered Paths:** See a comprehensive list of all paths found, along with their lengths (number of nodes) and costs (sum of edge weights).
*   **Control the Animation:** Adjust animation speed, pause, resume, and step through the algorithm.
*   **Learn through Study Elements:** Access integrated explanations of the DFS path-finding algorithm, its comparison with BFS, and its time complexity.

This project aims to bridge the gap between theoretical graph concepts learned in Discrete Mathematical Structures and their practical application and visual behavior.

---

## Technologies Used

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Graph Visualization Library:** [Vis.js (Network Module)](https://visjs.org/)
*   **Core DMS Concepts Implemented:**
    *   Graph Theory (Nodes, Edges, Directed/Undirected, Weighted)
    *   Depth-First Search (DFS) Algorithm
    *   Backtracking
    *   Path Enumeration

---

## File Structure

The project is organized as follows:

path-explorer/
├── index.html # Main HTML file for the UI
├── css/
│ └── style.css # Styles for the application
├── js/
│ ├── app.js # Main application logic, event handling
│ ├── graph.js # Graph data structure and manipulation
│ ├── dfs.js # DFS algorithm for path finding
│ ├── visualizer.js # Handles vis.js integration and animation
│ └── utils.js # Utility functions
├── lib/
│ ├── vis-network.min.js # Vis.js library (essential)
│ └── vis-network.min.css # Vis.js CSS (essential)
├── study/
│ ├── dfs_explanation.html # Linked study material
│ ├── bfs_comparison.html # Linked study material
│ └── complexity_optimization.html # Linked study material
└── README.md # This file




---

## Guidelines to Run the Project

To run the PathSeeker application on your local machine, follow these steps:

1.  **Prerequisites:**
    *   A modern web browser (e.g., Google Chrome, Mozilla Firefox, Microsoft Edge).
    *   (Optional, but **highly recommended** for best results) A local web server. Running directly from the file system (`file:///...`) might cause issues with loading linked study files.

2.  **Download or Clone the Project:**
    *   Ensure you have all the project files and folders as listed in the "File Structure" section above.
    *   **Crucially, make sure the `lib/` folder contains `vis-network.min.js` and `vis-network.min.css`.** If these are missing, you'll need to download them from the [Vis.js website](https://visjs.org/docs/network/) or a source like [unpkg](https://unpkg.com/vis-network/).

3.  **Running the Application:**

    *   **Method 1: Using a Local Web Server (Recommended)**
        *   **If using VS Code with the "Live Server" extension:**
            1.  Open the `path-explorer` project folder in VS Code.
            2.  Right-click on `index.html` in the VS Code file explorer.
            3.  Select "Open with Live Server". Your browser will open automatically.
        *   **If using Python's built-in server:**
            1.  Open your terminal or command prompt.
            2.  Navigate to the root `path-explorer` directory (`cd path/to/your/path-explorer`).
            3.  Run `python -m http.server` (for Python 3) or `python -m SimpleHTTPServer` (for Python 2).
            4.  Open your browser and go to `http://localhost:8000` (or the port indicated).
        *   **If using Node.js `http-server`:**
            1.  Ensure `http-server` is installed (`npm install -g http-server`).
            2.  Open your terminal or command prompt.
            3.  Navigate to the root `path-explorer` directory.
            4.  Run `http-server`.
            5.  Open your browser and go to `http://localhost:8080` (or the port indicated).

    *   **Method 2: Opening `index.html` Directly (Not Recommended for full functionality)**
        1.  Navigate to the `path-explorer` folder in your computer's file explorer.
        2.  Double-click on the `index.html` file, or right-click and "Open with" your preferred browser.
        3.  **Note:** While the main application might work, links to the `/study/` HTML files might not open correctly in new tabs due to browser security restrictions with `file:///` URLs.

4.  **Using the Application:**
    *   Once `index.html` is loaded, you can start creating nodes and edges using the controls panel.
    *   Select a source and destination node, then click "Find Paths (DFS)" to see the visualization.
    *   Use the algorithm controls to adjust speed, pause, or step through the animation.
    *   Refer to the "Study Elements" section for more information on the concepts.

---

Enjoy exploring paths with PathSeeker!
