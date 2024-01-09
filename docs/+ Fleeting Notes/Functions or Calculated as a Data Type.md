We should be able to have a function or expression as a data type within a Content or Actor. These functions would be in their own "calculated" sub-object, distinct from the "data" sub-object. They would be stored as strings but allow for the calculation of a value based on other values. 

A classic example: modifiers. In 5e, a modifier is calculated by $floor((score - 10) / 2)$. This could be one way of generating a characters modifiers, rather than doing it by hand within the character sheet. 

How this might look in an actor object:

```typescript
{
	data: {
		strengthScore: "13",
	},
	calculated: {
		strengthMod: "Math.floor(((+this.data.strengthScore || 10) - 10) / 2)"
	}
}
```

Then when the strength score changes, we can update the calculated value using the same WebWorker as before. 

Further, this lets us do more complex calculations. In the case of something like a Backpack Actor, we can calculate the total weight based on the items in its inventory. Within a character, we can calculate bonuses to the user's strength modifier or score from items and apply those automatically. 

The "calculated" field can be more complex. Since the value there is unchanging, we can determine when it's saved what fields it needs to access and pay attention to, as well as storing the last calculated value so that we don't need to recalculate every time the Actor or Content is rendered. 

---

2024-01-09

We write this down because Laura was fleshing out the [[ActorType can extend ContentType]] and while thinking about Bags of Holding and other inventory items, was thinking about how to determine the weight of 