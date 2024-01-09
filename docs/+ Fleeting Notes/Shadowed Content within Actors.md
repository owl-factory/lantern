Shadowed Content is the idea that an Actor can contain a thing that itself has Content; this Content is then reflected in the Actor content without needing extra work. 

For example, suppose that I have a Longsword. This Longsword is an Item ContentType, and has a name, weight, description, and so on. However, because it is a weapon, it also has Content of ContentType Attack within it -- both a one-handed and two-handed attack. These attacks should be visible within the Character's attack content. Usable like normal attacks, but intrinsically linked to the Longsword. 

Going further on this, the same can also apply to Actors (see [[ActorType can extend ContentType]]). A Spellbook Actor containing some spells can be held in one's inventory, and those spells can be shadowed to the holding character's spells. When the spellbook is removed from the inventory, so too will the spells. 

---

2024-01-09

We write this down because Laura was fleshing out the idea of [[ActorType can extend ContentType]] and was thinking about how opening up a new Actor sheet to cast a spell or grab an object would be a pain in the butt, especially if the page the user was on didn't necessarily support such a thing. 