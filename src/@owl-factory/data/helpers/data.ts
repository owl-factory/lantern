import { CrudPacket } from "@owl-factory/types/object";

/**
 * Loops through a list of API response packets and compiles the successful ones
 * @param packets The packets from the API response
 * @returns An array of documents from the successful packets
 */
export function getSuccessfulDocuments<T>(packets: CrudPacket<T>[]): T[] {
  const docs: T[] = [];
  for (const packet of packets) {
    if (packet.success && packet.doc) { docs.push(packet.doc); }
  }
  return docs;
}
