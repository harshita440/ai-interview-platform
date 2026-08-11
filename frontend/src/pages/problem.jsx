import { useLocation } from "react-router-dom";
import { useState } from "react";
function Problem() {
    const location = useLocation();
    const problem = location.state?.problem;
    const [solution, setSolution] = useState("");
    const [result, setResult] = useState(null);
    if (!problem) {
        return <h2>Problem not found</h2>;
    }
    return (
        <div className="container mt-5">
            <h2>{problem.title}</h2>
            <p>
                <strong>Topic:</strong> {problem.topic}
            </p>
            <p>
                <strong>Difficulty:</strong> {problem.difficulty}
            </p>
            <hr />
            <h4>Problem Description</h4>
            <p>{problem.description}</p>
            <textarea
                className="form-control"
                rows="10"
                placeholder="Write your solution here..."
                value={solution}
                onChange={(e) => setSolution(e.target.value)}>
</textarea>
<button
    className="btn btn-success mt-3"
    onClick={async () => {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/submit-solution",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        problem_id: problem.id,
                        solution: solution,
                    }),
                }
            );

            const data = await response.json();

            console.log(data);

            setResult(data);

        } catch (error) {
            console.error("Error submitting solution:", error);

            setResult({
                status: "error",
                message: "Could not connect to the backend."
            });
        }
    }}
>
    Submit Solution
</button>

{result && (
    <div className="alert alert-info mt-3">
        <strong>{result.status}</strong>
        <br />
        {result.message}
    </div>
)}
</div>
    );
}
export default Problem;