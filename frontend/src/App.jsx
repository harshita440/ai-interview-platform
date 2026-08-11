import { useEffect, useState } from "react";
import { BrowserRouter , Routes , Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Problem from "./pages/Problem";
function App() {
  const startInterview = async () => {
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
};
  const [message, setMessage] = useState("");
useEffect(() => {
  fetch("http://127.0.0.1:8000/test")
    .then((response) => response.json())
    .then((data) => {
      setMessage(data.message);
    })
    .catch((error) => {
      console.error("Error connecting to backend:", error);
    });
}, []);
  return (
    <BrowserRouter>
    <p>{message}</p>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />}  />
      <Route path="/dashboard" element={<Dashboard />}  />
      <Route path="/problem" element={<Problem />}  />
     </Routes>
    </BrowserRouter>
    
  );
}
export default App;