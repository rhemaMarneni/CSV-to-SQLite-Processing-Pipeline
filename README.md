# CSV to SQLite Processing Pipeline

A data downloading and processing pipeline. Downloads a large `.tar.gz` file, containing lists of organizations and customers, decompresses and unzips the CSVs within, parses them, and add them to a SQLite database.

Starter file: <https://fiber-challenges.s3.amazonaws.com/dump.tar.gz>.<br>
Courtesy: FiberAI

Output directory: out/ (created automatically by code)
Input files are downloaded into: tmp/ (created automatically by code)
`.gitignore` will ignore the `out/` and `tmp/` folders

Feel free to optimize the stream processing, I'd love to discuss any contributions toward a faster processing pipeline

## Tools

- TypeScript (version 5 or greater)
- Node.js's Streams API -> multi-gigabyte files can't be processed without the efficiency of streams.
- `knex` to set up a SQLite database at `out/database.sqlite` (version 2.5 or greater)
- Node (version 18 or greater)

## Node.js modules to refer

- `fs`
- `fs-extra`
- `http`
- `https`
- `zlib`
- `tar`
- `fast-csv`
- `knex`
- `sqlite3` (version 5 or greater)

## To view your SQLite database

You can use [this free web app](https://sqliteviewer.app/) or [download this open-source desktop app](https://github.com/sqlitebrowser/sqlitebrowser). On Mac, you can install the latter with:

```sh
brew install --cask db-browser-for-sqlite
```

## SQLite Database

- The code performs SQL table management (including defining columns) automatically; you should _not_ have to go into a SQLite browser or the command-line to do any configuration.
- SQL tables have a unique, auto-incrementing primary key columns called `id`.
- All your columns are non-nullable.

## Getting started

To get started, run these:

```sh
npm install
npm install --global tsx
```

## Running the code

To run your code, do:

```sh
tsx runner.ts
```

Since the input file is quite large, allow few minutes for the pipeline to finish processing
Feel free to make other `.ts` files for testing purposes; you can run them all with `tsx`.
You can also run `npx tsc` to ensure your code passes all the TypeScript compiler's checks.
