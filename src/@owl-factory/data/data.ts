import { Packet } from "@owl-factory/data/types";
import { Ref64 } from "@owl-factory/types";
import { ReloadPolicy } from "./enums";
import { mergePackets } from "./helpers/caching";
import { canLoad } from "./helpers/loading";

export class DataController<T extends Record<string, unknown>> {
  public data: Record<string, Packet<T>> = {};

  public staleTime: number;

  constructor(staleTime: number) {
    this.staleTime = staleTime;
  }

  /**
   * Finds and returns a packet, if it exists
   * @param ref The reference to a stored packet
   * @returns The found packet or undefined
   */
  public get(ref: Ref64): Packet<T> | undefined {
    if (ref in this.data) { return this.data[ref]; }
    return undefined;
  }

  /**
   * Finds and returns many packets from a collection of refs
   * @param refs A list of references to packets to find
   * @returns An array of packets
   */
  public getMany(refs: Ref64[]): Packet<T>[] {
    const packets: Packet<T>[] = [];
    for (const ref of refs) {
      const packet = this.get(ref);
      if (packet !== undefined) { packets.push(packet); }
    }
    return packets;
  }

  /**
   * Sets the given packet in the data manager. Merges with the previous packet
   * @param packet The packet to merge and save to the data manager
   * @returns The newly saved packet
   */
  public set(packet: Packet<T>): Packet<T> {
    if (packet.ref === undefined) { throw `Invalid packet`; }
    let targetPacket = packet;
    const existingPacket = this.get(packet.ref);

    // Merge packet
    // TODO - handle different set times, similar to load
    if (existingPacket !== undefined) { targetPacket = mergePackets(targetPacket, existingPacket) as Packet<T>; }
    this.data[packet.ref] = targetPacket;

    return targetPacket;
  }

  /**
   * Sets many packets in the local data
   * @param packets The list of packets to the set in the data
   * @returns An array of the updated packets
   */
  public setMany(packets: Packet<T>[]): Packet<T>[] {
    const updatedPackets: Packet<T>[] = [];
    for (const packet of packets) { updatedPackets.push(this.set(packet)); }
    return updatedPackets;
  }

  /**
   * Loads one or many documents from the given refs
   * @param targetRefs The refs to load in from the database
   * @param reloadPolicy The policy for reloading the document if it is already present
   * @param loadDocuments A function to fetch the documents from the database
   */
  public async load(
    refs: string | string[],
    reloadPolicy: ReloadPolicy,
    loadDocuments: (refs: Ref64[]) => Promise<T[]>
  ): Promise<T[]> {
    const loadRefs: string[] = [];

    for (const ref of refs) {
      if (ref === undefined || ref === "undefined" || ref === "") { continue; }

      const packet = this.data[ref];
      if (packet === undefined) {
        loadRefs.push(ref);
        continue;
      }
      if (canLoad(packet, reloadPolicy, this.staleTime)) { loadRefs.push(ref); }
    }

    try {
      const docs = await loadDocuments(loadRefs);
      return docs;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  /**
   * Clears all data from the manager
   */
  public clear(): void {
    this.data = {};
  }

  /**
   * Removes a single document from the data stores
   * @param ref The ref of the packet to remove
   * @returns The removed packet
   */
  public remove(ref: Ref64): Packet<T> | undefined {
    const packet = this.data[ref];
    delete this.data[ref];
    return packet;
  }

  /**
   * Gets all data from the DataController
   */
  public getAll() {
    return this.data;
  }

  /**
   * Gets all refs for data in the DataController
   */
  public getRefs() {
    return Object.keys(this.data);
  }
}

