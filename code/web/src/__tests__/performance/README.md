# MindRush Load Testing

This directory contains the load testing script for the MindRush quiz application.

## Overview

The load testing script simulates 60 concurrent users performing the following actions:

1. **Join a match** - Create a participant with a random nickname
2. **Wait 10 seconds** - Simulate realistic user behavior
3. **Submit an answer** - Answer a question with a specific alternative ID

## Requirements

- Response times must stay below 500ms for all requests
- All 60 users must complete successfully
- Test validates both participant creation and answer submission endpoints

## Usage

### Basic Usage

```bash
npm run test:load [matchId] [alternativeId]
```

### Examples

```bash
# Test with specific match and alternative IDs
npm run test:load 688638 abc123-def456-ghi789

# Run directly with ts-node
npx ts-node src/__tests__/performance/quiz-answer-load.ts 688638 abc123-def456-ghi789

# Show help
npm run test:load -- --help
```

### Prerequisites

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Create a match** through the web interface or API

3. **Get the alternative ID** from a question in the match

## Test Configuration

The script is configured with the following parameters:

- **Users**: 60 concurrent users
- **Max Response Time**: 500ms threshold
- **Wait Time**: 10 seconds between participant creation and answer submission
- **Server URL**: http://localhost:3000

## API Endpoints Tested

### 1. Participant Creation

- **Endpoint**: `POST /api/matches/{matchId}/participants`
- **Payload**: `{ nickname: string }`
- **Response**: `{ token: string, participant: object }`

### 2. Answer Submission

- **Endpoint**: `POST /api/matches/answers`
- **Headers**: `Authorization: Bearer {token}`
- **Payload**: `{ alternativeId: string }`

## Performance Metrics

The script provides detailed reporting on:

- **Success rates** for each endpoint
- **Response times** (average, min, max)
- **Performance assessment** against the 500ms threshold
- **Failed request details** with error messages

## Sample Output

```
Starting MindRush Load Test
Simulating 60 concurrent users...

User 1: Creating participant with nickname "FastTiger123"
User 2: Creating participant with nickname "SmartEagle456"
...

=== LOAD TEST REPORT ===
Test Configuration:
  • Users: 60
  • Match ID: 688638
  • Alternative ID: abc123-def456-ghi789
  • Max Response Time: 500ms
  • Wait Time: 10000ms

Participant Creation:
  • Success Rate: 60/60 (100.0%)
  • Average Response Time: 45.32ms
  • Min Response Time: 12.45ms
  • Max Response Time: 89.12ms
  • Requests > 500ms: 0 (0.0%)

Answer Submission:
  • Success Rate: 60/60 (100.0%)
  • Average Response Time: 38.76ms
  • Min Response Time: 15.23ms
  • Max Response Time: 76.54ms
  • Requests > 500ms: 0 (0.0%)

Performance Assessment:
  ✓ All requests completed within 500ms threshold
  ✓ All 60 users completed successfully
```

## Troubleshooting

### Common Issues

1. **Alternative ID Error**: Make sure to replace the default alternative ID with a valid UUID from your test match
2. **Connection Refused**: Ensure the development server is running on localhost:3000
3. **401 Unauthorized**: Check that the participant creation is working and tokens are being returned correctly

### Getting Valid IDs

To get valid IDs for testing:

1. Create a match through the web interface
2. Note the match ID from the URL or database
3. Add questions to the match
4. Get the alternative ID from the database or by inspecting API responses

## Integration with CI/CD

This script can be integrated into your CI/CD pipeline to ensure performance regressions are caught early:

```bash
# Run load test as part of your test suite
npm run test:load $MATCH_ID $ALTERNATIVE_ID
```

## File Structure

```
src/__tests__/performance/
├── quiz-answer-load.ts    # Main load testing script
└── README.md             # This documentation
```

## Dependencies

The script uses only Node.js built-in modules:

- `http` - For making HTTP requests
- `perf_hooks` - For performance timing
- `process` - For command line arguments and exit codes

No external dependencies required beyond TypeScript compilation.
