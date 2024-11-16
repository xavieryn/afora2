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
                            "order": {
                                "type": "number",
                                "description": "The order of the stage."
                            },
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
                                        "order": {
                                            "type": "number",
                                            "description": "The order of the stage."
                                        },
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
                                        "order",
                                        "task_name",
                                        "assigned_user"
                                    ],
                                    "additionalProperties": false
                                }
                            }
                        },
                        "required": [
                            "order",
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
    const context = `While knowing nothing else, try to come up with a project road map separated into various levels each assigned with an order number assigned (each levels is a sub-goal that adds up together to achieve the ultimate goal).

Each levels should also have concrete actionable steps, as detailed as possible, to achieve the sub-goal for each level.

Lastly, categorize similar actionable steps together based on the skills necessary to perform them and the kind of field they are in, and assign a user email to perform that specific category of tasks.`;

    if (!userResponses || userResponses.length === 0) {
        throw new Error('There are no users to assign tasks to.');
    }
    if (!teamCharterResponses || teamCharterResponses.length === 0) {
        throw new Error('The team charter is empty.');
    }
    const input = `User onboarding project questions: ${questions}. Users' responses: ${userResponses}. Team Charter Questions: ${charterQuestions}. Team Charter Responses: ${teamCharterResponses}`;
    return await apiRequest({ context, responseFormat, input });
}