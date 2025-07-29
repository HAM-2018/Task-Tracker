# Task Tracker

A full-stack productivity web app for managing personal and team-based tasks, built with modern technologies and deployable via Docker or Kubernetes


## Features

 **User Authentication**  
- Register / Login with JWT-based authentication  
- Secure password hashing

 **Task Management**  
- Create, update, delete personal tasks  
- Set due dates, priority, and status  
- Filter by task state (todo / in-progress)

 **Team Collaboration**  
- Send and accept connection requests  
- Share tasks with teammates  
- View shared tasks

 **Responsive UI**  
- Clean, mobile-friendly interface  
- Built with modern UI components (Radix, TailwindCSS, ShadCN)

  **Deployment Ready**  
- Works with Docker and Docker Compose for local development  
- Kubernetes-ready with MongoDB persistent volume and service configuration

---

##  Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React + TypeScript + Vite           |
| Styling     | TailwindCSS + ShadCN UI + Radix     |
| State Mgmt  | React Hooks + TanStack React Query  |
| Backend     | Node.js + Express + TypeScript      |
| Database    | MongoDB                             |
| Auth        | JWT + Bcrypt                        |
| ORM         | Mongoose                            |
| Containers  | Docker + Docker Compose             |
| Orchestration | Kubernetes                        |
| Dev Tools   | Nodemon, Zod, ESLint                |

---

##  Live Demo

> Coming soon... Or see the [Video Demo](#📽️-demo) below.

## 📁 Project Structure

task-tracker/
├── backend/ # Node + Express API with Mongoose
├── frontend/ # React + Vite + Tailwind
├── k8s/ # Kubernetes manifests (Mongo, Backend, Frontend)
├── docker-compose.yml # For local dev
├── deploy.sh # Optional script to deploy to K8s cluster
└── README.md


## Getting Started

Option 1: Run Locally (with Docker Compose)

1. git clone https://github.com/HAM-2018/Task-Tracker.git

cd task-tracker

2. Create a .env file in each frontend and backend directory using the .env.example as a template (or just use the example itself).

3. Run the app using Docker Compose
docker compose up --build

Option 2: Ensure your kubernetes cluster is up and configured (Two node kubeadm and calico for cni in my case)

1. Apply kubernetes manifest

kubectl apply -f k8s/mongo/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/

2. Create a .env file in each frontend and backend directory using the .env.example as a template (or just use the example itself)

Frontend .env VITE_API_URL=http://<your-node-ip>:<node-port>
use the IP of the node the deployment is scheduled on and the node-port of the backend deployment service.


## Future Improvements

- Email notifications
- File attachments to tasks
- Role-based access control


