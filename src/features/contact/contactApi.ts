/**
 * Re-exports chat contact helpers under the contact feature namespace.
 */

/**
 * Starts or resumes a conversation with the driver attached to a trip.
 *
 * @param tripId Identifier of the trip whose driver should be contacted.
 * @param payload Contact form payload used to seed the conversation.
 * @returns The normalized conversation resulting from the contact request.
 */
export { contactDriver } from "../chat/chatApi";

/**
 * Starts or resumes a conversation with a passenger attached to one of the user's trips.
 *
 * @param tripId Identifier of the trip linked to the conversation.
 * @param personId Identifier of the passenger to contact.
 * @param payload Contact form payload used to seed the conversation.
 * @returns The normalized conversation resulting from the contact request.
 */
export { contactPassenger } from "../chat/chatApi";
