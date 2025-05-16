# CV Next TypeScript Conventions Guide

This guide will explain which conventions should be used when contributing to our TypeScript project.

> [!NOTE]
> Most of these points are taken from [here](https://google.github.io/styleguide/tsguide.html) or [here](https://nextjs.org/docs/app/getting-started) and that this is just a quick summary of the important things.

It is recommended that you read both of these to know more about what we are working with in this project.

# Style Guide

## Imports and Exports

1. In general, imports should always be absolute(use `@`) unless the import is done from a sibling module.
   - This is covered by eslint.
2. Imports should be ordered like this:
   1. builtin
   2. external
   3. internal
   4. parent
   5. sibling
   6. index
   - This is covered by eslint.
3. Try to avoid `export default`.

## Naming Conventions

### General Rules

1. Use descriptive names and without **ambiguous** abbreviations.
2. Abbreviations should be treated as `lowerCamelCase`.
   - Use `loadHttpUrl` and not `loadHTTPURL` or `loadHTTPUrl`.

### Identifier Specific Rules

_This section is covered by eslint._

- `PascalCase` should be used for class, interface, type, enum, decorator, type parameters, and component functions.
- `camelCase` should be used for variable, parameter, function, method, property, file names, and module alias.
- `CONSTANT_CASE` should be used for global constant values and enum values.
- While importing, module namespaces(`as`) should use `camelCase` while the relevant files should be `snake_case`.

## Documentation

### General Rules

- Use `/**  */` comments for documentation, i.e. comments a user of the code should read like before a function declaration.
- Use `//` for implementation comments, i.e. comments that only concern the implementation of the code itself like in the middle of a function.
- Only add actually relevant documentation and comments.

### Functions

_This section is covered by eslint._

Using `/** */` usually autocomplets the other main things for you. \
For example, a function that is declared like this:

```ts
export async function getCommentById(
  commentId: string
): Promise<Result<CommentModel, string>>;
```

The documentation should be something like this:

```ts
/**
 * Retrieves comment using specific comment id
 *
 * @param {string} commentId - The comment of the specific ID
 * @return {Promise<Result<CommentModel, string>>} A Promise that resolves to a
 *       Result object containing the retrieved comment or an error message.
 */
```

Notice several important things:

1. The docstring must include a quick brief of the function.
2. The docstring must include the function's arguments as anotated above(with `@param`), and the same goes for the return(with `@return`), each in his own line.
   - Specifing types is optional.
3. The lines can be wrapped if needed.
4. The function declaration must include types.

### Classes

Classes should be documented above their declaration and include the general purpose of the class.

If the class attributes are set using the `constructor`, they can be documented there with the `@param` tag. \
If an attribute isn't set there, it needs to be documented one line above it with `/** */`.

### Function Calls

If the functions you are calling use ambiguous parameters, or the function's name doesn't really explain what it should get, add the parameter's name as a comment before the value like this:

```ts
setupSupabase(SUPABASE_URL, /* useAnon= */ true, /* schema= */ "public");
```

Note that there are some extensions that already do that.

# Files and Folders Structure

## File Directives

NextJS treats everything as a server component by default, so add these when needed:

- `use client` - in client components.
- `use server` - in server components and actions.
- `import server-only` - in places that can only bbe imported by server components.

## Folders Organization

> [!NOTE]
> This is the ideal configuration but we aren't fully there yet.

### Top Level

- `app` - App Router's main folder.
- `public` - Any public static asset.
- `components` - General components that can be used in several places.
- `lib` - General utility functions.
- `server` - Non API routes or server actions, backend related functions. Functions from there are used as to centralize communications with Supabase and are the used from server actions and API routes.
- `types` - Project wide used types that we generate for TypeScript.

#### App Folder

Mainly contains the routed paths of the website.

##### API Routes vs Server Actions

API routes(under `api`) are used to expose functionality to entities outside the website or to allow ignoring certain aspects. These run on the server.

Server Actions(under `actions`) are actual functions(callable from the client without a fetch) that run on the server and can only be used in the code. This folder should start with `_` to not mess with routing.

It is recommended to use server actions as they are considered more stable and secure.

- Both should separated based on what they do(i.e. what do they affect? Users? Comments? CVs?).
- Both should mostly get data from the top level `server` folder, work on it, and then update accordingly using functions from the `server folder`.
- Server related things should return the status with the `Result` type or the `NextResponse` type - based on if API is used or not.

##### Routed Folders

Folders that contain data that is rendered(i.e. `feed`, `hall`, `profile`, etc.).

Apart from the `page.tsx` that is rendered, you should also create an inner `components` directory for page specific components. If there are too many, you can also separate them to categories.

As a recommendation, start the page as a server component and work your way down with smaller components.

##### Hooks and Providers

As the names suggests, in these folders will be the relevant react features. Custom hooks in the `hooks` folder and context providers in the `providers` folder.

Both of these should start with `_` to not mess with routing.
