interface Timestamped {
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export function UpdateTimestamp(rowUpdate: Timestamped) {
  rowUpdate.updatedAt = Now();
  return rowUpdate;
}

export function Now(): Date {
  return new Date(Date.now());
}
