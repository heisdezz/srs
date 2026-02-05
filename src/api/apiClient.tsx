import type { TypedPocketBase } from "pocketbase-types";
import { PocketBaseTS } from "pocketbase-ts";
const url = import.meta.env.VITE_API_URL;
const local_url = "http://127.0.0.1:8090/";
export let pb = new PocketBaseTS(url) as Partial<TypedPocketBase>;
