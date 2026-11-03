import Editor from "@monaco-editor/react";
import { useLocation } from "react-router-dom";
import { useState } from "react";

function Problem() {
    const location = useLocation();
    const problem = location.state?.problem;

    const [solution, setSolution] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("python");

    if (!problem) {
        return <h2>Problem not found</h2>;
    }

    const submitSolution = async () => {
        if (!solution.trim()) {
            alert("Please enter your solution first.");
            return;
        }
        if (language !== "python") {
    alert("Code execution is currently available only for Python.");
    return;
}

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/evaluate-solution",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        problem_id: problem.id,
                        code: solution,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Evaluation failed.");
            }

            setResult(data);

        } catch (error) {
            console.error("Error submitting solution:", error);

            setResult({
                correct: false,
                score: 0,
                feedback: error.message || "Could not connect to backend.",
            });

        } finally {
            setLoading(false);
        }
    };

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

            <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
    <h4>Your Solution</h4>

    <select
        className="form-select w-auto"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
    >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
    </select>
</div>

            <div className="border rounded mt-3 overflow-hidden">
                {language === "python" ? (
    <div className="alert alert-success py-2">
        Python execution is available.
    </div>
) : (
    <div className="alert alert-warning py-2">
        Editor support is available, but code execution for this language is coming soon.
    </div>
)}
    <Editor
        height="400px"
        language={language}
        theme="vs-dark"
        value={solution}
        onChange={(value) => setSolution(value || "")}
        options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 4,
            wordWrap: "on",
        }}
    />
</div>

            <button
                className="btn btn-success mt-3"
                onClick={submitSolution}
                disabled={loading}
            >
                {loading ? "Evaluating..." : "Submit Solution"}
            </button>

            {result && (
                <div className="card shadow mt-4 p-4">

                    <h3>
                        {result.correct
                            ? "✅ Accepted"
                            : "❌ Wrong Answer"}
                    </h3>

                    <h2>Score: {result.score}/100</h2>

                    <p>{result.feedback}</p>

                    {result.results && (
                        <>
                            <h4 className="mt-4">
                                Test Case Results
                            </h4>

                            {result.results.map((test, index) => (
                                <div
                                    key={index}
                                    className="border rounded p-3 mb-3"
                                >
                                    <h5>
                                        Test Case {index + 1}{" "}
                                        {test.passed
                                            ? "✅ Passed"
                                            : "❌ Failed"}
                                    </h5>

                                    <p>
                                        <strong>Expected:</strong>{" "}
                                        {JSON.stringify(
                                            test.expected ?? "Not available"
                                        )}
                                    </p>

                                    <p>
                                        <strong>Actual:</strong>{" "}
                                        {JSON.stringify(
                                            test.actual ?? "Not available"
                                        )}
                                    </p>

                                    {test.error && (
                                        <p className="text-danger">
                                            <strong>Error:</strong>{" "}
                                            {test.error}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </>
                    )}

                </div>
            )}

        </div>
    );
}

export default Problem;
