# Dynamic Data Keys and Values

Data `key` supports nested object and array accessor syntax for both content and actors. Values should support actor and content refs/links, undecided between ref/or link as the keyword, and undecided on using `function()` notation or `type:` notation.

**Example**:

```typescript
actor.data = {
  name: "Waals O'Caera",
  "level[0]": "12",
  "className[0]": "Wizard",
  "level[1]": "3",
  "className[1]": "Fighter",
  "stats.attributes.strength": "14",
  "relationships.wife": "refActor:6b51ad67-7fbc-42e5-8cde-3b0845339fbb",
  "relationships.wife2": "linkActor('6b51ad67-7fbc-42e5-8cde-3b0845339fbb')",
};
```

They will be converted to nested objects for the web worker and in certain API responses.
**Example**:

```typescript
actor.data = {
  name: "Waals O'Caera",
  level: ["12", "3"],
  className: ["Wizard", "Fighter"],
  stats: {
    attributes: {
      strength: "14",
    },
  },
};
```

For content only, `instance` is a reserved top level keyword used for values that only exist on instances of the content in an actors content JSON field. They can be static strings or expressions. An example of a useful instance expression is the function `refFromTemplate()` which by default generates an actor from the `content.actor_template` and then links it in an instance field.
Example:

```typescript
content.data = {
  name: "Backpack",
  "instance.inventory": "refFromTemplate()",
};

actor.content.inventory.list[0].data = {
  name: "Backpack",
  inventory: "refActor('be74c177-4c1e-44b1-8e7a-a6f0fe3a6d8b')",
};
```
