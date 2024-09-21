import { CeramicDocument, DIDAny } from "@useorbis/db-sdk";
import contexts from "./contexts";
import models from "./models";

export type Models = typeof models;

export type ModelName = keyof Models;

export type ModelId = Models[ModelName]["id"];

export type Contexts = typeof contexts;

export type ContextValue = Contexts[keyof Contexts];

export type OrbisDBRow<T extends Record<string, any>> = {
	controller: DIDAny | string;
	indexed_at: string;
	stream_id: string;
	// TODO: add plugins_data and _metadata_context type
} & T;

export type ColumnName<T extends Record<string, any>> =
	| Extract<keyof OrbisDBRow<T>, string>
	| string;

export type OrbisDBFields =
	| "controller"
	| "indexed_at"
	| "stream_id"
	| "_metadata_context"
	| "plugins_data";

export type GenericCeramicDocument<T extends Record<string, any>> = Omit<
	CeramicDocument,
	"content"
> & { content: T };
