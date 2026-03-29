# AutoOps AI - Autonomous Enterprise Operator

AutoOps AI is a multi-agent MERN application designed to fully automate enterprise workflows out of meetings. It converts meeting transcripts into actionable tasks, monitors progress, detects bottlenecks, and triggers automated execution steps.

## AI Agents Architecture
1. **Meeting Intelligence Agent**: Ingests transcripts and extracts structured data (tasks, owners, deadlines, decisions) using Gemini API.
2. **Task Creation Agent**: Takes the structured data and routes it into the workflow DB.
3. **Workflow Monitoring Agent**: Periodically scans the database for overdue tasks or workflow bottlenecks.
4. **Execution Agent**: Triggers external notifications/actions based on monitor alerts.
5. **Decision Audit Agent**: Logs every AI action, its reasoning, and confidence score for security and transparency.

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (Running locally or MongoDB Atlas)
- Gemini API Key

### Installation

1. Clone or navigate to the project root.
2. Install standard dependencies:
   ```bash
   cd backend
   npm install
   ```
   ```bash
   cd frontend
   npm install
   ```

### Configuration
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/autoops-ai
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If you don't provide a Gemini API Key, the system will fall back to mock data for demonstration purposes.)*

### Running the App

Start Backend (Terminal 1):
```bash
cd backend
npm run dev
# Or node server.js
```

Start Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

### Usage
1. Open up `http://localhost:5173` in your browser.
2. Copy the text from `sample-transcript.txt` and paste it into the Meeting Intelligence panel.
3. Click "Analyze Meeting". The AI will extract the tasks and populate the Task Board.
4. Watch as the Audit Logs dynamically register the multiple AI agents reasoning out the task assignment and monitoring.
5. You can trigger delays by simulating old dates in the DB to see the Workflow Monitoring agent act.
