# Nodes
The Nodes directory is for large, self-contained modules within a single location that would otherwise have their files scattered about the code base. The goal of Nodes/ is to make the codebase cleaner and collect functionality that is limited to a single scope (such as actor sheets) to be collected into a single directory. 

## Consistency Guidelines
1. Each node should have it's own directory and only that directory. If a node grows complex enough, it should have individual subdirectories, such as splitting up the map rendering
2. Each node should have an index file in it's root that contains all of the exports needed for other portions of the site to use it.
