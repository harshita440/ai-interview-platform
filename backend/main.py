from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from evaluator import evaluate_code
from test_cases import TEST_CASES
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return {"message": "Backend is working!"}
@app.get("/test")
def test():
    return {
        "status": "success",
        "message": "AI Interview Platform API is working!"
    }
from pydantic import BaseModel


class InterviewRequest(BaseModel):
    interview_type: str
    difficulty: str
class SolutionRequest(BaseModel):
    problem_id: int
    solution: str

@app.post("/start-interview")
def start_interview(request: InterviewRequest):
    return {
        "status": "success",
        "message": "Interview started!",
        "interview_type": request.interview_type,
        "difficulty": request.difficulty
    }
@app.get("/problems")
def get_problems():
    return {
        "problems": [
            {
                "id": 1,
                "title": "Two Sum",
                "difficulty": "Easy",
                "topic": "Arrays",
                "description": "Find two numbers in an array that add up to a target."
            },
            {
                "id": 2,
                "title": "Reverse a String",
                "difficulty": "Easy",
                "topic": "Strings",
                "description": "Write a program to reverse a given string."
            },
            {
                "id": 3,
                "title": "Valid Parentheses",
                "difficulty": "Medium",
                "topic": "Stack",
                "description": "Check whether brackets in a string are properly balanced."
            },
            {
                "id": 4,
                "title": "Binary Tree Traversal",
                "difficulty": "Medium",
                "topic": "Trees",
                "description": "Traverse a binary tree using inorder traversal."
            }
        ]
    }
def evaluate_keyword_solution(problem_id, solution):
    solution_lower = solution.lower()

    if problem_id == 1:
        if "two sum" in solution_lower or "target" in solution_lower:
            return {
                "status": "accepted",
                "message": "Solution passed!"
            }

    elif problem_id == 2:
        if "reverse" in solution_lower or "[::-1]" in solution:
            return {
                "status": "accepted",
                "message": "Solution passed!"
            }

    elif problem_id == 3:
        if "stack" in solution_lower or "parentheses" in solution_lower:
            return {
                "status": "accepted",
                "message": "Solution passed!"
            }

    elif problem_id == 4:
        if "inorder" in solution_lower or "tree" in solution_lower:
            return {
                "status": "accepted",
                "message": "Solution passed!"
            }

    return {
        "status": "wrong",
        "message": "Solution does not appear to solve the problem."
    }
@app.post("/submit-solution")
def submit_solution(request: SolutionRequest):
    if not request.solution.strip():
        return {
            "status": "error",
            "message": "Solution cannot be empty."
        }

    result = evaluate_keyword_solution(
    request.problem_id,
    request.solution
)

    return {
        "problem_id": request.problem_id,
        **result
    }
class EvaluationRequest(BaseModel):
    problem_id: int
    code: str



@app.post("/evaluate-solution")
def evaluate_solution(request: EvaluationRequest):

    if not request.code.strip():
        return {
            "correct": False,
            "score": 0,
            "feedback": "Please submit your code."
        }

    if request.problem_id not in TEST_CASES:
        return {
            "correct": False,
            "score": 0,
            "feedback": "Test cases are not available for this problem yet."
        }

    evaluation = evaluate_code(
        request.code,
        TEST_CASES[request.problem_id]
    )

    correct = evaluation["passed"] == evaluation["total"]

    return {
        "correct": correct,
        "score": evaluation["score"],
        "passed": evaluation["passed"],
        "total": evaluation["total"],
        "feedback": (
            "Excellent! All test cases passed."
            if correct
            else "Some test cases failed. Review your solution."
        ),
        "results": evaluation["results"]
    }


