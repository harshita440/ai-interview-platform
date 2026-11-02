
import json
import subprocess
import sys
import tempfile
from pathlib import Path


def run_test_case(solution, test_case):
    test_input = json.dumps(test_case["input"])

    runner_code = f"""
import json

{solution}

test_input = json.loads({test_input!r})
result = two_sum(**test_input)

print(json.dumps(result))
"""

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            script_path = Path(temp_dir) / "solution.py"
            script_path.write_text(runner_code, encoding="utf-8")

            process = subprocess.run(
                [sys.executable, "-I", str(script_path)],
                capture_output=True,
                text=True,
                timeout=2
            )

        if process.returncode != 0:
            return {
                "passed": False,
                "error": process.stderr[-1000:]
            }

        output_lines = process.stdout.strip().splitlines()

        if not output_lines:
            return {
                "passed": False,
                "error": "No output returned."
            }

        actual = json.loads(output_lines[-1])
        expected = test_case["expected"]

        return {
            "passed": actual == expected,
            "expected": expected,
            "actual": actual
        }

    except subprocess.TimeoutExpired:
        return {
            "passed": False,
            "error": "Execution timed out."
        }

    except json.JSONDecodeError:
        return {
            "passed": False,
            "error": "Solution did not return valid JSON output."
        }

    except Exception as error:
        return {
            "passed": False,
            "error": str(error)
        }


def evaluate_code(solution, test_cases):
    results = []

    for test_case in test_cases:
        result = run_test_case(solution, test_case)
        results.append(result)

    passed = sum(1 for result in results if result["passed"])
    total = len(results)

    score = round((passed / total) * 100) if total else 0

    return {
        "passed": passed,
        "total": total,
        "score": score,
        "results": results
    }
