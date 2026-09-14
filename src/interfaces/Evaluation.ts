import type AiResponse from "./AiResponse";
import type Resume from "./Resume";

export default interface Evaluation {
    id: number;
    userId: number;
    resumeId: number;
    jobTitle: string;
    jobDescription: string;
    score: number;
    aiResponse: AiResponse;
    resume: Resume;
    createdAt: string;
    updatedAt: string;
}