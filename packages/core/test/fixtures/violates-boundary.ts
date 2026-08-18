// @ts-nocheck — this file exists to be REJECTED by the boundary lint rule.
// boundary.test.ts lints it and asserts the failures; it is excluded from
// tsconfig and globally ignored by `npm run lint`.
import next from "next";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { something } from "../../../adapters/wikisyllabus/src/index.ts";

export const proofOfViolation = { next, Anthropic, readFileSync, something };
