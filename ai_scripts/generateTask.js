'use server'
// HAS TO HAVE USE SERVER!!! OTHERWISE NOT WORKING
// because openai blocks openai api key if used on client side to prevent leaking
const apiRequest = require("./apiRequest");

const responseFormat = {
    "type": "json_schema",
    "json_schema": {
        "name": "task_generation",
        "strict": true,
        "schema": {
            "type": "object",
            "properties": {
                "stages": {
                    "type": "array",
                    "description": "A list of stages, each containing a list of tasks.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "stage_name": {
                                "type": "string",
                                "description": "The name of the stage."
                            },
                            "tasks": {
                                "type": "array",
                                "description": "A list of tasks associated with this stage.",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "task_name": {
                                            "type": "string",
                                            "description": "The name of the task."
                                        },
                                        "assigned_user": {
                                            "type": "string",
                                            "description": "The user to whom the task is assigned."
                                        }
                                    },
                                    "required": [
                                        "task_name",
                                        "assigned_user"
                                    ],
                                    "additionalProperties": false
                                }
                            }
                        },
                        "required": [
                            "stage_name",
                            "tasks"
                        ],
                        "additionalProperties": false
                    }
                }
            },
            "required": [
                "stages"
            ],
            "additionalProperties": false
        },
        "strict": true
    }
};


export const generateTask = async (questions, userResponses, charterQuestions, teamCharterResponses) => {
    const context = `Based on the team charter reponses about project products and goals, generate a list of general stages, each containing a list of actionable tasks. And assign each of the tasks to a member based on their relevant skills. Users' question surveys: ${questions}, and reponses: ${userResponses}`;

    if (!userResponses || userResponses.length === 0) {
        throw new Error('There are no users to assign tasks to.');
    }
    if (!teamCharterResponses || teamCharterResponses.length === 0) {
        throw new Error('The team charter is empty.');
    }
    const input = `Questions: ${charterQuestions}. Reponses: ${teamCharterResponses}`;
    return await apiRequest({ context, responseFormat, input });
}