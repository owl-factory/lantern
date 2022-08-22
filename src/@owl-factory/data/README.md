# Data
The Data module contains functionality for storing and managing data, allowing for storing and accessing data in a neat manner without needing to repeat calls to the database

## Dependencies
- @owl-factory/cache. Used for caching function calls
- @owl-factory/database. **Deprecated**. Used for FaunaIndexOptions in controllers/functionality/crud, but should be removed
- @owl-factory/storage. Used to store data to the Local Storage on the frontend for minimizing database calls after a reload or opening a new page
- @owl-factory/utilities
- @owl-factory/types
- mobx. Used for data state management

## TODOs
- [ ] Remove references to @owl-factory/database