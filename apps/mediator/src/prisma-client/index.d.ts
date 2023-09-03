
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions

export type PrismaPromise<T> = $Public.PrismaPromise<T>


export type EventLogPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "EventLog"
  objects: {}
  scalars: $Extensions.GetResult<{
    id: string
    name: string
    communicationChannel: CommunicationChannel | null
    sender: string
    receiver: string | null
    payload: Prisma.JsonValue
    createdAt: Date
    metadata: Prisma.JsonValue | null
  }, ExtArgs["result"]["eventLog"]>
  composites: {}
}

/**
 * Model EventLog
 * 
 */
export type EventLog = runtime.Types.DefaultSelection<EventLogPayload>
export type CommunicationContractPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "CommunicationContract"
  objects: {}
  scalars: $Extensions.GetResult<{
    id: string
    contract: string
    partyOne: string
    partyTwo: string
    expiresAt: Date | null
    communicationChannels: CommunicationChannel[]
  }, ExtArgs["result"]["communicationContract"]>
  composites: {}
}

/**
 * Model CommunicationContract
 * 
 */
export type CommunicationContract = runtime.Types.DefaultSelection<CommunicationContractPayload>

/**
 * Enums
 */

export const CommunicationChannel: {
  ONE_WAY_PUBLIC: 'ONE_WAY_PUBLIC',
  TWO_WAY_PRIVATE: 'TWO_WAY_PRIVATE',
  GROUP_PRIVATE: 'GROUP_PRIVATE'
};

export type CommunicationChannel = (typeof CommunicationChannel)[keyof typeof CommunicationChannel]


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more EventLogs
 * const eventLogs = await prisma.eventLog.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false,
  ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more EventLogs
   * const eventLogs = await prisma.eventLog.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => Promise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.eventLog`: Exposes CRUD operations for the **EventLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventLogs
    * const eventLogs = await prisma.eventLog.findMany()
    * ```
    */
  get eventLog(): Prisma.EventLogDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.communicationContract`: Exposes CRUD operations for the **CommunicationContract** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CommunicationContracts
    * const communicationContracts = await prisma.communicationContract.findMany()
    * ```
    */
  get communicationContract(): Prisma.CommunicationContractDelegate<GlobalReject, ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export type Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export type Args<T, F extends $Public.Operation> = $Public.Args<T, F>
  export type Payload<T, F extends $Public.Operation> = $Public.Payload<T, F>
  export type Result<T, A, F extends $Public.Operation> = $Public.Result<T, A, F>
  export type Exact<T, W> = $Public.Exact<T, W>

  /**
   * Prisma Client JS version: 4.16.2
   * Query Engine version: 4bc8b6e1b66cb932731fb1bdbbc550d1e010de81
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    EventLog: 'EventLog',
    CommunicationContract: 'CommunicationContract'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.Args}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'eventLog' | 'communicationContract'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      EventLog: {
        payload: EventLogPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.EventLogFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EventLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventLogFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EventLogPayload>
          }
          findFirst: {
            args: Prisma.EventLogFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EventLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventLogFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EventLogPayload>
          }
          findMany: {
            args: Prisma.EventLogFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EventLogPayload>[]
          }
          create: {
            args: Prisma.EventLogCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EventLogPayload>
          }
          createMany: {
            args: Prisma.EventLogCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.EventLogDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EventLogPayload>
          }
          update: {
            args: Prisma.EventLogUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EventLogPayload>
          }
          deleteMany: {
            args: Prisma.EventLogDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.EventLogUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.EventLogUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<EventLogPayload>
          }
          aggregate: {
            args: Prisma.EventLogAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateEventLog>
          }
          groupBy: {
            args: Prisma.EventLogGroupByArgs<ExtArgs>,
            result: $Utils.Optional<EventLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventLogCountArgs<ExtArgs>,
            result: $Utils.Optional<EventLogCountAggregateOutputType> | number
          }
        }
      }
      CommunicationContract: {
        payload: CommunicationContractPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.CommunicationContractFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CommunicationContractPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommunicationContractFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CommunicationContractPayload>
          }
          findFirst: {
            args: Prisma.CommunicationContractFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CommunicationContractPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommunicationContractFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CommunicationContractPayload>
          }
          findMany: {
            args: Prisma.CommunicationContractFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CommunicationContractPayload>[]
          }
          create: {
            args: Prisma.CommunicationContractCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CommunicationContractPayload>
          }
          createMany: {
            args: Prisma.CommunicationContractCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.CommunicationContractDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CommunicationContractPayload>
          }
          update: {
            args: Prisma.CommunicationContractUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CommunicationContractPayload>
          }
          deleteMany: {
            args: Prisma.CommunicationContractDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.CommunicationContractUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.CommunicationContractUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<CommunicationContractPayload>
          }
          aggregate: {
            args: Prisma.CommunicationContractAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateCommunicationContract>
          }
          groupBy: {
            args: Prisma.CommunicationContractGroupByArgs<ExtArgs>,
            result: $Utils.Optional<CommunicationContractGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommunicationContractCountArgs<ExtArgs>,
            result: $Utils.Optional<CommunicationContractCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model EventLog
   */


  export type AggregateEventLog = {
    _count: EventLogCountAggregateOutputType | null
    _min: EventLogMinAggregateOutputType | null
    _max: EventLogMaxAggregateOutputType | null
  }

  export type EventLogMinAggregateOutputType = {
    id: string | null
    name: string | null
    communicationChannel: CommunicationChannel | null
    sender: string | null
    receiver: string | null
    createdAt: Date | null
  }

  export type EventLogMaxAggregateOutputType = {
    id: string | null
    name: string | null
    communicationChannel: CommunicationChannel | null
    sender: string | null
    receiver: string | null
    createdAt: Date | null
  }

  export type EventLogCountAggregateOutputType = {
    id: number
    name: number
    communicationChannel: number
    sender: number
    receiver: number
    payload: number
    createdAt: number
    metadata: number
    _all: number
  }


  export type EventLogMinAggregateInputType = {
    id?: true
    name?: true
    communicationChannel?: true
    sender?: true
    receiver?: true
    createdAt?: true
  }

  export type EventLogMaxAggregateInputType = {
    id?: true
    name?: true
    communicationChannel?: true
    sender?: true
    receiver?: true
    createdAt?: true
  }

  export type EventLogCountAggregateInputType = {
    id?: true
    name?: true
    communicationChannel?: true
    sender?: true
    receiver?: true
    payload?: true
    createdAt?: true
    metadata?: true
    _all?: true
  }

  export type EventLogAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventLog to aggregate.
     */
    where?: EventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLogs to fetch.
     */
    orderBy?: Enumerable<EventLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventLogs
    **/
    _count?: true | EventLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventLogMaxAggregateInputType
  }

  export type GetEventLogAggregateType<T extends EventLogAggregateArgs> = {
        [P in keyof T & keyof AggregateEventLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventLog[P]>
      : GetScalarType<T[P], AggregateEventLog[P]>
  }




  export type EventLogGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: EventLogWhereInput
    orderBy?: Enumerable<EventLogOrderByWithAggregationInput>
    by: EventLogScalarFieldEnum[]
    having?: EventLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventLogCountAggregateInputType | true
    _min?: EventLogMinAggregateInputType
    _max?: EventLogMaxAggregateInputType
  }


  export type EventLogGroupByOutputType = {
    id: string
    name: string
    communicationChannel: CommunicationChannel | null
    sender: string
    receiver: string | null
    payload: JsonValue
    createdAt: Date
    metadata: JsonValue | null
    _count: EventLogCountAggregateOutputType | null
    _min: EventLogMinAggregateOutputType | null
    _max: EventLogMaxAggregateOutputType | null
  }

  type GetEventLogGroupByPayload<T extends EventLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<EventLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventLogGroupByOutputType[P]>
            : GetScalarType<T[P], EventLogGroupByOutputType[P]>
        }
      >
    >


  export type EventLogSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    communicationChannel?: boolean
    sender?: boolean
    receiver?: boolean
    payload?: boolean
    createdAt?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["eventLog"]>

  export type EventLogSelectScalar = {
    id?: boolean
    name?: boolean
    communicationChannel?: boolean
    sender?: boolean
    receiver?: boolean
    payload?: boolean
    createdAt?: boolean
    metadata?: boolean
  }


  type EventLogGetPayload<S extends boolean | null | undefined | EventLogArgs> = $Types.GetResult<EventLogPayload, S>

  type EventLogCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<EventLogFindManyArgs, 'select' | 'include'> & {
      select?: EventLogCountAggregateInputType | true
    }

  export interface EventLogDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventLog'], meta: { name: 'EventLog' } }
    /**
     * Find zero or one EventLog that matches the filter.
     * @param {EventLogFindUniqueArgs} args - Arguments to find a EventLog
     * @example
     * // Get one EventLog
     * const eventLog = await prisma.eventLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends EventLogFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, EventLogFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'EventLog'> extends True ? Prisma__EventLogClient<$Types.GetResult<EventLogPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__EventLogClient<$Types.GetResult<EventLogPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one EventLog that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {EventLogFindUniqueOrThrowArgs} args - Arguments to find a EventLog
     * @example
     * // Get one EventLog
     * const eventLog = await prisma.eventLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends EventLogFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, EventLogFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__EventLogClient<$Types.GetResult<EventLogPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first EventLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogFindFirstArgs} args - Arguments to find a EventLog
     * @example
     * // Get one EventLog
     * const eventLog = await prisma.eventLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends EventLogFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, EventLogFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'EventLog'> extends True ? Prisma__EventLogClient<$Types.GetResult<EventLogPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__EventLogClient<$Types.GetResult<EventLogPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first EventLog that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogFindFirstOrThrowArgs} args - Arguments to find a EventLog
     * @example
     * // Get one EventLog
     * const eventLog = await prisma.eventLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends EventLogFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, EventLogFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__EventLogClient<$Types.GetResult<EventLogPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more EventLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventLogs
     * const eventLogs = await prisma.eventLog.findMany()
     * 
     * // Get first 10 EventLogs
     * const eventLogs = await prisma.eventLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventLogWithIdOnly = await prisma.eventLog.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends EventLogFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, EventLogFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<EventLogPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a EventLog.
     * @param {EventLogCreateArgs} args - Arguments to create a EventLog.
     * @example
     * // Create one EventLog
     * const EventLog = await prisma.eventLog.create({
     *   data: {
     *     // ... data to create a EventLog
     *   }
     * })
     * 
    **/
    create<T extends EventLogCreateArgs<ExtArgs>>(
      args: SelectSubset<T, EventLogCreateArgs<ExtArgs>>
    ): Prisma__EventLogClient<$Types.GetResult<EventLogPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many EventLogs.
     *     @param {EventLogCreateManyArgs} args - Arguments to create many EventLogs.
     *     @example
     *     // Create many EventLogs
     *     const eventLog = await prisma.eventLog.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends EventLogCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, EventLogCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a EventLog.
     * @param {EventLogDeleteArgs} args - Arguments to delete one EventLog.
     * @example
     * // Delete one EventLog
     * const EventLog = await prisma.eventLog.delete({
     *   where: {
     *     // ... filter to delete one EventLog
     *   }
     * })
     * 
    **/
    delete<T extends EventLogDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, EventLogDeleteArgs<ExtArgs>>
    ): Prisma__EventLogClient<$Types.GetResult<EventLogPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one EventLog.
     * @param {EventLogUpdateArgs} args - Arguments to update one EventLog.
     * @example
     * // Update one EventLog
     * const eventLog = await prisma.eventLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends EventLogUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, EventLogUpdateArgs<ExtArgs>>
    ): Prisma__EventLogClient<$Types.GetResult<EventLogPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more EventLogs.
     * @param {EventLogDeleteManyArgs} args - Arguments to filter EventLogs to delete.
     * @example
     * // Delete a few EventLogs
     * const { count } = await prisma.eventLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends EventLogDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, EventLogDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventLogs
     * const eventLog = await prisma.eventLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends EventLogUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, EventLogUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EventLog.
     * @param {EventLogUpsertArgs} args - Arguments to update or create a EventLog.
     * @example
     * // Update or create a EventLog
     * const eventLog = await prisma.eventLog.upsert({
     *   create: {
     *     // ... data to create a EventLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventLog we want to update
     *   }
     * })
    **/
    upsert<T extends EventLogUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, EventLogUpsertArgs<ExtArgs>>
    ): Prisma__EventLogClient<$Types.GetResult<EventLogPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of EventLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogCountArgs} args - Arguments to filter EventLogs to count.
     * @example
     * // Count the number of EventLogs
     * const count = await prisma.eventLog.count({
     *   where: {
     *     // ... the filter for the EventLogs we want to count
     *   }
     * })
    **/
    count<T extends EventLogCountArgs>(
      args?: Subset<T, EventLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventLogAggregateArgs>(args: Subset<T, EventLogAggregateArgs>): Prisma.PrismaPromise<GetEventLogAggregateType<T>>

    /**
     * Group by EventLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventLogGroupByArgs['orderBy'] }
        : { orderBy?: EventLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for EventLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EventLogClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * EventLog base type for findUnique actions
   */
  export type EventLogFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Filter, which EventLog to fetch.
     */
    where: EventLogWhereUniqueInput
  }

  /**
   * EventLog findUnique
   */
  export interface EventLogFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends EventLogFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * EventLog findUniqueOrThrow
   */
  export type EventLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Filter, which EventLog to fetch.
     */
    where: EventLogWhereUniqueInput
  }


  /**
   * EventLog base type for findFirst actions
   */
  export type EventLogFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Filter, which EventLog to fetch.
     */
    where?: EventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLogs to fetch.
     */
    orderBy?: Enumerable<EventLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventLogs.
     */
    cursor?: EventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventLogs.
     */
    distinct?: Enumerable<EventLogScalarFieldEnum>
  }

  /**
   * EventLog findFirst
   */
  export interface EventLogFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends EventLogFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * EventLog findFirstOrThrow
   */
  export type EventLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Filter, which EventLog to fetch.
     */
    where?: EventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLogs to fetch.
     */
    orderBy?: Enumerable<EventLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventLogs.
     */
    cursor?: EventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventLogs.
     */
    distinct?: Enumerable<EventLogScalarFieldEnum>
  }


  /**
   * EventLog findMany
   */
  export type EventLogFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Filter, which EventLogs to fetch.
     */
    where?: EventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLogs to fetch.
     */
    orderBy?: Enumerable<EventLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventLogs.
     */
    cursor?: EventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLogs.
     */
    skip?: number
    distinct?: Enumerable<EventLogScalarFieldEnum>
  }


  /**
   * EventLog create
   */
  export type EventLogCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * The data needed to create a EventLog.
     */
    data: XOR<EventLogCreateInput, EventLogUncheckedCreateInput>
  }


  /**
   * EventLog createMany
   */
  export type EventLogCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventLogs.
     */
    data: Enumerable<EventLogCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * EventLog update
   */
  export type EventLogUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * The data needed to update a EventLog.
     */
    data: XOR<EventLogUpdateInput, EventLogUncheckedUpdateInput>
    /**
     * Choose, which EventLog to update.
     */
    where: EventLogWhereUniqueInput
  }


  /**
   * EventLog updateMany
   */
  export type EventLogUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventLogs.
     */
    data: XOR<EventLogUpdateManyMutationInput, EventLogUncheckedUpdateManyInput>
    /**
     * Filter which EventLogs to update
     */
    where?: EventLogWhereInput
  }


  /**
   * EventLog upsert
   */
  export type EventLogUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * The filter to search for the EventLog to update in case it exists.
     */
    where: EventLogWhereUniqueInput
    /**
     * In case the EventLog found by the `where` argument doesn't exist, create a new EventLog with this data.
     */
    create: XOR<EventLogCreateInput, EventLogUncheckedCreateInput>
    /**
     * In case the EventLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventLogUpdateInput, EventLogUncheckedUpdateInput>
  }


  /**
   * EventLog delete
   */
  export type EventLogDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Filter which EventLog to delete.
     */
    where: EventLogWhereUniqueInput
  }


  /**
   * EventLog deleteMany
   */
  export type EventLogDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventLogs to delete
     */
    where?: EventLogWhereInput
  }


  /**
   * EventLog without action
   */
  export type EventLogArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
  }



  /**
   * Model CommunicationContract
   */


  export type AggregateCommunicationContract = {
    _count: CommunicationContractCountAggregateOutputType | null
    _min: CommunicationContractMinAggregateOutputType | null
    _max: CommunicationContractMaxAggregateOutputType | null
  }

  export type CommunicationContractMinAggregateOutputType = {
    id: string | null
    contract: string | null
    partyOne: string | null
    partyTwo: string | null
    expiresAt: Date | null
  }

  export type CommunicationContractMaxAggregateOutputType = {
    id: string | null
    contract: string | null
    partyOne: string | null
    partyTwo: string | null
    expiresAt: Date | null
  }

  export type CommunicationContractCountAggregateOutputType = {
    id: number
    contract: number
    partyOne: number
    partyTwo: number
    expiresAt: number
    communicationChannels: number
    _all: number
  }


  export type CommunicationContractMinAggregateInputType = {
    id?: true
    contract?: true
    partyOne?: true
    partyTwo?: true
    expiresAt?: true
  }

  export type CommunicationContractMaxAggregateInputType = {
    id?: true
    contract?: true
    partyOne?: true
    partyTwo?: true
    expiresAt?: true
  }

  export type CommunicationContractCountAggregateInputType = {
    id?: true
    contract?: true
    partyOne?: true
    partyTwo?: true
    expiresAt?: true
    communicationChannels?: true
    _all?: true
  }

  export type CommunicationContractAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunicationContract to aggregate.
     */
    where?: CommunicationContractWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunicationContracts to fetch.
     */
    orderBy?: Enumerable<CommunicationContractOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommunicationContractWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunicationContracts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunicationContracts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CommunicationContracts
    **/
    _count?: true | CommunicationContractCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommunicationContractMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommunicationContractMaxAggregateInputType
  }

  export type GetCommunicationContractAggregateType<T extends CommunicationContractAggregateArgs> = {
        [P in keyof T & keyof AggregateCommunicationContract]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommunicationContract[P]>
      : GetScalarType<T[P], AggregateCommunicationContract[P]>
  }




  export type CommunicationContractGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: CommunicationContractWhereInput
    orderBy?: Enumerable<CommunicationContractOrderByWithAggregationInput>
    by: CommunicationContractScalarFieldEnum[]
    having?: CommunicationContractScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommunicationContractCountAggregateInputType | true
    _min?: CommunicationContractMinAggregateInputType
    _max?: CommunicationContractMaxAggregateInputType
  }


  export type CommunicationContractGroupByOutputType = {
    id: string
    contract: string
    partyOne: string
    partyTwo: string
    expiresAt: Date | null
    communicationChannels: CommunicationChannel[]
    _count: CommunicationContractCountAggregateOutputType | null
    _min: CommunicationContractMinAggregateOutputType | null
    _max: CommunicationContractMaxAggregateOutputType | null
  }

  type GetCommunicationContractGroupByPayload<T extends CommunicationContractGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<CommunicationContractGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommunicationContractGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommunicationContractGroupByOutputType[P]>
            : GetScalarType<T[P], CommunicationContractGroupByOutputType[P]>
        }
      >
    >


  export type CommunicationContractSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contract?: boolean
    partyOne?: boolean
    partyTwo?: boolean
    expiresAt?: boolean
    communicationChannels?: boolean
  }, ExtArgs["result"]["communicationContract"]>

  export type CommunicationContractSelectScalar = {
    id?: boolean
    contract?: boolean
    partyOne?: boolean
    partyTwo?: boolean
    expiresAt?: boolean
    communicationChannels?: boolean
  }


  type CommunicationContractGetPayload<S extends boolean | null | undefined | CommunicationContractArgs> = $Types.GetResult<CommunicationContractPayload, S>

  type CommunicationContractCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<CommunicationContractFindManyArgs, 'select' | 'include'> & {
      select?: CommunicationContractCountAggregateInputType | true
    }

  export interface CommunicationContractDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CommunicationContract'], meta: { name: 'CommunicationContract' } }
    /**
     * Find zero or one CommunicationContract that matches the filter.
     * @param {CommunicationContractFindUniqueArgs} args - Arguments to find a CommunicationContract
     * @example
     * // Get one CommunicationContract
     * const communicationContract = await prisma.communicationContract.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends CommunicationContractFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, CommunicationContractFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'CommunicationContract'> extends True ? Prisma__CommunicationContractClient<$Types.GetResult<CommunicationContractPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__CommunicationContractClient<$Types.GetResult<CommunicationContractPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one CommunicationContract that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {CommunicationContractFindUniqueOrThrowArgs} args - Arguments to find a CommunicationContract
     * @example
     * // Get one CommunicationContract
     * const communicationContract = await prisma.communicationContract.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends CommunicationContractFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CommunicationContractFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__CommunicationContractClient<$Types.GetResult<CommunicationContractPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first CommunicationContract that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationContractFindFirstArgs} args - Arguments to find a CommunicationContract
     * @example
     * // Get one CommunicationContract
     * const communicationContract = await prisma.communicationContract.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends CommunicationContractFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, CommunicationContractFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'CommunicationContract'> extends True ? Prisma__CommunicationContractClient<$Types.GetResult<CommunicationContractPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__CommunicationContractClient<$Types.GetResult<CommunicationContractPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first CommunicationContract that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationContractFindFirstOrThrowArgs} args - Arguments to find a CommunicationContract
     * @example
     * // Get one CommunicationContract
     * const communicationContract = await prisma.communicationContract.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends CommunicationContractFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CommunicationContractFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__CommunicationContractClient<$Types.GetResult<CommunicationContractPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more CommunicationContracts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationContractFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CommunicationContracts
     * const communicationContracts = await prisma.communicationContract.findMany()
     * 
     * // Get first 10 CommunicationContracts
     * const communicationContracts = await prisma.communicationContract.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const communicationContractWithIdOnly = await prisma.communicationContract.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends CommunicationContractFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommunicationContractFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<CommunicationContractPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a CommunicationContract.
     * @param {CommunicationContractCreateArgs} args - Arguments to create a CommunicationContract.
     * @example
     * // Create one CommunicationContract
     * const CommunicationContract = await prisma.communicationContract.create({
     *   data: {
     *     // ... data to create a CommunicationContract
     *   }
     * })
     * 
    **/
    create<T extends CommunicationContractCreateArgs<ExtArgs>>(
      args: SelectSubset<T, CommunicationContractCreateArgs<ExtArgs>>
    ): Prisma__CommunicationContractClient<$Types.GetResult<CommunicationContractPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many CommunicationContracts.
     *     @param {CommunicationContractCreateManyArgs} args - Arguments to create many CommunicationContracts.
     *     @example
     *     // Create many CommunicationContracts
     *     const communicationContract = await prisma.communicationContract.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends CommunicationContractCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommunicationContractCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CommunicationContract.
     * @param {CommunicationContractDeleteArgs} args - Arguments to delete one CommunicationContract.
     * @example
     * // Delete one CommunicationContract
     * const CommunicationContract = await prisma.communicationContract.delete({
     *   where: {
     *     // ... filter to delete one CommunicationContract
     *   }
     * })
     * 
    **/
    delete<T extends CommunicationContractDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, CommunicationContractDeleteArgs<ExtArgs>>
    ): Prisma__CommunicationContractClient<$Types.GetResult<CommunicationContractPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one CommunicationContract.
     * @param {CommunicationContractUpdateArgs} args - Arguments to update one CommunicationContract.
     * @example
     * // Update one CommunicationContract
     * const communicationContract = await prisma.communicationContract.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends CommunicationContractUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, CommunicationContractUpdateArgs<ExtArgs>>
    ): Prisma__CommunicationContractClient<$Types.GetResult<CommunicationContractPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more CommunicationContracts.
     * @param {CommunicationContractDeleteManyArgs} args - Arguments to filter CommunicationContracts to delete.
     * @example
     * // Delete a few CommunicationContracts
     * const { count } = await prisma.communicationContract.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends CommunicationContractDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CommunicationContractDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommunicationContracts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationContractUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CommunicationContracts
     * const communicationContract = await prisma.communicationContract.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends CommunicationContractUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, CommunicationContractUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CommunicationContract.
     * @param {CommunicationContractUpsertArgs} args - Arguments to update or create a CommunicationContract.
     * @example
     * // Update or create a CommunicationContract
     * const communicationContract = await prisma.communicationContract.upsert({
     *   create: {
     *     // ... data to create a CommunicationContract
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CommunicationContract we want to update
     *   }
     * })
    **/
    upsert<T extends CommunicationContractUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, CommunicationContractUpsertArgs<ExtArgs>>
    ): Prisma__CommunicationContractClient<$Types.GetResult<CommunicationContractPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of CommunicationContracts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationContractCountArgs} args - Arguments to filter CommunicationContracts to count.
     * @example
     * // Count the number of CommunicationContracts
     * const count = await prisma.communicationContract.count({
     *   where: {
     *     // ... the filter for the CommunicationContracts we want to count
     *   }
     * })
    **/
    count<T extends CommunicationContractCountArgs>(
      args?: Subset<T, CommunicationContractCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommunicationContractCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CommunicationContract.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationContractAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommunicationContractAggregateArgs>(args: Subset<T, CommunicationContractAggregateArgs>): Prisma.PrismaPromise<GetCommunicationContractAggregateType<T>>

    /**
     * Group by CommunicationContract.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationContractGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommunicationContractGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommunicationContractGroupByArgs['orderBy'] }
        : { orderBy?: CommunicationContractGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommunicationContractGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommunicationContractGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for CommunicationContract.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__CommunicationContractClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * CommunicationContract base type for findUnique actions
   */
  export type CommunicationContractFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationContract
     */
    select?: CommunicationContractSelect<ExtArgs> | null
    /**
     * Filter, which CommunicationContract to fetch.
     */
    where: CommunicationContractWhereUniqueInput
  }

  /**
   * CommunicationContract findUnique
   */
  export interface CommunicationContractFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends CommunicationContractFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * CommunicationContract findUniqueOrThrow
   */
  export type CommunicationContractFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationContract
     */
    select?: CommunicationContractSelect<ExtArgs> | null
    /**
     * Filter, which CommunicationContract to fetch.
     */
    where: CommunicationContractWhereUniqueInput
  }


  /**
   * CommunicationContract base type for findFirst actions
   */
  export type CommunicationContractFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationContract
     */
    select?: CommunicationContractSelect<ExtArgs> | null
    /**
     * Filter, which CommunicationContract to fetch.
     */
    where?: CommunicationContractWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunicationContracts to fetch.
     */
    orderBy?: Enumerable<CommunicationContractOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunicationContracts.
     */
    cursor?: CommunicationContractWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunicationContracts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunicationContracts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunicationContracts.
     */
    distinct?: Enumerable<CommunicationContractScalarFieldEnum>
  }

  /**
   * CommunicationContract findFirst
   */
  export interface CommunicationContractFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends CommunicationContractFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * CommunicationContract findFirstOrThrow
   */
  export type CommunicationContractFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationContract
     */
    select?: CommunicationContractSelect<ExtArgs> | null
    /**
     * Filter, which CommunicationContract to fetch.
     */
    where?: CommunicationContractWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunicationContracts to fetch.
     */
    orderBy?: Enumerable<CommunicationContractOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunicationContracts.
     */
    cursor?: CommunicationContractWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunicationContracts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunicationContracts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunicationContracts.
     */
    distinct?: Enumerable<CommunicationContractScalarFieldEnum>
  }


  /**
   * CommunicationContract findMany
   */
  export type CommunicationContractFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationContract
     */
    select?: CommunicationContractSelect<ExtArgs> | null
    /**
     * Filter, which CommunicationContracts to fetch.
     */
    where?: CommunicationContractWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunicationContracts to fetch.
     */
    orderBy?: Enumerable<CommunicationContractOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CommunicationContracts.
     */
    cursor?: CommunicationContractWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunicationContracts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunicationContracts.
     */
    skip?: number
    distinct?: Enumerable<CommunicationContractScalarFieldEnum>
  }


  /**
   * CommunicationContract create
   */
  export type CommunicationContractCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationContract
     */
    select?: CommunicationContractSelect<ExtArgs> | null
    /**
     * The data needed to create a CommunicationContract.
     */
    data: XOR<CommunicationContractCreateInput, CommunicationContractUncheckedCreateInput>
  }


  /**
   * CommunicationContract createMany
   */
  export type CommunicationContractCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CommunicationContracts.
     */
    data: Enumerable<CommunicationContractCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * CommunicationContract update
   */
  export type CommunicationContractUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationContract
     */
    select?: CommunicationContractSelect<ExtArgs> | null
    /**
     * The data needed to update a CommunicationContract.
     */
    data: XOR<CommunicationContractUpdateInput, CommunicationContractUncheckedUpdateInput>
    /**
     * Choose, which CommunicationContract to update.
     */
    where: CommunicationContractWhereUniqueInput
  }


  /**
   * CommunicationContract updateMany
   */
  export type CommunicationContractUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CommunicationContracts.
     */
    data: XOR<CommunicationContractUpdateManyMutationInput, CommunicationContractUncheckedUpdateManyInput>
    /**
     * Filter which CommunicationContracts to update
     */
    where?: CommunicationContractWhereInput
  }


  /**
   * CommunicationContract upsert
   */
  export type CommunicationContractUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationContract
     */
    select?: CommunicationContractSelect<ExtArgs> | null
    /**
     * The filter to search for the CommunicationContract to update in case it exists.
     */
    where: CommunicationContractWhereUniqueInput
    /**
     * In case the CommunicationContract found by the `where` argument doesn't exist, create a new CommunicationContract with this data.
     */
    create: XOR<CommunicationContractCreateInput, CommunicationContractUncheckedCreateInput>
    /**
     * In case the CommunicationContract was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommunicationContractUpdateInput, CommunicationContractUncheckedUpdateInput>
  }


  /**
   * CommunicationContract delete
   */
  export type CommunicationContractDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationContract
     */
    select?: CommunicationContractSelect<ExtArgs> | null
    /**
     * Filter which CommunicationContract to delete.
     */
    where: CommunicationContractWhereUniqueInput
  }


  /**
   * CommunicationContract deleteMany
   */
  export type CommunicationContractDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunicationContracts to delete
     */
    where?: CommunicationContractWhereInput
  }


  /**
   * CommunicationContract without action
   */
  export type CommunicationContractArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationContract
     */
    select?: CommunicationContractSelect<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const EventLogScalarFieldEnum: {
    id: 'id',
    name: 'name',
    communicationChannel: 'communicationChannel',
    sender: 'sender',
    receiver: 'receiver',
    payload: 'payload',
    createdAt: 'createdAt',
    metadata: 'metadata'
  };

  export type EventLogScalarFieldEnum = (typeof EventLogScalarFieldEnum)[keyof typeof EventLogScalarFieldEnum]


  export const CommunicationContractScalarFieldEnum: {
    id: 'id',
    contract: 'contract',
    partyOne: 'partyOne',
    partyTwo: 'partyTwo',
    expiresAt: 'expiresAt',
    communicationChannels: 'communicationChannels'
  };

  export type CommunicationContractScalarFieldEnum = (typeof CommunicationContractScalarFieldEnum)[keyof typeof CommunicationContractScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Deep Input Types
   */


  export type EventLogWhereInput = {
    AND?: Enumerable<EventLogWhereInput>
    OR?: Enumerable<EventLogWhereInput>
    NOT?: Enumerable<EventLogWhereInput>
    id?: StringFilter | string
    name?: StringFilter | string
    communicationChannel?: EnumCommunicationChannelNullableFilter | CommunicationChannel | null
    sender?: StringFilter | string
    receiver?: StringNullableFilter | string | null
    payload?: JsonFilter
    createdAt?: DateTimeFilter | Date | string
    metadata?: JsonNullableFilter
  }

  export type EventLogOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    communicationChannel?: SortOrderInput | SortOrder
    sender?: SortOrder
    receiver?: SortOrderInput | SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    metadata?: SortOrderInput | SortOrder
  }

  export type EventLogWhereUniqueInput = {
    id?: string
  }

  export type EventLogOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    communicationChannel?: SortOrderInput | SortOrder
    sender?: SortOrder
    receiver?: SortOrderInput | SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: EventLogCountOrderByAggregateInput
    _max?: EventLogMaxOrderByAggregateInput
    _min?: EventLogMinOrderByAggregateInput
  }

  export type EventLogScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EventLogScalarWhereWithAggregatesInput>
    OR?: Enumerable<EventLogScalarWhereWithAggregatesInput>
    NOT?: Enumerable<EventLogScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    name?: StringWithAggregatesFilter | string
    communicationChannel?: EnumCommunicationChannelNullableWithAggregatesFilter | CommunicationChannel | null
    sender?: StringWithAggregatesFilter | string
    receiver?: StringNullableWithAggregatesFilter | string | null
    payload?: JsonWithAggregatesFilter
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    metadata?: JsonNullableWithAggregatesFilter
  }

  export type CommunicationContractWhereInput = {
    AND?: Enumerable<CommunicationContractWhereInput>
    OR?: Enumerable<CommunicationContractWhereInput>
    NOT?: Enumerable<CommunicationContractWhereInput>
    id?: StringFilter | string
    contract?: StringFilter | string
    partyOne?: StringFilter | string
    partyTwo?: StringFilter | string
    expiresAt?: DateTimeNullableFilter | Date | string | null
    communicationChannels?: EnumCommunicationChannelNullableListFilter
  }

  export type CommunicationContractOrderByWithRelationInput = {
    id?: SortOrder
    contract?: SortOrder
    partyOne?: SortOrder
    partyTwo?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    communicationChannels?: SortOrder
  }

  export type CommunicationContractWhereUniqueInput = {
    id?: string
  }

  export type CommunicationContractOrderByWithAggregationInput = {
    id?: SortOrder
    contract?: SortOrder
    partyOne?: SortOrder
    partyTwo?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    communicationChannels?: SortOrder
    _count?: CommunicationContractCountOrderByAggregateInput
    _max?: CommunicationContractMaxOrderByAggregateInput
    _min?: CommunicationContractMinOrderByAggregateInput
  }

  export type CommunicationContractScalarWhereWithAggregatesInput = {
    AND?: Enumerable<CommunicationContractScalarWhereWithAggregatesInput>
    OR?: Enumerable<CommunicationContractScalarWhereWithAggregatesInput>
    NOT?: Enumerable<CommunicationContractScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    contract?: StringWithAggregatesFilter | string
    partyOne?: StringWithAggregatesFilter | string
    partyTwo?: StringWithAggregatesFilter | string
    expiresAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    communicationChannels?: EnumCommunicationChannelNullableListFilter
  }

  export type EventLogCreateInput = {
    id?: string
    name: string
    communicationChannel?: CommunicationChannel | null
    sender: string
    receiver?: string | null
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventLogUncheckedCreateInput = {
    id?: string
    name: string
    communicationChannel?: CommunicationChannel | null
    sender: string
    receiver?: string | null
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    communicationChannel?: NullableEnumCommunicationChannelFieldUpdateOperationsInput | CommunicationChannel | null
    sender?: StringFieldUpdateOperationsInput | string
    receiver?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    communicationChannel?: NullableEnumCommunicationChannelFieldUpdateOperationsInput | CommunicationChannel | null
    sender?: StringFieldUpdateOperationsInput | string
    receiver?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventLogCreateManyInput = {
    id?: string
    name: string
    communicationChannel?: CommunicationChannel | null
    sender: string
    receiver?: string | null
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    communicationChannel?: NullableEnumCommunicationChannelFieldUpdateOperationsInput | CommunicationChannel | null
    sender?: StringFieldUpdateOperationsInput | string
    receiver?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    communicationChannel?: NullableEnumCommunicationChannelFieldUpdateOperationsInput | CommunicationChannel | null
    sender?: StringFieldUpdateOperationsInput | string
    receiver?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type CommunicationContractCreateInput = {
    id?: string
    contract: string
    partyOne: string
    partyTwo: string
    expiresAt?: Date | string | null
    communicationChannels?: CommunicationContractCreatecommunicationChannelsInput | Enumerable<CommunicationChannel>
  }

  export type CommunicationContractUncheckedCreateInput = {
    id?: string
    contract: string
    partyOne: string
    partyTwo: string
    expiresAt?: Date | string | null
    communicationChannels?: CommunicationContractCreatecommunicationChannelsInput | Enumerable<CommunicationChannel>
  }

  export type CommunicationContractUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contract?: StringFieldUpdateOperationsInput | string
    partyOne?: StringFieldUpdateOperationsInput | string
    partyTwo?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    communicationChannels?: CommunicationContractUpdatecommunicationChannelsInput | Enumerable<CommunicationChannel>
  }

  export type CommunicationContractUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contract?: StringFieldUpdateOperationsInput | string
    partyOne?: StringFieldUpdateOperationsInput | string
    partyTwo?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    communicationChannels?: CommunicationContractUpdatecommunicationChannelsInput | Enumerable<CommunicationChannel>
  }

  export type CommunicationContractCreateManyInput = {
    id?: string
    contract: string
    partyOne: string
    partyTwo: string
    expiresAt?: Date | string | null
    communicationChannels?: CommunicationContractCreatecommunicationChannelsInput | Enumerable<CommunicationChannel>
  }

  export type CommunicationContractUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    contract?: StringFieldUpdateOperationsInput | string
    partyOne?: StringFieldUpdateOperationsInput | string
    partyTwo?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    communicationChannels?: CommunicationContractUpdatecommunicationChannelsInput | Enumerable<CommunicationChannel>
  }

  export type CommunicationContractUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    contract?: StringFieldUpdateOperationsInput | string
    partyOne?: StringFieldUpdateOperationsInput | string
    partyTwo?: StringFieldUpdateOperationsInput | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    communicationChannels?: CommunicationContractUpdatecommunicationChannelsInput | Enumerable<CommunicationChannel>
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type EnumCommunicationChannelNullableFilter = {
    equals?: CommunicationChannel | null
    in?: Enumerable<CommunicationChannel> | null
    notIn?: Enumerable<CommunicationChannel> | null
    not?: NestedEnumCommunicationChannelNullableFilter | CommunicationChannel | null
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }
  export type JsonFilter = 
    | PatchUndefined<
        Either<Required<JsonFilterBase>, Exclude<keyof Required<JsonFilterBase>, 'path'>>,
        Required<JsonFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase>, 'path'>>

  export type JsonFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }
  export type JsonNullableFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase>, Exclude<keyof Required<JsonNullableFilterBase>, 'path'>>,
        Required<JsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase>, 'path'>>

  export type JsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EventLogCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    communicationChannel?: SortOrder
    sender?: SortOrder
    receiver?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    metadata?: SortOrder
  }

  export type EventLogMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    communicationChannel?: SortOrder
    sender?: SortOrder
    receiver?: SortOrder
    createdAt?: SortOrder
  }

  export type EventLogMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    communicationChannel?: SortOrder
    sender?: SortOrder
    receiver?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type EnumCommunicationChannelNullableWithAggregatesFilter = {
    equals?: CommunicationChannel | null
    in?: Enumerable<CommunicationChannel> | null
    notIn?: Enumerable<CommunicationChannel> | null
    not?: NestedEnumCommunicationChannelNullableWithAggregatesFilter | CommunicationChannel | null
    _count?: NestedIntNullableFilter
    _min?: NestedEnumCommunicationChannelNullableFilter
    _max?: NestedEnumCommunicationChannelNullableFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }
  export type JsonWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase>, Exclude<keyof Required<JsonWithAggregatesFilterBase>, 'path'>>,
        Required<JsonWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase>, 'path'>>

  export type JsonWithAggregatesFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
    _count?: NestedIntFilter
    _min?: NestedJsonFilter
    _max?: NestedJsonFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }
  export type JsonNullableWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
    _count?: NestedIntNullableFilter
    _min?: NestedJsonNullableFilter
    _max?: NestedJsonNullableFilter
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type EnumCommunicationChannelNullableListFilter = {
    equals?: Enumerable<CommunicationChannel> | null
    has?: CommunicationChannel | null
    hasEvery?: Enumerable<CommunicationChannel>
    hasSome?: Enumerable<CommunicationChannel>
    isEmpty?: boolean
  }

  export type CommunicationContractCountOrderByAggregateInput = {
    id?: SortOrder
    contract?: SortOrder
    partyOne?: SortOrder
    partyTwo?: SortOrder
    expiresAt?: SortOrder
    communicationChannels?: SortOrder
  }

  export type CommunicationContractMaxOrderByAggregateInput = {
    id?: SortOrder
    contract?: SortOrder
    partyOne?: SortOrder
    partyTwo?: SortOrder
    expiresAt?: SortOrder
  }

  export type CommunicationContractMinOrderByAggregateInput = {
    id?: SortOrder
    contract?: SortOrder
    partyOne?: SortOrder
    partyTwo?: SortOrder
    expiresAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableEnumCommunicationChannelFieldUpdateOperationsInput = {
    set?: CommunicationChannel | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CommunicationContractCreatecommunicationChannelsInput = {
    set: Enumerable<CommunicationChannel>
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type CommunicationContractUpdatecommunicationChannelsInput = {
    set?: Enumerable<CommunicationChannel>
    push?: Enumerable<CommunicationChannel>
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedEnumCommunicationChannelNullableFilter = {
    equals?: CommunicationChannel | null
    in?: Enumerable<CommunicationChannel> | null
    notIn?: Enumerable<CommunicationChannel> | null
    not?: NestedEnumCommunicationChannelNullableFilter | CommunicationChannel | null
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedEnumCommunicationChannelNullableWithAggregatesFilter = {
    equals?: CommunicationChannel | null
    in?: Enumerable<CommunicationChannel> | null
    notIn?: Enumerable<CommunicationChannel> | null
    not?: NestedEnumCommunicationChannelNullableWithAggregatesFilter | CommunicationChannel | null
    _count?: NestedIntNullableFilter
    _min?: NestedEnumCommunicationChannelNullableFilter
    _max?: NestedEnumCommunicationChannelNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }
  export type NestedJsonFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase>, Exclude<keyof Required<NestedJsonFilterBase>, 'path'>>,
        Required<NestedJsonFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase>, 'path'>>

  export type NestedJsonFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }
  export type NestedJsonNullableFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase>, Exclude<keyof Required<NestedJsonNullableFilterBase>, 'path'>>,
        Required<NestedJsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase>, 'path'>>

  export type NestedJsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}