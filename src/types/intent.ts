/**
 * Represents a processed user intent with its execution details
 * @interface Intent
 */
export interface Intent {
  /**
   * Unique identifier for the intent
   * @example "intent-1234567890"
   */
  id: string;

  /**
   * The main action to be performed
   * @example "book_flight" or "send_email"
   */
  action: string;

  /**
   * Detailed description of what the intent aims to accomplish
   * @example "Book a round-trip flight from NYC to LA"
   */
  description: string;

  /**
   * Optional parameters required to execute the intent
   * @example {
   *   "departure": "NYC",
   *   "destination": "LA",
   *   "dates": { "departure": "2024-04-01", "return": "2024-04-07" }
   * }
   */
  parameters?: Record<string, unknown>;

  /**
   * The result of executing this intent, if available
   */
  result?: IntentExecutionResult;
}

/**
 * Represents the result of executing an intent
 * @interface IntentExecutionResult
 */
export interface IntentExecutionResult {
  /**
   * The current status of the intent execution
   * @example "completed" for successful execution
   * @example "failed" when execution encounters an error
   * @example "pending" while execution is in progress
   */
  status: 'completed' | 'failed' | 'pending';

  /**
   * The actual result data from the execution
   * The structure depends on the type of intent executed
   */
  result: unknown;

  /**
   * Error message if the execution failed
   * Only present when status is 'failed'
   */
  error?: string;

  /**
   * Additional metadata about the execution
   * @example {
   *   "executionTime": "1.2s",
   *   "resourcesUsed": ["flight-api", "payment-api"]
   * }
   */
  metadata?: Record<string, unknown>;
} 