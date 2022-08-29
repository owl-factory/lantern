# Web Workers
Web Workers can be used for multi-threading Javascript or running sandboxed user-generated code in a safe manner. This allows for hefty Javascript that would otherwise take a non-insubstantial amount of time to run within gumming up the webpage. For example, Reroll's sheet parsing can be run inside of a web worker, as it may take a variable amount of time to run. 

Web Workers can also be used to safely run sandboxed code supplied by users. 