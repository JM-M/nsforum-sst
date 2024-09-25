import { OrbisDB } from "@useorbis/db-sdk";
import { catchError } from "@useorbis/db-sdk/util";
import { isNil } from "lodash-es";
import { Resource } from "sst";
import config from "./config";
import models from "./models";
import { ColumnName, ModelName, Models, OrbisDBRow } from "./types";

const orbisdb = new OrbisDB(config);

export module Orbis {
  type FetchRowsArg<T extends Record<string, any>> = {
    select?: (ColumnName<T> | any)[];
    model: ModelName;
    where?: Partial<Record<ColumnName<T>, any>>;
    limit?: number;
    offset?: number;
    orderBy?: [ColumnName<T>, "asc" | "desc"][];
  };
  export async function fetchRows<T extends Record<string, any>>({
    select = [],
    model,
    where,
    limit,
    offset,
    orderBy,
  }: FetchRowsArg<T>) {
    let statement = orbisdb.select(...select).from(models[model].id);
    if (!isNil(where)) statement = statement.where(where);
    if (!isNil(limit)) statement = statement.limit(limit);
    if (!isNil(offset)) statement = statement.offset(offset);
    if (!isNil(orderBy)) statement = statement.orderBy(...orderBy);

    const [result, error] = await catchError(() => statement?.run());
    if (error) {
      const err = new Error(`Error while fetching posts: ${error}`);
      console.error(err);
      throw err;
    }
    const rows = result.rows;
    return JSON.parse(JSON.stringify(rows)) as OrbisDBRow<T>[];
  }

  type FetchRowsPageArg<T extends Record<string, any>> = Omit<
    FetchRowsArg<T>,
    "offset" | "limit"
  > & { page?: number; pageSize?: number };
  export async function fetchRowsPage<T extends Record<string, any>>({
    page = 0,
    pageSize = 10,
    ...arg
  }: FetchRowsPageArg<T>) {
    const offset = page * pageSize;
    return await fetchRows({ ...arg, offset, limit: pageSize });
  }

  type FindRowArg<T extends Record<string, any>> = Omit<
    FetchRowsArg<T>,
    "limit"
  >;
  export async function findRow<T extends Record<string, any>>(
    arg: FindRowArg<T>,
  ) {
    const result = await fetchRows({ ...arg, limit: 1 });
    if (result.length)
      return JSON.parse(JSON.stringify(result[0])) as OrbisDBRow<T>;
    return null;
  }

  type GqlArg = { model: ModelName; query: string };
  export async function gql<T extends Record<string, any>>({
    model,
    query,
  }: GqlArg) {
    if (!Resource.ORBIS_NODE_URL.value) {
      const error = new Error("No orbis node url");
      console.error(error);
      throw error;
    }
    if (!Resource.ORBIS_ENVIRONMENT_ID.value) {
      const error = new Error("No orbis environment id");
      console.error(error);
      throw error;
    }

    const endpoint = `${
      Resource.ORBIS_NODE_URL.value
    }/${Resource.ORBIS_ENVIRONMENT_ID.value.replaceAll(":", "_")}/graphql`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const resData = (await res.json()) as {
      data?: Record<Models[ModelName]["name"], any>;
    };

    const rows: OrbisDBRow<T>[] = resData?.data?.[models[model].name] || [];
    return rows;
  }
}
