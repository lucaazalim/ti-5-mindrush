#!/usr/bin/env node

/**
 * Load Testing Script for MindRush Quiz Answer System
 *
 * This script simulates 60 users simultaneously:
 * 1. Joining a match by creating a participant with a random nickname
 * 2. Waiting 10 seconds
 * 3. Answering a question with a specific alternative ID
 *
 * Requirements:
 * - Response time must stay below 500ms for all requests
 * - All 60 users must complete successfully
 */

import http, { IncomingMessage } from "http";
import { performance } from "perf_hooks";

// Configuration
const CONFIG = {
  BASE_URL: "http://localhost:3000",
  MATCH_ID: "684072", // Replace with actual match ID
  NUM_USERS: 60,
  WAIT_TIME_MS: 10000, // 10 seconds
  MAX_RESPONSE_TIME_MS: 500,
  ALTERNATIVE_ID: "0deb393d-5921-49ae-9d25-124fd101e826", // Replace with actual alternative ID
};

// Colors for console output
const COLORS = {
  GREEN: "\x1b[32m",
  RED: "\x1b[31m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
} as const;

// Type definitions
interface RequestOptions {
  hostname: string;
  port: number;
  path: string;
  method: string;
  headers: Record<string, string>;
}

interface HttpResponse {
  statusCode: number;
  data: unknown;
  responseTime: number;
  headers: IncomingMessage["headers"];
}

interface ParticipantResponse {
  token: string;
  participant: {
    id: string;
    nickname: string;
    matchId: string;
  };
}

interface ParticipantCreationResult {
  success: boolean;
  token?: string;
  participant?: ParticipantResponse["participant"];
  error?: string;
  responseTime: number;
}

interface AnswerSubmissionResult {
  success: boolean;
  error?: string;
  responseTime: number;
}

interface UserResults {
  userId: number;
  nickname: string;
  participantCreation: ParticipantCreationResult | null;
  answerSubmission: AnswerSubmissionResult | null;
  totalTime: number;
}

/**
 * Generate a random nickname for participants
 */
function generateRandomNickname(): string {
  const adjectives = [
    "Fast",
    "Smart",
    "Cool",
    "Brave",
    "Quick",
    "Bright",
    "Swift",
    "Sharp",
    "Bold",
    "Clever",
  ];
  const nouns = [
    "Tiger",
    "Eagle",
    "Shark",
    "Wolf",
    "Lion",
    "Falcon",
    "Bear",
    "Fox",
    "Hawk",
    "Panther",
  ];
  const randomNum = Math.floor(Math.random() * 1000);

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adjective}${noun}${randomNum}`;
}

/**
 * Make HTTP request with performance tracking
 */
function makeRequest(
  options: RequestOptions,
  data: Record<string, unknown> | null = null,
): Promise<HttpResponse> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();

    const req = http.request(options, (res: IncomingMessage) => {
      let responseData = "";

      res.on("data", (chunk: Buffer) => {
        responseData += chunk.toString();
      });

      res.on("end", () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        try {
          const parsedData: unknown = responseData ? JSON.parse(responseData) : null;
          resolve({
            statusCode: res.statusCode ?? 0,
            data: parsedData,
            responseTime,
            headers: res.headers,
          });
        } catch {
          resolve({
            statusCode: res.statusCode ?? 0,
            data: responseData,
            responseTime,
            headers: res.headers,
          });
        }
      });
    });

    req.on("error", (error: Error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      reject(new Error(`Request failed: ${error.message} (${responseTime}ms)`));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Create a participant (join match)
 */
async function createParticipant(
  userId: number,
  nickname: string,
): Promise<ParticipantCreationResult> {
  const options: RequestOptions = {
    hostname: "localhost",
    port: 3000,
    path: `/api/matches/${CONFIG.MATCH_ID}/participants`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const data = { nickname };

  try {
    const response = await makeRequest(options, data);

    if (response.statusCode !== 201) {
      throw new Error(
        `Failed to create participant: ${response.statusCode} - ${JSON.stringify(response.data)}`,
      );
    }

    // Type assertion for the response data
    const responseData = response.data as ParticipantResponse;

    return {
      success: true,
      token: responseData.token,
      participant: responseData.participant,
      responseTime: response.responseTime,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: errorMessage,
      responseTime: 0,
    };
  }
}

/**
 * Submit an answer to the current question
 */
async function submitAnswer(
  userId: number,
  token: string,
  alternativeId: string,
): Promise<AnswerSubmissionResult> {
  const options: RequestOptions = {
    hostname: "localhost",
    port: 3000,
    path: "/api/matches/answers",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const data = { alternativeId };

  try {
    const response = await makeRequest(options, data);

    if (response.statusCode !== 201) {
      throw new Error(
        `Failed to submit answer: ${response.statusCode} - ${JSON.stringify(response.data)}`,
      );
    }

    return {
      success: true,
      responseTime: response.responseTime,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: errorMessage,
      responseTime: 0,
    };
  }
}

/**
 * Simulate a single user's journey
 */
async function simulateUser(userId: number): Promise<UserResults> {
  const nickname = generateRandomNickname();
  const results: UserResults = {
    userId,
    nickname,
    participantCreation: null,
    answerSubmission: null,
    totalTime: 0,
  };

  const userStartTime = performance.now();

  try {
    // Step 1: Create participant (join match)
    console.log(
      `${COLORS.BLUE}User ${userId}:${COLORS.RESET} Creating participant with nickname "${nickname}"`,
    );
    results.participantCreation = await createParticipant(userId, nickname);

    if (!results.participantCreation.success) {
      console.log(
        `${COLORS.RED}User ${userId}: Failed to create participant - ${results.participantCreation.error}${COLORS.RESET}`,
      );
      return results;
    }

    console.log(
      `${COLORS.GREEN}User ${userId}: Participant created (${results.participantCreation.responseTime.toFixed(2)}ms)${COLORS.RESET}`,
    );

    // Step 2: Wait 10 seconds
    console.log(
      `${COLORS.YELLOW}User ${userId}: Waiting ${CONFIG.WAIT_TIME_MS}ms before answering...${COLORS.RESET}`,
    );
    await new Promise((resolve) => setTimeout(resolve, CONFIG.WAIT_TIME_MS));

    // Step 3: Submit answer
    console.log(
      `${COLORS.BLUE}User ${userId}: Submitting answer with alternative ID "${CONFIG.ALTERNATIVE_ID}"${COLORS.RESET}`,
    );
    results.answerSubmission = await submitAnswer(
      userId,
      results.participantCreation.token!,
      CONFIG.ALTERNATIVE_ID,
    );

    if (!results.answerSubmission.success) {
      console.log(
        `${COLORS.RED}User ${userId}: Failed to submit answer - ${results.answerSubmission.error}${COLORS.RESET}`,
      );
      return results;
    }

    console.log(
      `${COLORS.GREEN}User ${userId}: Answer submitted successfully (${results.answerSubmission.responseTime.toFixed(2)}ms)${COLORS.RESET}`,
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.log(`${COLORS.RED}User ${userId}: Unexpected error - ${errorMessage}${COLORS.RESET}`);
  }

  const userEndTime = performance.now();
  results.totalTime = userEndTime - userStartTime;

  return results;
}

/**
 * Generate performance report
 */
function generateReport(results: UserResults[]): void {
  console.log(`\n${COLORS.BOLD}${COLORS.BLUE}=== LOAD TEST REPORT ===${COLORS.RESET}`);
  console.log(`${COLORS.BOLD}Test Configuration:${COLORS.RESET}`);
  console.log(`  • Users: ${CONFIG.NUM_USERS}`);
  console.log(`  • Match ID: ${CONFIG.MATCH_ID}`);
  console.log(`  • Alternative ID: ${CONFIG.ALTERNATIVE_ID}`);
  console.log(`  • Max Response Time: ${CONFIG.MAX_RESPONSE_TIME_MS}ms`);
  console.log(`  • Wait Time: ${CONFIG.WAIT_TIME_MS}ms\n`);

  const participantCreationResults = results.filter((r) => r.participantCreation?.success);
  const answerSubmissionResults = results.filter((r) => r.answerSubmission?.success);

  // Participant Creation Stats
  console.log(`${COLORS.BOLD}Participant Creation:${COLORS.RESET}`);
  console.log(
    `  • Success Rate: ${participantCreationResults.length}/${CONFIG.NUM_USERS} (${((participantCreationResults.length / CONFIG.NUM_USERS) * 100).toFixed(1)}%)`,
  );

  if (participantCreationResults.length > 0) {
    const participantTimes = participantCreationResults.map(
      (r) => r.participantCreation!.responseTime,
    );
    const avgParticipantTime =
      participantTimes.reduce((a, b) => a + b, 0) / participantTimes.length;
    const maxParticipantTime = Math.max(...participantTimes);
    const minParticipantTime = Math.min(...participantTimes);
    const slowParticipantRequests = participantTimes.filter(
      (t) => t > CONFIG.MAX_RESPONSE_TIME_MS,
    ).length;

    console.log(`  • Average Response Time: ${avgParticipantTime.toFixed(2)}ms`);
    console.log(`  • Min Response Time: ${minParticipantTime.toFixed(2)}ms`);
    console.log(`  • Max Response Time: ${maxParticipantTime.toFixed(2)}ms`);
    console.log(
      `  • Requests > ${CONFIG.MAX_RESPONSE_TIME_MS}ms: ${slowParticipantRequests} (${((slowParticipantRequests / participantCreationResults.length) * 100).toFixed(1)}%)`,
    );
  }

  // Answer Submission Stats
  console.log(`\n${COLORS.BOLD}Answer Submission:${COLORS.RESET}`);
  console.log(
    `  • Success Rate: ${answerSubmissionResults.length}/${CONFIG.NUM_USERS} (${((answerSubmissionResults.length / CONFIG.NUM_USERS) * 100).toFixed(1)}%)`,
  );

  if (answerSubmissionResults.length > 0) {
    const answerTimes = answerSubmissionResults.map((r) => r.answerSubmission!.responseTime);
    const avgAnswerTime = answerTimes.reduce((a, b) => a + b, 0) / answerTimes.length;
    const maxAnswerTime = Math.max(...answerTimes);
    const minAnswerTime = Math.min(...answerTimes);
    const slowAnswerRequests = answerTimes.filter((t) => t > CONFIG.MAX_RESPONSE_TIME_MS).length;

    console.log(`  • Average Response Time: ${avgAnswerTime.toFixed(2)}ms`);
    console.log(`  • Min Response Time: ${minAnswerTime.toFixed(2)}ms`);
    console.log(`  • Max Response Time: ${maxAnswerTime.toFixed(2)}ms`);
    console.log(
      `  • Requests > ${CONFIG.MAX_RESPONSE_TIME_MS}ms: ${slowAnswerRequests} (${((slowAnswerRequests / answerSubmissionResults.length) * 100).toFixed(1)}%)`,
    );
  }

  // Overall Stats
  const fullSuccessResults = results.filter(
    (r) => r.participantCreation?.success && r.answerSubmission?.success,
  );
  console.log(`\n${COLORS.BOLD}Overall:${COLORS.RESET}`);
  console.log(
    `  • Complete Success Rate: ${fullSuccessResults.length}/${CONFIG.NUM_USERS} (${((fullSuccessResults.length / CONFIG.NUM_USERS) * 100).toFixed(1)}%)`,
  );

  if (fullSuccessResults.length > 0) {
    const totalTimes = fullSuccessResults.map((r) => r.totalTime);
    const avgTotalTime = totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length;
    console.log(`  • Average Total Time per User: ${avgTotalTime.toFixed(2)}ms`);
  }

  // Performance Assessment
  const allResponseTimes = [
    ...participantCreationResults.map((r) => r.participantCreation!.responseTime),
    ...answerSubmissionResults.map((r) => r.answerSubmission!.responseTime),
  ];
  const slowRequests = allResponseTimes.filter((t) => t > CONFIG.MAX_RESPONSE_TIME_MS).length;
  const totalRequests = allResponseTimes.length;

  console.log(`\n${COLORS.BOLD}Performance Assessment:${COLORS.RESET}`);
  if (slowRequests === 0) {
    console.log(
      `  ${COLORS.GREEN}✓ All requests completed within ${CONFIG.MAX_RESPONSE_TIME_MS}ms threshold${COLORS.RESET}`,
    );
  } else {
    console.log(
      `  ${COLORS.RED}✗ ${slowRequests}/${totalRequests} requests exceeded ${CONFIG.MAX_RESPONSE_TIME_MS}ms threshold (${((slowRequests / totalRequests) * 100).toFixed(1)}%)${COLORS.RESET}`,
    );
  }

  if (fullSuccessResults.length === CONFIG.NUM_USERS) {
    console.log(
      `  ${COLORS.GREEN}✓ All ${CONFIG.NUM_USERS} users completed successfully${COLORS.RESET}`,
    );
  } else {
    console.log(
      `  ${COLORS.RED}✗ ${CONFIG.NUM_USERS - fullSuccessResults.length} users failed to complete${COLORS.RESET}`,
    );
  }

  // Failed Requests Details
  const failedResults = results.filter(
    (r) => !r.participantCreation?.success || !r.answerSubmission?.success,
  );
  if (failedResults.length > 0) {
    console.log(`\n${COLORS.BOLD}Failed Requests:${COLORS.RESET}`);
    failedResults.forEach((result) => {
      if (!result.participantCreation?.success) {
        console.log(
          `  ${COLORS.RED}User ${result.userId} (${result.nickname}): Participant creation failed - ${result.participantCreation?.error}${COLORS.RESET}`,
        );
      }
      if (!result.answerSubmission?.success) {
        console.log(
          `  ${COLORS.RED}User ${result.userId} (${result.nickname}): Answer submission failed - ${result.answerSubmission?.error}${COLORS.RESET}`,
        );
      }
    });
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.log(`${COLORS.BOLD}${COLORS.GREEN}Starting MindRush Load Test${COLORS.RESET}`);
  console.log(`${COLORS.BOLD}Simulating ${CONFIG.NUM_USERS} concurrent users...${COLORS.RESET}\n`);

  // Validate configuration
  if (CONFIG.ALTERNATIVE_ID === "replace-with-actual-alternative-id") {
    console.log(
      `${COLORS.RED}${COLORS.BOLD}ERROR: Please replace CONFIG.ALTERNATIVE_ID with a valid UUID${COLORS.RESET}`,
    );
    process.exit(1);
  }

  const startTime = performance.now();

  // Create array of user simulation promises
  const userPromises = Array.from({ length: CONFIG.NUM_USERS }, (_, index) =>
    simulateUser(index + 1),
  );

  try {
    // Execute all user simulations concurrently
    console.log(
      `${COLORS.YELLOW}Executing ${CONFIG.NUM_USERS} concurrent user simulations...${COLORS.RESET}\n`,
    );
    const results = await Promise.all(userPromises);

    const endTime = performance.now();
    const totalTestTime = endTime - startTime;

    console.log(
      `\n${COLORS.GREEN}Load test completed in ${totalTestTime.toFixed(2)}ms${COLORS.RESET}`,
    );

    // Generate and display report
    generateReport(results);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`${COLORS.RED}Load test failed: ${errorMessage}${COLORS.RESET}`);
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.length > 2) {
  const matchId = process.argv[2];
  if (matchId) {
    CONFIG.MATCH_ID = matchId;
    console.log(`${COLORS.BLUE}Using Match ID from command line: ${matchId}${COLORS.RESET}`);
  }
}

if (process.argv.length > 3) {
  const alternativeId = process.argv[3];
  if (alternativeId) {
    CONFIG.ALTERNATIVE_ID = alternativeId;
    console.log(
      `${COLORS.BLUE}Using Alternative ID from command line: ${alternativeId}${COLORS.RESET}`,
    );
  }
}

// Print usage information
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`${COLORS.BOLD}MindRush Load Testing Script${COLORS.RESET}`);
  console.log("");
  console.log("Usage:");
  console.log(
    "  npx ts-node src/__tests__/performance/quiz-answer-load.ts [matchId] [alternativeId]",
  );
  console.log("  npm run test:load [matchId] [alternativeId]");
  console.log("");
  console.log("Examples:");
  console.log(
    "  npx ts-node src/__tests__/performance/quiz-answer-load.ts 688638 abc123-def456-ghi789",
  );
  console.log("  npm run test:load 688638 abc123-def456-ghi789");
  console.log("");
  console.log("Options:");
  console.log("  -h, --help    Show this help message");
  console.log("");
  console.log("Configuration:");
  console.log(`  • Users: ${CONFIG.NUM_USERS}`);
  console.log(`  • Max Response Time: ${CONFIG.MAX_RESPONSE_TIME_MS}ms`);
  console.log(`  • Wait Time: ${CONFIG.WAIT_TIME_MS}ms`);
  process.exit(0);
}

// Run the load test
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`${COLORS.RED}Unhandled error: ${errorMessage}${COLORS.RESET}`);
    process.exit(1);
  });
}
