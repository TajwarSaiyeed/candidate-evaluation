import { Database } from "./lib/supabase/database.types";

export type Application = Database["public"]["Tables"]["applications"]["Row"];
