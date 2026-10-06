# 🚦 Smart Traffic Signal Management

### Intelligent Traffic Control Using Dijkstra's Algorithm

> A smart traffic management prototype that dynamically responds to changing traffic conditions, calculates the fastest route using Dijkstra's algorithm, and provides priority routing for emergency vehicles.

---

## 👩‍💻 Project Information

| Details | Information |
|---|---|
| **Project Name** | Smart Traffic Signal Management |
| **Repository** | smart-trafic-signal-management |
| **GitHub Username** | kalyani118 |
| **Hackathon** | Algorithmic Problem-Solving Hackathon (APSH 2026) |
| **Algorithm** | Dijkstra's Shortest Path Algorithm |
| **Algorithm Paradigm** | Greedy / Graph Algorithm |
| **Project Type** | Smart Traffic Management Prototype |

---

## 📌 Overview

Traffic congestion is one of the major problems in urban areas. Traditional traffic signals generally operate with fixed timings and may not respond effectively when traffic conditions change.

**Smart Traffic Signal Management** is an interactive traffic-control prototype designed to demonstrate how algorithmic problem solving can improve traffic flow.

The system represents the road network as a **weighted graph**, where:

- 🚦 Junctions are represented as **vertices**
- 🛣️ Roads are represented as **edges**
- ⏱️ Travel time is represented as the **edge weight**
- 🚗 Traffic congestion changes the road weight
- 🧠 Dijkstra's algorithm calculates the fastest route
- 🚑 Emergency Vehicle Mode provides route priority

---

## 🎯 Problem Statement

Fixed-time traffic signals cannot always adapt to changing traffic conditions.

When congestion increases on a particular road, vehicles may experience:

- Long waiting times
- Increased travel time
- Unnecessary fuel consumption
- Traffic congestion
- Delays for emergency vehicles

This project provides an algorithmic approach where traffic conditions can dynamically change the road weights and the fastest route can be recalculated.

---

## 💡 Our Solution

The system continuously considers the current traffic condition of the simulated road network.

### Basic Workflow

```text
Traffic Condition
       ↓
Update Road Weight
       ↓
Build Weighted Graph
       ↓
Dijkstra's Algorithm
       ↓
Find Fastest Route
       ↓
Optimize Signal Decisions
       ↓
Display Result
✨ Key Features
🚦 1. Live Traffic Simulation
The system simulates changing traffic conditions:
🟢 LOW traffic
🟡 MEDIUM traffic
🔴 HIGH traffic
Different traffic levels affect the travel time of roads.
🗺️ 2. Weighted Road Network
The road network is represented using junctions and roads.
Junction
Location
A
North Gate
B
Civic Square
C
Tech Park
D
Medical District
E
Central Hub
F
East Terminal
Example road weights:
Road
Travel Time
A → B
3 min
A → D
4 min
B → E
2 min
D → E
3 min
E → F
5 min
B → F
9 min
B → C
9 min
C → F
7 min
🧠 3. Dijkstra's Shortest Path
Dijkstra's algorithm is used to find the fastest route between two junctions.
For example:
Source      → A
Destination → F

Fastest Path:
A → B → E → F

Estimated Time:
3 + 2 + 5 = 10 minutes
🚥 4. Dynamic Junction Control
The system displays the status of different traffic junctions and helps demonstrate how signal decisions can be optimized according to traffic flow.
The junction control interface shows:
Signal status
Green/Red state
Signal timing
Junction information
🚑 5. Emergency Vehicle Mode
The system provides a special mode for emergency vehicles.
When emergency mode is activated:
Emergency Vehicle
       ↓
Find Fastest Route
       ↓
Give Route Priority
       ↓
Optimize Signals
       ↓
Faster Emergency Response
This concept can support:
🚑 Ambulances
🚒 Fire engines
🚓 Police vehicles
Note: Emergency mode is simulated in this prototype. Real-world implementation would require integration with actual traffic infrastructure and proper safety authorization.
🔄 Dynamic Traffic Weighting
Traffic conditions can change the weight of a road.
For example:
LOW TRAFFIC
A → B = 3 minutes
If congestion increases:
HIGH TRAFFIC
A → B = 8 minutes
Therefore:
More Traffic
     ↓
Higher Travel Time
     ↓
Higher Edge Weight
     ↓
Updated Graph
     ↓
Dijkstra Recalculates Route
This allows the system to select a more efficient route when traffic conditions change.
⚙️ How the System Works
Step 1 — Read Traffic Conditions
The system reads the current simulated traffic level of each road.
Step 2 — Update Road Weights
Travel-time values are updated according to traffic conditions.
Step 3 — Build the Weighted Graph
Junctions and roads are represented as vertices and edges.
Step 4 — Run Dijkstra's Algorithm
The algorithm calculates the fastest available route.
Step 5 — Trace the Route
The system displays the selected route and estimated travel time.
Step 6 — Optimize Signals
Signal decisions are adjusted according to the traffic flow and selected route.
Step 7 — Emergency Priority
If emergency mode is activated, the emergency route receives priority.
🧪 Example Test Case
Test Case: A → F
Source      : A - North Gate
Destination : F - East Terminal
Dijkstra's algorithm calculates:
A → B → E → F
Calculation:
A → B = 3 minutes
B → E = 2 minutes
E → F = 5 minutes

Total = 3 + 2 + 5
      = 10 minutes
Result
Fastest Route : A → B → E → F
Estimated Time: 10 minutes
Junctions     : 4
🧪 Test Scenarios
Test Case
Source
Destination
Expected Result
TC01
A
F
A → B → E → F
TC02
A
E
A → B → E
TC03
B
F
Fastest available route
TC04
A
F
Route changes when congestion increases
TC05
A
F
Emergency mode gives route priority
🏗️ System Architecture
+--------------------------+
|   Traffic Simulation     |
+------------+-------------+
             ↓
+--------------------------+
| Dynamic Road Weights     |
+------------+-------------+
             ↓
+--------------------------+
|    Weighted Graph        |
+------------+-------------+
             ↓
+--------------------------+
|  Dijkstra Route Engine   |
+------------+-------------+
             ↓
+--------------------------+
|  Fastest Route Detection |
+------------+-------------+
             ↓
+--------------------------+
| Junction Signal Control  |
+------------+-------------+
             ↓
+--------------------------+
| Emergency Vehicle Mode   |
+--------------------------+
💻 Technologies Used
HTML
CSS
JavaScript
Dijkstra's Algorithm
Graph Data Structure
Responsive Web Design
📂 Project Structure
smart-trafic-signal-management/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
├── assets/
│   └── screenshots/
│       ├── traffic-dashboard.png
│       └── junction-control.png
│
└── docs/
    └── project-documentation.pdf
📊 Algorithm Complexity
Dijkstra's algorithm using a priority queue has:
Time Complexity:
O((V + E) log V)

Space Complexity:
O(V + E)
Where:
V = Number of junctions
E = Number of roads
✅ Advantages
🚦 Improves traffic flow
⏱️ Reduces unnecessary waiting time
🗺️ Finds efficient routes
🚑 Supports emergency vehicle priority
🔄 Responds to changing traffic conditions
📊 Provides an interactive traffic dashboard
🧠 Demonstrates practical use of graph algorithms
🌍 Real-World Applications
The concept can be extended to:
Smart cities
Intelligent transportation systems
Emergency vehicle routing
Urban traffic management
Navigation systems
Traffic monitoring centers
Adaptive traffic signal systems
🚀 Future Scope
The prototype can be further improved by integrating:
📡 Real-Time Sensors
Traffic cameras and IoT sensors can provide real-time traffic information.
🤖 Machine Learning
Machine learning can predict future congestion using historical traffic data.
🗺️ GPS and Traffic APIs
Real-time location and traffic information can be integrated.
🚦 Automatic Signal Control
The system could communicate with actual traffic signal controllers.
🚑 Automatic Emergency Detection
Emergency vehicles could be detected automatically and given priority.
📱 Mobile Application
A mobile application could provide traffic information and route suggestions.
⚠️ Current Limitations
This project is currently a simulation/prototype.
Traffic values are simulated.
No physical traffic sensors are connected.
Traffic signals are represented digitally.
The system is not directly connected to real roads.
Real-world deployment would require infrastructure integration, testing, safety validation, and authorization.
🏆 Algorithmic Significance
This project demonstrates how a classical graph algorithm can be applied to a real-world traffic management problem.
Graph Representation
Junction = Vertex
Road     = Edge
Traffic  = Weight
Algorithm
Dijkstra's Shortest Path
Application
Fastest Route
      +
Signal Optimization
      +
Emergency Priority
      =
Smart Traffic Management
👩‍💻 Team Information
Team Name: FlowGrid
GitHub Username: kalyani118
Project: Smart Traffic Signal Management
Hackathon: APSH 2026
📚 References
T. H. Cormen, C. E. Leiserson, R. L. Rivest and C. Stein, Introduction to Algorithms.
Robert Sedgewick and Kevin Wayne, Algorithms.
Thomas H. Cormen, Algorithms Unlocked.
Programming and web development documentation.
Intelligent Transportation Systems and Adaptive Traffic Signal Control resources.
🔮 Project Vision
Smarter signals. Faster routes. Safer emergency response.
The goal of Smart Traffic Signal Management is to demonstrate how algorithms and intelligent traffic control can be combined to create more efficient and responsive urban transportation systems.
