import { GenericId } from "convex/values";
import { DataModel } from "../../convex/_generated/dataModel";

export type Doc<T extends keyof DataModel> = DataModel[T]["document"];
export type Id<T extends keyof DataModel> = GenericId<T>;
