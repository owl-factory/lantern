# Laura's Initial Idea
```typescript
type Actor = {
	// Contains all simple fields for an actor
	data: { name: string } & Record<string, string>;
	content: Record<string, ActorContent[]>;
}

type ActorContent = {
	_key: string; // A unique ID for looping purposes. Used for React keys
	contentTypeId: string;
	contentId?: string; // If created from a pre-existing piece of content
	data: Record<string, string>;
}

const actor: Actor = {
	data: {
		name: "Waals O'Caera",
		level1: "12",
		class1: "Wizard",
		subclass1: "Bladesinger",
		level2: "3",
		class2: "Fighter",
		subclass2: "Eldritch Knight",
	},
	content: {
		spells0: [
			{
				_key: "...",
				contentTypeId: "...", // Links to spells
				contentId: "...", // Links to the OG Firebolt content in the DB
				data: {
					name: "Firebolt",
					damage: "1d8",
					damageType: "Fire"
				}
			}
		],
		inventory: [
			{
				_key: "...",
				contentTypeId: "...", // Links to inventory items
				contentId: undefined, // Homebrew content
				data: {
					name: "Teardrop",
					weight: "2",
					description: "A really cool magic sword!"
				}
			},
			{
				_key: "...",
				actorId: "...",
				data: {
					name: "Backpack",
				}
			}
		]
	}
}
```

This layout is based on the core idea that we have a consistent data format. We don't need to check if something is a string or an object or what have you, because it's all strings. Because everything is a string, we don't have to worry about type checking -- is this an object, or if this is true or false, or if we can save this data here. 

**Assumption 1**: any single value being read or assigned is a string. This solves the problem of needing to do checks or conversions. 

**Assumption 2**: The keys of data and content can be freely expanded or removed. While we can say "a Pathfinder character has these fields" with an ActorType definition, this format would allow those to safely not be present (useful if ActorType is expanded or changed down the line) as well as giving users the freedom to create custom values within their own games. 

**Lucy's Concerns**
How to distinguish this comes from actor type, or if this comes from a user. 




---

2024-01-08.

We wrote up these notes because Lucy and Laura were discussing different ways we can represent the shape of custom data within the Actor. 