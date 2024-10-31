'use server'
// HAS TO HAVE USE SERVER!!! OTHERWISE NOT WORKING
// because openai blocks openai api key if used on client side to prevent leaking
const apiRequest = require("./apiRequest");

const responseFormat = {
    "type": "json_schema",
    "json_schema": {
        "name": "user_groups",
        "strict": true,
        "schema": {
            "type": "object",
            "properties": {
                "group_size": {
                    "type": "number",
                    "description": "The size that each group should contain."
                },
                "groups": {
                    "type": "array",
                    "description": "List of groups created from users.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "group_id": {
                                "type": "string",
                                "description": "Unique identifier for the group."
                            },
                            "members": {
                                "type": "array",
                                "description": "List of user IDs in the group.",
                                "items": {
                                    "type": "string"
                                }
                            }
                        },
                        "required": [
                            "group_id",
                            "members"
                        ],
                        "additionalProperties": false
                    }
                }
            },
            "required": [
                "group_size",
                "groups"
            ],
            "additionalProperties": false
        }
    }
};

export const matching = async (teamSize, questions, data) => {
    const context = `You need group the users into groups of size ${teamSize}. Put users with similar background and skill level together.`;
    
    const input = "1. Alice Johnson          - Skill Level: 99\n" +
                    "2. Michael Smith          - Skill Level: 65\n" +
                    "3. Sarah Thompson         - Skill Level: 82\n" +
                    "4. David Williams         - Skill Level: 54\n" +
                    "5. Emily Davis            - Skill Level: 12\n" +
                    "6. Christopher Brown      - Skill Level: 73\n" +
                    "7. Jessica Wilson         - Skill Level: 30\n" +
                    "8. Daniel Martinez        - Skill Level: 20\n" +
                    "9. Megan Garcia           - Skill Level: 77\n" +
                    "10. Andrew Lee            - Skill Level: 85";
    console.log('teamsize', teamSize);
    console.log('questions', questions);
    console.log('data', data);

    if (typeof teamSize !== 'number') {
        throw new Error('Team size must be a number');
    }
    
    return await apiRequest({context, responseFormat, input});
}