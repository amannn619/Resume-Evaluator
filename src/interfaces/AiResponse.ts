export default interface AiResponse {
    score: number,
    jobTitle: string,
    strengths: string[],
    improvements: string[],
    missingKeywords: string[],
    detectedExperience: string
}