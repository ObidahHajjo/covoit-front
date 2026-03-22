/**
 * Contact form payload types used to open chat conversations.
 */

/** Payload used to initiate contact through chat. */
export interface ContactPayload  {
    subject: string;
    message: string;
}
