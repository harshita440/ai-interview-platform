import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);

useEffect(() => {
    fetch("http://127.0.0.1:8000/problems")
        .then((response) => response.json())
        .then((data) => {
            setProblems(data.problems);
        })
        .catch((error) => {
            console.error("Error loading problems:", error);
        });
}, []);
  const startInterview = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/start-interview", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                interview_type: "technical",
                difficulty: "medium",
            }),
        });

        const data = await response.json();

        console.log(data);

        if (problems.length > 0) {
            navigate("/problem", {
                state: {
                    problem: problems[0]
                }
            });
        }
    } catch (error) {
        console.error("Error starting interview:", error);
    }
};
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Dashboard</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow p-3">
            <h4>🎤 Start Interview</h4>
            <p>Begin your AI interview session.</p>
            <button className="btn btn-primary" onClick={startInterview}>
              Start
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow p-3">
            <h4>📊 Performance</h4>
            <p>View your interview scores.</p>
            <button className="btn btn-success">
              View
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow p-3">
            <h4>📜 History</h4>
            <p>See previous interviews.</p>
            <button className="btn btn-secondary">
              Open
            </button>
          </div>
        </div>

      </div>
      <div className="mt-5">
    <h3>Interview Problems</h3>

    <div className="row">
        {problems.map((problem) => (
            <div className="col-md-6 mb-4" key={problem.id}>
                <div className="card shadow p-3">
                    <h4>{problem.title}</h4>

                    <p>{problem.description}</p>

                    <p>
                        <strong>Topic:</strong> {problem.topic}
                    </p>

                    <p>
                        
                        <p>
    <strong>Difficulty:</strong>{" "}
    <span
        className={
            problem.difficulty === "Easy"
                ? "badge bg-success"
                : problem.difficulty === "Medium"
                ? "badge bg-warning text-dark"
                : "badge bg-danger"
        }
    >
        {problem.difficulty}
    </span>
</p>
                    </p>

                    <button
    className="btn btn-primary"
    onClick={() => navigate("/problem", { state: { problem } })}
>
    Solve
</button>
                </div>
            </div>
        ))}
    </div>
</div>
    </div>
  );
}
export default Dashboard;