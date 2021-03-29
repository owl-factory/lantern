export function onUpdate(myUserID: string) {
  return {
    updatedBy: myUserID,
    updatedAt: new Date(),
  };
}

export function onCreate(myUserID: string) {
  return {
    ownedBy: myUserID,
    createdAt: new Date(),
    createdBy: myUserID,
    ...onUpdate(myUserID),
  };
}
