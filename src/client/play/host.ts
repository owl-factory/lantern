import { DispatchEvent, HostPriorityQueue } from "types";
import { GameServer } from "./GameServer";

/**
 * Adds an item to the host queue in it's desired priority
 * @param newHostItem The new item to add to the host queue
 */
export function addToHostQueue(this: GameServer, newHostItem: HostPriorityQueue): void {
  this.removeFromHostQueue(newHostItem.peerID, false);

  // Handles the only item in the thing
  if (this.hostQueue.length === 0) {
    this.hostQueue.push(newHostItem);
    this.recalculateHost();
    return;
  }

  // Adds the new host at the top of the queue by default
  // TODO - should we remove this?
  if (newHostItem.isHost === true) {
    this.hostQueue.splice(0, 0, newHostItem);
    this.recalculateHost();
    return;
  }

  this.hostQueue.forEach((hostItem: HostPriorityQueue, index: number) => {
    if (newHostItem.priority > hostItem.priority) {
    this.hostQueue.splice(index - 1, 0, hostItem);
      this.recalculateHost();
      return;
    }
  });

  this.hostQueue.push(newHostItem);
  this.recalculateHost();
}

/**
 * The actions to run when assuming the role of host for the game server
 */
export function assumeHost(this: GameServer): void {
  this.log(`Look at me. I'm the host now`);
  this.socket.emit(`assume-host`, this.campaignID, this.peer.id);
  this.host = this.peer.id;
  // Delete previous host queue
  this.calculateHostPriority();
  this.dispatch({ event: DispatchEvent.PushHostQueue, content: this.hostPriority });
}

/**
 * Calculates this current user's priority as host for quick adding to the PQueue
 * This only needs to be done once as all information regarding their priority
 * is static, unless such an event occurs as to require the recalculation of the host
 * priority, such as in the case of someone being elevated to GM or being manually set
 */
export function calculateHostPriority(this: GameServer): void {
  this.hostPriority = {
    peerID: this.peer.id,
    priority: 1,
    isHost: this.host === this.peer.id,
  };
}

/**
 * Rechecks if we need a new host. If this user is the new host, assume
 * the host position
 */
export function recalculateHost(this: GameServer): void {
  const topQueue = this.hostQueue[0];
  if (topQueue.isHost === true) { return; }
  if (topQueue.peerID === this.peer.id) {
    this.assumeHost();
  }
}

/**
 * Removes a specific user from the host queue
 * @param peerID The id of the user to remove from the host queue
 */
export function removeFromHostQueue(this: GameServer, peerID: string, recalculate?: boolean): void {
  this.hostQueue.forEach((hostItem: HostPriorityQueue, index: number) => {
    if(hostItem.peerID === peerID) {
      this.hostQueue.splice(index, 1);
    }
  });

  if (recalculate) { this.recalculateHost(); }
}
