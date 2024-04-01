# Client-Side Environment Variables

Environment variables that start with `NEXT_PIBLIC_` will be added to the client-side bundle **at build time**, including the `DEPLOY_URL` environment variable that is converted to `NEXT_PIBLIC_BASE_URL`. This means that builds intended for one deployment URL are not portable to other deployment URLs at this time. We may way to find a better way of implementing a BASE_URL variable across client bundle and the server in the future.
