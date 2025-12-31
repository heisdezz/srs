import type { TypedPocketBase } from "pocketbase-types";
import PocketBase from "pocketbase";
import { PocketBaseTS } from "pocketbase-ts";
const url = import.meta.env.VITE_API_URL;
export let pb = new PocketBaseTS(url) as TypedPocketBase;
