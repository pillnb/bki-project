
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model pegawai
 * 
 */
export type pegawai = $Result.DefaultSelection<Prisma.$pegawaiPayload>
/**
 * Model pelatihan
 * 
 */
export type pelatihan = $Result.DefaultSelection<Prisma.$pelatihanPayload>
/**
 * Model pengalaman_kerja
 * 
 */
export type pengalaman_kerja = $Result.DefaultSelection<Prisma.$pengalaman_kerjaPayload>
/**
 * Model SuratTugas
 * 
 */
export type SuratTugas = $Result.DefaultSelection<Prisma.$SuratTugasPayload>
/**
 * Model PegawaiSuratTugas
 * 
 */
export type PegawaiSuratTugas = $Result.DefaultSelection<Prisma.$PegawaiSuratTugasPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const StatusPelatihan: {
  ON_GOING: 'ON_GOING',
  VALID: 'VALID',
  EXPIRED: 'EXPIRED'
};

export type StatusPelatihan = (typeof StatusPelatihan)[keyof typeof StatusPelatihan]


export const StatusSuratTugas: {
  DIAJUKAN: 'DIAJUKAN',
  MENUNGGU_APPROVAL: 'MENUNGGU_APPROVAL',
  SELESAI: 'SELESAI',
  DITOLAK: 'DITOLAK'
};

export type StatusSuratTugas = (typeof StatusSuratTugas)[keyof typeof StatusSuratTugas]

}

export type StatusPelatihan = $Enums.StatusPelatihan

export const StatusPelatihan: typeof $Enums.StatusPelatihan

export type StatusSuratTugas = $Enums.StatusSuratTugas

export const StatusSuratTugas: typeof $Enums.StatusSuratTugas

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Pegawais
 * const pegawais = await prisma.pegawai.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Pegawais
   * const pegawais = await prisma.pegawai.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

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
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.pegawai`: Exposes CRUD operations for the **pegawai** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pegawais
    * const pegawais = await prisma.pegawai.findMany()
    * ```
    */
  get pegawai(): Prisma.pegawaiDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pelatihan`: Exposes CRUD operations for the **pelatihan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pelatihans
    * const pelatihans = await prisma.pelatihan.findMany()
    * ```
    */
  get pelatihan(): Prisma.pelatihanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pengalaman_kerja`: Exposes CRUD operations for the **pengalaman_kerja** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pengalaman_kerjas
    * const pengalaman_kerjas = await prisma.pengalaman_kerja.findMany()
    * ```
    */
  get pengalaman_kerja(): Prisma.pengalaman_kerjaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.suratTugas`: Exposes CRUD operations for the **SuratTugas** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SuratTugases
    * const suratTugases = await prisma.suratTugas.findMany()
    * ```
    */
  get suratTugas(): Prisma.SuratTugasDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pegawaiSuratTugas`: Exposes CRUD operations for the **PegawaiSuratTugas** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PegawaiSuratTugases
    * const pegawaiSuratTugases = await prisma.pegawaiSuratTugas.findMany()
    * ```
    */
  get pegawaiSuratTugas(): Prisma.PegawaiSuratTugasDelegate<ExtArgs, ClientOptions>;
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
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.11.1
   * Query Engine version: f40f79ec31188888a2e33acda0ecc8fd10a853a9
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

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

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

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
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    pegawai: 'pegawai',
    pelatihan: 'pelatihan',
    pengalaman_kerja: 'pengalaman_kerja',
    SuratTugas: 'SuratTugas',
    PegawaiSuratTugas: 'PegawaiSuratTugas'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "pegawai" | "pelatihan" | "pengalaman_kerja" | "suratTugas" | "pegawaiSuratTugas"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      pegawai: {
        payload: Prisma.$pegawaiPayload<ExtArgs>
        fields: Prisma.pegawaiFieldRefs
        operations: {
          findUnique: {
            args: Prisma.pegawaiFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pegawaiPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.pegawaiFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pegawaiPayload>
          }
          findFirst: {
            args: Prisma.pegawaiFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pegawaiPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.pegawaiFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pegawaiPayload>
          }
          findMany: {
            args: Prisma.pegawaiFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pegawaiPayload>[]
          }
          create: {
            args: Prisma.pegawaiCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pegawaiPayload>
          }
          createMany: {
            args: Prisma.pegawaiCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.pegawaiCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pegawaiPayload>[]
          }
          delete: {
            args: Prisma.pegawaiDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pegawaiPayload>
          }
          update: {
            args: Prisma.pegawaiUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pegawaiPayload>
          }
          deleteMany: {
            args: Prisma.pegawaiDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.pegawaiUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.pegawaiUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pegawaiPayload>[]
          }
          upsert: {
            args: Prisma.pegawaiUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pegawaiPayload>
          }
          aggregate: {
            args: Prisma.PegawaiAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePegawai>
          }
          groupBy: {
            args: Prisma.pegawaiGroupByArgs<ExtArgs>
            result: $Utils.Optional<PegawaiGroupByOutputType>[]
          }
          count: {
            args: Prisma.pegawaiCountArgs<ExtArgs>
            result: $Utils.Optional<PegawaiCountAggregateOutputType> | number
          }
        }
      }
      pelatihan: {
        payload: Prisma.$pelatihanPayload<ExtArgs>
        fields: Prisma.pelatihanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.pelatihanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pelatihanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.pelatihanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pelatihanPayload>
          }
          findFirst: {
            args: Prisma.pelatihanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pelatihanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.pelatihanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pelatihanPayload>
          }
          findMany: {
            args: Prisma.pelatihanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pelatihanPayload>[]
          }
          create: {
            args: Prisma.pelatihanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pelatihanPayload>
          }
          createMany: {
            args: Prisma.pelatihanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.pelatihanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pelatihanPayload>[]
          }
          delete: {
            args: Prisma.pelatihanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pelatihanPayload>
          }
          update: {
            args: Prisma.pelatihanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pelatihanPayload>
          }
          deleteMany: {
            args: Prisma.pelatihanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.pelatihanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.pelatihanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pelatihanPayload>[]
          }
          upsert: {
            args: Prisma.pelatihanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pelatihanPayload>
          }
          aggregate: {
            args: Prisma.PelatihanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePelatihan>
          }
          groupBy: {
            args: Prisma.pelatihanGroupByArgs<ExtArgs>
            result: $Utils.Optional<PelatihanGroupByOutputType>[]
          }
          count: {
            args: Prisma.pelatihanCountArgs<ExtArgs>
            result: $Utils.Optional<PelatihanCountAggregateOutputType> | number
          }
        }
      }
      pengalaman_kerja: {
        payload: Prisma.$pengalaman_kerjaPayload<ExtArgs>
        fields: Prisma.pengalaman_kerjaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.pengalaman_kerjaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pengalaman_kerjaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.pengalaman_kerjaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pengalaman_kerjaPayload>
          }
          findFirst: {
            args: Prisma.pengalaman_kerjaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pengalaman_kerjaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.pengalaman_kerjaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pengalaman_kerjaPayload>
          }
          findMany: {
            args: Prisma.pengalaman_kerjaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pengalaman_kerjaPayload>[]
          }
          create: {
            args: Prisma.pengalaman_kerjaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pengalaman_kerjaPayload>
          }
          createMany: {
            args: Prisma.pengalaman_kerjaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.pengalaman_kerjaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pengalaman_kerjaPayload>[]
          }
          delete: {
            args: Prisma.pengalaman_kerjaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pengalaman_kerjaPayload>
          }
          update: {
            args: Prisma.pengalaman_kerjaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pengalaman_kerjaPayload>
          }
          deleteMany: {
            args: Prisma.pengalaman_kerjaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.pengalaman_kerjaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.pengalaman_kerjaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pengalaman_kerjaPayload>[]
          }
          upsert: {
            args: Prisma.pengalaman_kerjaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pengalaman_kerjaPayload>
          }
          aggregate: {
            args: Prisma.Pengalaman_kerjaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePengalaman_kerja>
          }
          groupBy: {
            args: Prisma.pengalaman_kerjaGroupByArgs<ExtArgs>
            result: $Utils.Optional<Pengalaman_kerjaGroupByOutputType>[]
          }
          count: {
            args: Prisma.pengalaman_kerjaCountArgs<ExtArgs>
            result: $Utils.Optional<Pengalaman_kerjaCountAggregateOutputType> | number
          }
        }
      }
      SuratTugas: {
        payload: Prisma.$SuratTugasPayload<ExtArgs>
        fields: Prisma.SuratTugasFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SuratTugasFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuratTugasPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SuratTugasFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuratTugasPayload>
          }
          findFirst: {
            args: Prisma.SuratTugasFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuratTugasPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SuratTugasFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuratTugasPayload>
          }
          findMany: {
            args: Prisma.SuratTugasFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuratTugasPayload>[]
          }
          create: {
            args: Prisma.SuratTugasCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuratTugasPayload>
          }
          createMany: {
            args: Prisma.SuratTugasCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SuratTugasCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuratTugasPayload>[]
          }
          delete: {
            args: Prisma.SuratTugasDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuratTugasPayload>
          }
          update: {
            args: Prisma.SuratTugasUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuratTugasPayload>
          }
          deleteMany: {
            args: Prisma.SuratTugasDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SuratTugasUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SuratTugasUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuratTugasPayload>[]
          }
          upsert: {
            args: Prisma.SuratTugasUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuratTugasPayload>
          }
          aggregate: {
            args: Prisma.SuratTugasAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSuratTugas>
          }
          groupBy: {
            args: Prisma.SuratTugasGroupByArgs<ExtArgs>
            result: $Utils.Optional<SuratTugasGroupByOutputType>[]
          }
          count: {
            args: Prisma.SuratTugasCountArgs<ExtArgs>
            result: $Utils.Optional<SuratTugasCountAggregateOutputType> | number
          }
        }
      }
      PegawaiSuratTugas: {
        payload: Prisma.$PegawaiSuratTugasPayload<ExtArgs>
        fields: Prisma.PegawaiSuratTugasFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PegawaiSuratTugasFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PegawaiSuratTugasPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PegawaiSuratTugasFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PegawaiSuratTugasPayload>
          }
          findFirst: {
            args: Prisma.PegawaiSuratTugasFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PegawaiSuratTugasPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PegawaiSuratTugasFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PegawaiSuratTugasPayload>
          }
          findMany: {
            args: Prisma.PegawaiSuratTugasFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PegawaiSuratTugasPayload>[]
          }
          create: {
            args: Prisma.PegawaiSuratTugasCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PegawaiSuratTugasPayload>
          }
          createMany: {
            args: Prisma.PegawaiSuratTugasCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PegawaiSuratTugasCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PegawaiSuratTugasPayload>[]
          }
          delete: {
            args: Prisma.PegawaiSuratTugasDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PegawaiSuratTugasPayload>
          }
          update: {
            args: Prisma.PegawaiSuratTugasUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PegawaiSuratTugasPayload>
          }
          deleteMany: {
            args: Prisma.PegawaiSuratTugasDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PegawaiSuratTugasUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PegawaiSuratTugasUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PegawaiSuratTugasPayload>[]
          }
          upsert: {
            args: Prisma.PegawaiSuratTugasUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PegawaiSuratTugasPayload>
          }
          aggregate: {
            args: Prisma.PegawaiSuratTugasAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePegawaiSuratTugas>
          }
          groupBy: {
            args: Prisma.PegawaiSuratTugasGroupByArgs<ExtArgs>
            result: $Utils.Optional<PegawaiSuratTugasGroupByOutputType>[]
          }
          count: {
            args: Prisma.PegawaiSuratTugasCountArgs<ExtArgs>
            result: $Utils.Optional<PegawaiSuratTugasCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
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
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    pegawai?: pegawaiOmit
    pelatihan?: pelatihanOmit
    pengalaman_kerja?: pengalaman_kerjaOmit
    suratTugas?: SuratTugasOmit
    pegawaiSuratTugas?: PegawaiSuratTugasOmit
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
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

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
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

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
   * Count Type PegawaiCountOutputType
   */

  export type PegawaiCountOutputType = {
    pegawai_surat_tugas: number
    pelatihan: number
    pengalaman_kerja: number
  }

  export type PegawaiCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai_surat_tugas?: boolean | PegawaiCountOutputTypeCountPegawai_surat_tugasArgs
    pelatihan?: boolean | PegawaiCountOutputTypeCountPelatihanArgs
    pengalaman_kerja?: boolean | PegawaiCountOutputTypeCountPengalaman_kerjaArgs
  }

  // Custom InputTypes
  /**
   * PegawaiCountOutputType without action
   */
  export type PegawaiCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiCountOutputType
     */
    select?: PegawaiCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PegawaiCountOutputType without action
   */
  export type PegawaiCountOutputTypeCountPegawai_surat_tugasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PegawaiSuratTugasWhereInput
  }

  /**
   * PegawaiCountOutputType without action
   */
  export type PegawaiCountOutputTypeCountPelatihanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pelatihanWhereInput
  }

  /**
   * PegawaiCountOutputType without action
   */
  export type PegawaiCountOutputTypeCountPengalaman_kerjaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pengalaman_kerjaWhereInput
  }


  /**
   * Count Type SuratTugasCountOutputType
   */

  export type SuratTugasCountOutputType = {
    pegawai_surat_tugas: number
  }

  export type SuratTugasCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai_surat_tugas?: boolean | SuratTugasCountOutputTypeCountPegawai_surat_tugasArgs
  }

  // Custom InputTypes
  /**
   * SuratTugasCountOutputType without action
   */
  export type SuratTugasCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugasCountOutputType
     */
    select?: SuratTugasCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SuratTugasCountOutputType without action
   */
  export type SuratTugasCountOutputTypeCountPegawai_surat_tugasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PegawaiSuratTugasWhereInput
  }


  /**
   * Models
   */

  /**
   * Model pegawai
   */

  export type AggregatePegawai = {
    _count: PegawaiCountAggregateOutputType | null
    _avg: PegawaiAvgAggregateOutputType | null
    _sum: PegawaiSumAggregateOutputType | null
    _min: PegawaiMinAggregateOutputType | null
    _max: PegawaiMaxAggregateOutputType | null
  }

  export type PegawaiAvgAggregateOutputType = {
    id: number | null
  }

  export type PegawaiSumAggregateOutputType = {
    id: number | null
  }

  export type PegawaiMinAggregateOutputType = {
    nup: string | null
    nama_pegawai: string | null
    status_pegawai: string | null
    jabatan: string | null
    tempat_lahir: string | null
    tanggal_lahir: Date | null
    alamat: string | null
    warga_negara: string | null
    agama: string | null
    no_telepon: string | null
    email: string | null
    password: string | null
    role: string | null
    username: string | null
    id: number | null
    nik: string | null
  }

  export type PegawaiMaxAggregateOutputType = {
    nup: string | null
    nama_pegawai: string | null
    status_pegawai: string | null
    jabatan: string | null
    tempat_lahir: string | null
    tanggal_lahir: Date | null
    alamat: string | null
    warga_negara: string | null
    agama: string | null
    no_telepon: string | null
    email: string | null
    password: string | null
    role: string | null
    username: string | null
    id: number | null
    nik: string | null
  }

  export type PegawaiCountAggregateOutputType = {
    nup: number
    nama_pegawai: number
    status_pegawai: number
    jabatan: number
    tempat_lahir: number
    tanggal_lahir: number
    alamat: number
    warga_negara: number
    agama: number
    no_telepon: number
    email: number
    password: number
    role: number
    username: number
    id: number
    nik: number
    _all: number
  }


  export type PegawaiAvgAggregateInputType = {
    id?: true
  }

  export type PegawaiSumAggregateInputType = {
    id?: true
  }

  export type PegawaiMinAggregateInputType = {
    nup?: true
    nama_pegawai?: true
    status_pegawai?: true
    jabatan?: true
    tempat_lahir?: true
    tanggal_lahir?: true
    alamat?: true
    warga_negara?: true
    agama?: true
    no_telepon?: true
    email?: true
    password?: true
    role?: true
    username?: true
    id?: true
    nik?: true
  }

  export type PegawaiMaxAggregateInputType = {
    nup?: true
    nama_pegawai?: true
    status_pegawai?: true
    jabatan?: true
    tempat_lahir?: true
    tanggal_lahir?: true
    alamat?: true
    warga_negara?: true
    agama?: true
    no_telepon?: true
    email?: true
    password?: true
    role?: true
    username?: true
    id?: true
    nik?: true
  }

  export type PegawaiCountAggregateInputType = {
    nup?: true
    nama_pegawai?: true
    status_pegawai?: true
    jabatan?: true
    tempat_lahir?: true
    tanggal_lahir?: true
    alamat?: true
    warga_negara?: true
    agama?: true
    no_telepon?: true
    email?: true
    password?: true
    role?: true
    username?: true
    id?: true
    nik?: true
    _all?: true
  }

  export type PegawaiAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pegawai to aggregate.
     */
    where?: pegawaiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pegawais to fetch.
     */
    orderBy?: pegawaiOrderByWithRelationInput | pegawaiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: pegawaiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pegawais from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pegawais.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned pegawais
    **/
    _count?: true | PegawaiCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PegawaiAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PegawaiSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PegawaiMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PegawaiMaxAggregateInputType
  }

  export type GetPegawaiAggregateType<T extends PegawaiAggregateArgs> = {
        [P in keyof T & keyof AggregatePegawai]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePegawai[P]>
      : GetScalarType<T[P], AggregatePegawai[P]>
  }




  export type pegawaiGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pegawaiWhereInput
    orderBy?: pegawaiOrderByWithAggregationInput | pegawaiOrderByWithAggregationInput[]
    by: PegawaiScalarFieldEnum[] | PegawaiScalarFieldEnum
    having?: pegawaiScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PegawaiCountAggregateInputType | true
    _avg?: PegawaiAvgAggregateInputType
    _sum?: PegawaiSumAggregateInputType
    _min?: PegawaiMinAggregateInputType
    _max?: PegawaiMaxAggregateInputType
  }

  export type PegawaiGroupByOutputType = {
    nup: string
    nama_pegawai: string
    status_pegawai: string | null
    jabatan: string | null
    tempat_lahir: string | null
    tanggal_lahir: Date | null
    alamat: string | null
    warga_negara: string | null
    agama: string | null
    no_telepon: string | null
    email: string | null
    password: string
    role: string | null
    username: string | null
    id: number
    nik: string | null
    _count: PegawaiCountAggregateOutputType | null
    _avg: PegawaiAvgAggregateOutputType | null
    _sum: PegawaiSumAggregateOutputType | null
    _min: PegawaiMinAggregateOutputType | null
    _max: PegawaiMaxAggregateOutputType | null
  }

  type GetPegawaiGroupByPayload<T extends pegawaiGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PegawaiGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PegawaiGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PegawaiGroupByOutputType[P]>
            : GetScalarType<T[P], PegawaiGroupByOutputType[P]>
        }
      >
    >


  export type pegawaiSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    nup?: boolean
    nama_pegawai?: boolean
    status_pegawai?: boolean
    jabatan?: boolean
    tempat_lahir?: boolean
    tanggal_lahir?: boolean
    alamat?: boolean
    warga_negara?: boolean
    agama?: boolean
    no_telepon?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    username?: boolean
    id?: boolean
    nik?: boolean
    pegawai_surat_tugas?: boolean | pegawai$pegawai_surat_tugasArgs<ExtArgs>
    pelatihan?: boolean | pegawai$pelatihanArgs<ExtArgs>
    pengalaman_kerja?: boolean | pegawai$pengalaman_kerjaArgs<ExtArgs>
    _count?: boolean | PegawaiCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pegawai"]>

  export type pegawaiSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    nup?: boolean
    nama_pegawai?: boolean
    status_pegawai?: boolean
    jabatan?: boolean
    tempat_lahir?: boolean
    tanggal_lahir?: boolean
    alamat?: boolean
    warga_negara?: boolean
    agama?: boolean
    no_telepon?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    username?: boolean
    id?: boolean
    nik?: boolean
  }, ExtArgs["result"]["pegawai"]>

  export type pegawaiSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    nup?: boolean
    nama_pegawai?: boolean
    status_pegawai?: boolean
    jabatan?: boolean
    tempat_lahir?: boolean
    tanggal_lahir?: boolean
    alamat?: boolean
    warga_negara?: boolean
    agama?: boolean
    no_telepon?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    username?: boolean
    id?: boolean
    nik?: boolean
  }, ExtArgs["result"]["pegawai"]>

  export type pegawaiSelectScalar = {
    nup?: boolean
    nama_pegawai?: boolean
    status_pegawai?: boolean
    jabatan?: boolean
    tempat_lahir?: boolean
    tanggal_lahir?: boolean
    alamat?: boolean
    warga_negara?: boolean
    agama?: boolean
    no_telepon?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    username?: boolean
    id?: boolean
    nik?: boolean
  }

  export type pegawaiOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"nup" | "nama_pegawai" | "status_pegawai" | "jabatan" | "tempat_lahir" | "tanggal_lahir" | "alamat" | "warga_negara" | "agama" | "no_telepon" | "email" | "password" | "role" | "username" | "id" | "nik", ExtArgs["result"]["pegawai"]>
  export type pegawaiInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai_surat_tugas?: boolean | pegawai$pegawai_surat_tugasArgs<ExtArgs>
    pelatihan?: boolean | pegawai$pelatihanArgs<ExtArgs>
    pengalaman_kerja?: boolean | pegawai$pengalaman_kerjaArgs<ExtArgs>
    _count?: boolean | PegawaiCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type pegawaiIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type pegawaiIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $pegawaiPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "pegawai"
    objects: {
      pegawai_surat_tugas: Prisma.$PegawaiSuratTugasPayload<ExtArgs>[]
      pelatihan: Prisma.$pelatihanPayload<ExtArgs>[]
      pengalaman_kerja: Prisma.$pengalaman_kerjaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      nup: string
      nama_pegawai: string
      status_pegawai: string | null
      jabatan: string | null
      tempat_lahir: string | null
      tanggal_lahir: Date | null
      alamat: string | null
      warga_negara: string | null
      agama: string | null
      no_telepon: string | null
      email: string | null
      password: string
      role: string | null
      username: string | null
      id: number
      nik: string | null
    }, ExtArgs["result"]["pegawai"]>
    composites: {}
  }

  type pegawaiGetPayload<S extends boolean | null | undefined | pegawaiDefaultArgs> = $Result.GetResult<Prisma.$pegawaiPayload, S>

  type pegawaiCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<pegawaiFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PegawaiCountAggregateInputType | true
    }

  export interface pegawaiDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['pegawai'], meta: { name: 'pegawai' } }
    /**
     * Find zero or one Pegawai that matches the filter.
     * @param {pegawaiFindUniqueArgs} args - Arguments to find a Pegawai
     * @example
     * // Get one Pegawai
     * const pegawai = await prisma.pegawai.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends pegawaiFindUniqueArgs>(args: SelectSubset<T, pegawaiFindUniqueArgs<ExtArgs>>): Prisma__pegawaiClient<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pegawai that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {pegawaiFindUniqueOrThrowArgs} args - Arguments to find a Pegawai
     * @example
     * // Get one Pegawai
     * const pegawai = await prisma.pegawai.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends pegawaiFindUniqueOrThrowArgs>(args: SelectSubset<T, pegawaiFindUniqueOrThrowArgs<ExtArgs>>): Prisma__pegawaiClient<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pegawai that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pegawaiFindFirstArgs} args - Arguments to find a Pegawai
     * @example
     * // Get one Pegawai
     * const pegawai = await prisma.pegawai.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends pegawaiFindFirstArgs>(args?: SelectSubset<T, pegawaiFindFirstArgs<ExtArgs>>): Prisma__pegawaiClient<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pegawai that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pegawaiFindFirstOrThrowArgs} args - Arguments to find a Pegawai
     * @example
     * // Get one Pegawai
     * const pegawai = await prisma.pegawai.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends pegawaiFindFirstOrThrowArgs>(args?: SelectSubset<T, pegawaiFindFirstOrThrowArgs<ExtArgs>>): Prisma__pegawaiClient<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pegawais that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pegawaiFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pegawais
     * const pegawais = await prisma.pegawai.findMany()
     * 
     * // Get first 10 Pegawais
     * const pegawais = await prisma.pegawai.findMany({ take: 10 })
     * 
     * // Only select the `nup`
     * const pegawaiWithNupOnly = await prisma.pegawai.findMany({ select: { nup: true } })
     * 
     */
    findMany<T extends pegawaiFindManyArgs>(args?: SelectSubset<T, pegawaiFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pegawai.
     * @param {pegawaiCreateArgs} args - Arguments to create a Pegawai.
     * @example
     * // Create one Pegawai
     * const Pegawai = await prisma.pegawai.create({
     *   data: {
     *     // ... data to create a Pegawai
     *   }
     * })
     * 
     */
    create<T extends pegawaiCreateArgs>(args: SelectSubset<T, pegawaiCreateArgs<ExtArgs>>): Prisma__pegawaiClient<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pegawais.
     * @param {pegawaiCreateManyArgs} args - Arguments to create many Pegawais.
     * @example
     * // Create many Pegawais
     * const pegawai = await prisma.pegawai.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends pegawaiCreateManyArgs>(args?: SelectSubset<T, pegawaiCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pegawais and returns the data saved in the database.
     * @param {pegawaiCreateManyAndReturnArgs} args - Arguments to create many Pegawais.
     * @example
     * // Create many Pegawais
     * const pegawai = await prisma.pegawai.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pegawais and only return the `nup`
     * const pegawaiWithNupOnly = await prisma.pegawai.createManyAndReturn({
     *   select: { nup: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends pegawaiCreateManyAndReturnArgs>(args?: SelectSubset<T, pegawaiCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pegawai.
     * @param {pegawaiDeleteArgs} args - Arguments to delete one Pegawai.
     * @example
     * // Delete one Pegawai
     * const Pegawai = await prisma.pegawai.delete({
     *   where: {
     *     // ... filter to delete one Pegawai
     *   }
     * })
     * 
     */
    delete<T extends pegawaiDeleteArgs>(args: SelectSubset<T, pegawaiDeleteArgs<ExtArgs>>): Prisma__pegawaiClient<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pegawai.
     * @param {pegawaiUpdateArgs} args - Arguments to update one Pegawai.
     * @example
     * // Update one Pegawai
     * const pegawai = await prisma.pegawai.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends pegawaiUpdateArgs>(args: SelectSubset<T, pegawaiUpdateArgs<ExtArgs>>): Prisma__pegawaiClient<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pegawais.
     * @param {pegawaiDeleteManyArgs} args - Arguments to filter Pegawais to delete.
     * @example
     * // Delete a few Pegawais
     * const { count } = await prisma.pegawai.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends pegawaiDeleteManyArgs>(args?: SelectSubset<T, pegawaiDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pegawais.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pegawaiUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pegawais
     * const pegawai = await prisma.pegawai.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends pegawaiUpdateManyArgs>(args: SelectSubset<T, pegawaiUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pegawais and returns the data updated in the database.
     * @param {pegawaiUpdateManyAndReturnArgs} args - Arguments to update many Pegawais.
     * @example
     * // Update many Pegawais
     * const pegawai = await prisma.pegawai.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pegawais and only return the `nup`
     * const pegawaiWithNupOnly = await prisma.pegawai.updateManyAndReturn({
     *   select: { nup: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends pegawaiUpdateManyAndReturnArgs>(args: SelectSubset<T, pegawaiUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pegawai.
     * @param {pegawaiUpsertArgs} args - Arguments to update or create a Pegawai.
     * @example
     * // Update or create a Pegawai
     * const pegawai = await prisma.pegawai.upsert({
     *   create: {
     *     // ... data to create a Pegawai
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pegawai we want to update
     *   }
     * })
     */
    upsert<T extends pegawaiUpsertArgs>(args: SelectSubset<T, pegawaiUpsertArgs<ExtArgs>>): Prisma__pegawaiClient<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pegawais.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pegawaiCountArgs} args - Arguments to filter Pegawais to count.
     * @example
     * // Count the number of Pegawais
     * const count = await prisma.pegawai.count({
     *   where: {
     *     // ... the filter for the Pegawais we want to count
     *   }
     * })
    **/
    count<T extends pegawaiCountArgs>(
      args?: Subset<T, pegawaiCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PegawaiCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pegawai.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PegawaiAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PegawaiAggregateArgs>(args: Subset<T, PegawaiAggregateArgs>): Prisma.PrismaPromise<GetPegawaiAggregateType<T>>

    /**
     * Group by Pegawai.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pegawaiGroupByArgs} args - Group by arguments.
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
      T extends pegawaiGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: pegawaiGroupByArgs['orderBy'] }
        : { orderBy?: pegawaiGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, pegawaiGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPegawaiGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the pegawai model
   */
  readonly fields: pegawaiFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for pegawai.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__pegawaiClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pegawai_surat_tugas<T extends pegawai$pegawai_surat_tugasArgs<ExtArgs> = {}>(args?: Subset<T, pegawai$pegawai_surat_tugasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pelatihan<T extends pegawai$pelatihanArgs<ExtArgs> = {}>(args?: Subset<T, pegawai$pelatihanArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pelatihanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pengalaman_kerja<T extends pegawai$pengalaman_kerjaArgs<ExtArgs> = {}>(args?: Subset<T, pegawai$pengalaman_kerjaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pengalaman_kerjaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the pegawai model
   */
  interface pegawaiFieldRefs {
    readonly nup: FieldRef<"pegawai", 'String'>
    readonly nama_pegawai: FieldRef<"pegawai", 'String'>
    readonly status_pegawai: FieldRef<"pegawai", 'String'>
    readonly jabatan: FieldRef<"pegawai", 'String'>
    readonly tempat_lahir: FieldRef<"pegawai", 'String'>
    readonly tanggal_lahir: FieldRef<"pegawai", 'DateTime'>
    readonly alamat: FieldRef<"pegawai", 'String'>
    readonly warga_negara: FieldRef<"pegawai", 'String'>
    readonly agama: FieldRef<"pegawai", 'String'>
    readonly no_telepon: FieldRef<"pegawai", 'String'>
    readonly email: FieldRef<"pegawai", 'String'>
    readonly password: FieldRef<"pegawai", 'String'>
    readonly role: FieldRef<"pegawai", 'String'>
    readonly username: FieldRef<"pegawai", 'String'>
    readonly id: FieldRef<"pegawai", 'Int'>
    readonly nik: FieldRef<"pegawai", 'String'>
  }
    

  // Custom InputTypes
  /**
   * pegawai findUnique
   */
  export type pegawaiFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pegawaiInclude<ExtArgs> | null
    /**
     * Filter, which pegawai to fetch.
     */
    where: pegawaiWhereUniqueInput
  }

  /**
   * pegawai findUniqueOrThrow
   */
  export type pegawaiFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pegawaiInclude<ExtArgs> | null
    /**
     * Filter, which pegawai to fetch.
     */
    where: pegawaiWhereUniqueInput
  }

  /**
   * pegawai findFirst
   */
  export type pegawaiFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pegawaiInclude<ExtArgs> | null
    /**
     * Filter, which pegawai to fetch.
     */
    where?: pegawaiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pegawais to fetch.
     */
    orderBy?: pegawaiOrderByWithRelationInput | pegawaiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pegawais.
     */
    cursor?: pegawaiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pegawais from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pegawais.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pegawais.
     */
    distinct?: PegawaiScalarFieldEnum | PegawaiScalarFieldEnum[]
  }

  /**
   * pegawai findFirstOrThrow
   */
  export type pegawaiFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pegawaiInclude<ExtArgs> | null
    /**
     * Filter, which pegawai to fetch.
     */
    where?: pegawaiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pegawais to fetch.
     */
    orderBy?: pegawaiOrderByWithRelationInput | pegawaiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pegawais.
     */
    cursor?: pegawaiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pegawais from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pegawais.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pegawais.
     */
    distinct?: PegawaiScalarFieldEnum | PegawaiScalarFieldEnum[]
  }

  /**
   * pegawai findMany
   */
  export type pegawaiFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pegawaiInclude<ExtArgs> | null
    /**
     * Filter, which pegawais to fetch.
     */
    where?: pegawaiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pegawais to fetch.
     */
    orderBy?: pegawaiOrderByWithRelationInput | pegawaiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing pegawais.
     */
    cursor?: pegawaiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pegawais from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pegawais.
     */
    skip?: number
    distinct?: PegawaiScalarFieldEnum | PegawaiScalarFieldEnum[]
  }

  /**
   * pegawai create
   */
  export type pegawaiCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pegawaiInclude<ExtArgs> | null
    /**
     * The data needed to create a pegawai.
     */
    data: XOR<pegawaiCreateInput, pegawaiUncheckedCreateInput>
  }

  /**
   * pegawai createMany
   */
  export type pegawaiCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many pegawais.
     */
    data: pegawaiCreateManyInput | pegawaiCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * pegawai createManyAndReturn
   */
  export type pegawaiCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * The data used to create many pegawais.
     */
    data: pegawaiCreateManyInput | pegawaiCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * pegawai update
   */
  export type pegawaiUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pegawaiInclude<ExtArgs> | null
    /**
     * The data needed to update a pegawai.
     */
    data: XOR<pegawaiUpdateInput, pegawaiUncheckedUpdateInput>
    /**
     * Choose, which pegawai to update.
     */
    where: pegawaiWhereUniqueInput
  }

  /**
   * pegawai updateMany
   */
  export type pegawaiUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update pegawais.
     */
    data: XOR<pegawaiUpdateManyMutationInput, pegawaiUncheckedUpdateManyInput>
    /**
     * Filter which pegawais to update
     */
    where?: pegawaiWhereInput
    /**
     * Limit how many pegawais to update.
     */
    limit?: number
  }

  /**
   * pegawai updateManyAndReturn
   */
  export type pegawaiUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * The data used to update pegawais.
     */
    data: XOR<pegawaiUpdateManyMutationInput, pegawaiUncheckedUpdateManyInput>
    /**
     * Filter which pegawais to update
     */
    where?: pegawaiWhereInput
    /**
     * Limit how many pegawais to update.
     */
    limit?: number
  }

  /**
   * pegawai upsert
   */
  export type pegawaiUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pegawaiInclude<ExtArgs> | null
    /**
     * The filter to search for the pegawai to update in case it exists.
     */
    where: pegawaiWhereUniqueInput
    /**
     * In case the pegawai found by the `where` argument doesn't exist, create a new pegawai with this data.
     */
    create: XOR<pegawaiCreateInput, pegawaiUncheckedCreateInput>
    /**
     * In case the pegawai was found with the provided `where` argument, update it with this data.
     */
    update: XOR<pegawaiUpdateInput, pegawaiUncheckedUpdateInput>
  }

  /**
   * pegawai delete
   */
  export type pegawaiDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pegawaiInclude<ExtArgs> | null
    /**
     * Filter which pegawai to delete.
     */
    where: pegawaiWhereUniqueInput
  }

  /**
   * pegawai deleteMany
   */
  export type pegawaiDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pegawais to delete
     */
    where?: pegawaiWhereInput
    /**
     * Limit how many pegawais to delete.
     */
    limit?: number
  }

  /**
   * pegawai.pegawai_surat_tugas
   */
  export type pegawai$pegawai_surat_tugasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasInclude<ExtArgs> | null
    where?: PegawaiSuratTugasWhereInput
    orderBy?: PegawaiSuratTugasOrderByWithRelationInput | PegawaiSuratTugasOrderByWithRelationInput[]
    cursor?: PegawaiSuratTugasWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PegawaiSuratTugasScalarFieldEnum | PegawaiSuratTugasScalarFieldEnum[]
  }

  /**
   * pegawai.pelatihan
   */
  export type pegawai$pelatihanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanInclude<ExtArgs> | null
    where?: pelatihanWhereInput
    orderBy?: pelatihanOrderByWithRelationInput | pelatihanOrderByWithRelationInput[]
    cursor?: pelatihanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PelatihanScalarFieldEnum | PelatihanScalarFieldEnum[]
  }

  /**
   * pegawai.pengalaman_kerja
   */
  export type pegawai$pengalaman_kerjaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaInclude<ExtArgs> | null
    where?: pengalaman_kerjaWhereInput
    orderBy?: pengalaman_kerjaOrderByWithRelationInput | pengalaman_kerjaOrderByWithRelationInput[]
    cursor?: pengalaman_kerjaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Pengalaman_kerjaScalarFieldEnum | Pengalaman_kerjaScalarFieldEnum[]
  }

  /**
   * pegawai without action
   */
  export type pegawaiDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pegawaiInclude<ExtArgs> | null
  }


  /**
   * Model pelatihan
   */

  export type AggregatePelatihan = {
    _count: PelatihanCountAggregateOutputType | null
    _avg: PelatihanAvgAggregateOutputType | null
    _sum: PelatihanSumAggregateOutputType | null
    _min: PelatihanMinAggregateOutputType | null
    _max: PelatihanMaxAggregateOutputType | null
  }

  export type PelatihanAvgAggregateOutputType = {
    id_pelatihan: number | null
    tahun: number | null
  }

  export type PelatihanSumAggregateOutputType = {
    id_pelatihan: number | null
    tahun: number | null
  }

  export type PelatihanMinAggregateOutputType = {
    id_pelatihan: number | null
    nup: string | null
    nama_pelatihan: string | null
    penyelenggara: string | null
    nomor_sertifikat: string | null
    file_sertifikat: string | null
    tanggal_awal: Date | null
    masa_berlaku: Date | null
    status: $Enums.StatusPelatihan | null
    keterangan_utilisasi: string | null
    tahun: number | null
    tanggal_akhir: Date | null
  }

  export type PelatihanMaxAggregateOutputType = {
    id_pelatihan: number | null
    nup: string | null
    nama_pelatihan: string | null
    penyelenggara: string | null
    nomor_sertifikat: string | null
    file_sertifikat: string | null
    tanggal_awal: Date | null
    masa_berlaku: Date | null
    status: $Enums.StatusPelatihan | null
    keterangan_utilisasi: string | null
    tahun: number | null
    tanggal_akhir: Date | null
  }

  export type PelatihanCountAggregateOutputType = {
    id_pelatihan: number
    nup: number
    nama_pelatihan: number
    penyelenggara: number
    nomor_sertifikat: number
    file_sertifikat: number
    tanggal_awal: number
    masa_berlaku: number
    status: number
    keterangan_utilisasi: number
    tahun: number
    tanggal_akhir: number
    _all: number
  }


  export type PelatihanAvgAggregateInputType = {
    id_pelatihan?: true
    tahun?: true
  }

  export type PelatihanSumAggregateInputType = {
    id_pelatihan?: true
    tahun?: true
  }

  export type PelatihanMinAggregateInputType = {
    id_pelatihan?: true
    nup?: true
    nama_pelatihan?: true
    penyelenggara?: true
    nomor_sertifikat?: true
    file_sertifikat?: true
    tanggal_awal?: true
    masa_berlaku?: true
    status?: true
    keterangan_utilisasi?: true
    tahun?: true
    tanggal_akhir?: true
  }

  export type PelatihanMaxAggregateInputType = {
    id_pelatihan?: true
    nup?: true
    nama_pelatihan?: true
    penyelenggara?: true
    nomor_sertifikat?: true
    file_sertifikat?: true
    tanggal_awal?: true
    masa_berlaku?: true
    status?: true
    keterangan_utilisasi?: true
    tahun?: true
    tanggal_akhir?: true
  }

  export type PelatihanCountAggregateInputType = {
    id_pelatihan?: true
    nup?: true
    nama_pelatihan?: true
    penyelenggara?: true
    nomor_sertifikat?: true
    file_sertifikat?: true
    tanggal_awal?: true
    masa_berlaku?: true
    status?: true
    keterangan_utilisasi?: true
    tahun?: true
    tanggal_akhir?: true
    _all?: true
  }

  export type PelatihanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pelatihan to aggregate.
     */
    where?: pelatihanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pelatihans to fetch.
     */
    orderBy?: pelatihanOrderByWithRelationInput | pelatihanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: pelatihanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pelatihans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pelatihans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned pelatihans
    **/
    _count?: true | PelatihanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PelatihanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PelatihanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PelatihanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PelatihanMaxAggregateInputType
  }

  export type GetPelatihanAggregateType<T extends PelatihanAggregateArgs> = {
        [P in keyof T & keyof AggregatePelatihan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePelatihan[P]>
      : GetScalarType<T[P], AggregatePelatihan[P]>
  }




  export type pelatihanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pelatihanWhereInput
    orderBy?: pelatihanOrderByWithAggregationInput | pelatihanOrderByWithAggregationInput[]
    by: PelatihanScalarFieldEnum[] | PelatihanScalarFieldEnum
    having?: pelatihanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PelatihanCountAggregateInputType | true
    _avg?: PelatihanAvgAggregateInputType
    _sum?: PelatihanSumAggregateInputType
    _min?: PelatihanMinAggregateInputType
    _max?: PelatihanMaxAggregateInputType
  }

  export type PelatihanGroupByOutputType = {
    id_pelatihan: number
    nup: string | null
    nama_pelatihan: string | null
    penyelenggara: string | null
    nomor_sertifikat: string | null
    file_sertifikat: string | null
    tanggal_awal: Date | null
    masa_berlaku: Date | null
    status: $Enums.StatusPelatihan
    keterangan_utilisasi: string | null
    tahun: number | null
    tanggal_akhir: Date | null
    _count: PelatihanCountAggregateOutputType | null
    _avg: PelatihanAvgAggregateOutputType | null
    _sum: PelatihanSumAggregateOutputType | null
    _min: PelatihanMinAggregateOutputType | null
    _max: PelatihanMaxAggregateOutputType | null
  }

  type GetPelatihanGroupByPayload<T extends pelatihanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PelatihanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PelatihanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PelatihanGroupByOutputType[P]>
            : GetScalarType<T[P], PelatihanGroupByOutputType[P]>
        }
      >
    >


  export type pelatihanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_pelatihan?: boolean
    nup?: boolean
    nama_pelatihan?: boolean
    penyelenggara?: boolean
    nomor_sertifikat?: boolean
    file_sertifikat?: boolean
    tanggal_awal?: boolean
    masa_berlaku?: boolean
    status?: boolean
    keterangan_utilisasi?: boolean
    tahun?: boolean
    tanggal_akhir?: boolean
    pegawai?: boolean | pelatihan$pegawaiArgs<ExtArgs>
  }, ExtArgs["result"]["pelatihan"]>

  export type pelatihanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_pelatihan?: boolean
    nup?: boolean
    nama_pelatihan?: boolean
    penyelenggara?: boolean
    nomor_sertifikat?: boolean
    file_sertifikat?: boolean
    tanggal_awal?: boolean
    masa_berlaku?: boolean
    status?: boolean
    keterangan_utilisasi?: boolean
    tahun?: boolean
    tanggal_akhir?: boolean
    pegawai?: boolean | pelatihan$pegawaiArgs<ExtArgs>
  }, ExtArgs["result"]["pelatihan"]>

  export type pelatihanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_pelatihan?: boolean
    nup?: boolean
    nama_pelatihan?: boolean
    penyelenggara?: boolean
    nomor_sertifikat?: boolean
    file_sertifikat?: boolean
    tanggal_awal?: boolean
    masa_berlaku?: boolean
    status?: boolean
    keterangan_utilisasi?: boolean
    tahun?: boolean
    tanggal_akhir?: boolean
    pegawai?: boolean | pelatihan$pegawaiArgs<ExtArgs>
  }, ExtArgs["result"]["pelatihan"]>

  export type pelatihanSelectScalar = {
    id_pelatihan?: boolean
    nup?: boolean
    nama_pelatihan?: boolean
    penyelenggara?: boolean
    nomor_sertifikat?: boolean
    file_sertifikat?: boolean
    tanggal_awal?: boolean
    masa_berlaku?: boolean
    status?: boolean
    keterangan_utilisasi?: boolean
    tahun?: boolean
    tanggal_akhir?: boolean
  }

  export type pelatihanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_pelatihan" | "nup" | "nama_pelatihan" | "penyelenggara" | "nomor_sertifikat" | "file_sertifikat" | "tanggal_awal" | "masa_berlaku" | "status" | "keterangan_utilisasi" | "tahun" | "tanggal_akhir", ExtArgs["result"]["pelatihan"]>
  export type pelatihanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai?: boolean | pelatihan$pegawaiArgs<ExtArgs>
  }
  export type pelatihanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai?: boolean | pelatihan$pegawaiArgs<ExtArgs>
  }
  export type pelatihanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai?: boolean | pelatihan$pegawaiArgs<ExtArgs>
  }

  export type $pelatihanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "pelatihan"
    objects: {
      pegawai: Prisma.$pegawaiPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id_pelatihan: number
      nup: string | null
      nama_pelatihan: string | null
      penyelenggara: string | null
      nomor_sertifikat: string | null
      file_sertifikat: string | null
      tanggal_awal: Date | null
      masa_berlaku: Date | null
      status: $Enums.StatusPelatihan
      keterangan_utilisasi: string | null
      tahun: number | null
      tanggal_akhir: Date | null
    }, ExtArgs["result"]["pelatihan"]>
    composites: {}
  }

  type pelatihanGetPayload<S extends boolean | null | undefined | pelatihanDefaultArgs> = $Result.GetResult<Prisma.$pelatihanPayload, S>

  type pelatihanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<pelatihanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PelatihanCountAggregateInputType | true
    }

  export interface pelatihanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['pelatihan'], meta: { name: 'pelatihan' } }
    /**
     * Find zero or one Pelatihan that matches the filter.
     * @param {pelatihanFindUniqueArgs} args - Arguments to find a Pelatihan
     * @example
     * // Get one Pelatihan
     * const pelatihan = await prisma.pelatihan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends pelatihanFindUniqueArgs>(args: SelectSubset<T, pelatihanFindUniqueArgs<ExtArgs>>): Prisma__pelatihanClient<$Result.GetResult<Prisma.$pelatihanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pelatihan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {pelatihanFindUniqueOrThrowArgs} args - Arguments to find a Pelatihan
     * @example
     * // Get one Pelatihan
     * const pelatihan = await prisma.pelatihan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends pelatihanFindUniqueOrThrowArgs>(args: SelectSubset<T, pelatihanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__pelatihanClient<$Result.GetResult<Prisma.$pelatihanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pelatihan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pelatihanFindFirstArgs} args - Arguments to find a Pelatihan
     * @example
     * // Get one Pelatihan
     * const pelatihan = await prisma.pelatihan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends pelatihanFindFirstArgs>(args?: SelectSubset<T, pelatihanFindFirstArgs<ExtArgs>>): Prisma__pelatihanClient<$Result.GetResult<Prisma.$pelatihanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pelatihan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pelatihanFindFirstOrThrowArgs} args - Arguments to find a Pelatihan
     * @example
     * // Get one Pelatihan
     * const pelatihan = await prisma.pelatihan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends pelatihanFindFirstOrThrowArgs>(args?: SelectSubset<T, pelatihanFindFirstOrThrowArgs<ExtArgs>>): Prisma__pelatihanClient<$Result.GetResult<Prisma.$pelatihanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pelatihans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pelatihanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pelatihans
     * const pelatihans = await prisma.pelatihan.findMany()
     * 
     * // Get first 10 Pelatihans
     * const pelatihans = await prisma.pelatihan.findMany({ take: 10 })
     * 
     * // Only select the `id_pelatihan`
     * const pelatihanWithId_pelatihanOnly = await prisma.pelatihan.findMany({ select: { id_pelatihan: true } })
     * 
     */
    findMany<T extends pelatihanFindManyArgs>(args?: SelectSubset<T, pelatihanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pelatihanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pelatihan.
     * @param {pelatihanCreateArgs} args - Arguments to create a Pelatihan.
     * @example
     * // Create one Pelatihan
     * const Pelatihan = await prisma.pelatihan.create({
     *   data: {
     *     // ... data to create a Pelatihan
     *   }
     * })
     * 
     */
    create<T extends pelatihanCreateArgs>(args: SelectSubset<T, pelatihanCreateArgs<ExtArgs>>): Prisma__pelatihanClient<$Result.GetResult<Prisma.$pelatihanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pelatihans.
     * @param {pelatihanCreateManyArgs} args - Arguments to create many Pelatihans.
     * @example
     * // Create many Pelatihans
     * const pelatihan = await prisma.pelatihan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends pelatihanCreateManyArgs>(args?: SelectSubset<T, pelatihanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pelatihans and returns the data saved in the database.
     * @param {pelatihanCreateManyAndReturnArgs} args - Arguments to create many Pelatihans.
     * @example
     * // Create many Pelatihans
     * const pelatihan = await prisma.pelatihan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pelatihans and only return the `id_pelatihan`
     * const pelatihanWithId_pelatihanOnly = await prisma.pelatihan.createManyAndReturn({
     *   select: { id_pelatihan: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends pelatihanCreateManyAndReturnArgs>(args?: SelectSubset<T, pelatihanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pelatihanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pelatihan.
     * @param {pelatihanDeleteArgs} args - Arguments to delete one Pelatihan.
     * @example
     * // Delete one Pelatihan
     * const Pelatihan = await prisma.pelatihan.delete({
     *   where: {
     *     // ... filter to delete one Pelatihan
     *   }
     * })
     * 
     */
    delete<T extends pelatihanDeleteArgs>(args: SelectSubset<T, pelatihanDeleteArgs<ExtArgs>>): Prisma__pelatihanClient<$Result.GetResult<Prisma.$pelatihanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pelatihan.
     * @param {pelatihanUpdateArgs} args - Arguments to update one Pelatihan.
     * @example
     * // Update one Pelatihan
     * const pelatihan = await prisma.pelatihan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends pelatihanUpdateArgs>(args: SelectSubset<T, pelatihanUpdateArgs<ExtArgs>>): Prisma__pelatihanClient<$Result.GetResult<Prisma.$pelatihanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pelatihans.
     * @param {pelatihanDeleteManyArgs} args - Arguments to filter Pelatihans to delete.
     * @example
     * // Delete a few Pelatihans
     * const { count } = await prisma.pelatihan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends pelatihanDeleteManyArgs>(args?: SelectSubset<T, pelatihanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pelatihans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pelatihanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pelatihans
     * const pelatihan = await prisma.pelatihan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends pelatihanUpdateManyArgs>(args: SelectSubset<T, pelatihanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pelatihans and returns the data updated in the database.
     * @param {pelatihanUpdateManyAndReturnArgs} args - Arguments to update many Pelatihans.
     * @example
     * // Update many Pelatihans
     * const pelatihan = await prisma.pelatihan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pelatihans and only return the `id_pelatihan`
     * const pelatihanWithId_pelatihanOnly = await prisma.pelatihan.updateManyAndReturn({
     *   select: { id_pelatihan: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends pelatihanUpdateManyAndReturnArgs>(args: SelectSubset<T, pelatihanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pelatihanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pelatihan.
     * @param {pelatihanUpsertArgs} args - Arguments to update or create a Pelatihan.
     * @example
     * // Update or create a Pelatihan
     * const pelatihan = await prisma.pelatihan.upsert({
     *   create: {
     *     // ... data to create a Pelatihan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pelatihan we want to update
     *   }
     * })
     */
    upsert<T extends pelatihanUpsertArgs>(args: SelectSubset<T, pelatihanUpsertArgs<ExtArgs>>): Prisma__pelatihanClient<$Result.GetResult<Prisma.$pelatihanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pelatihans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pelatihanCountArgs} args - Arguments to filter Pelatihans to count.
     * @example
     * // Count the number of Pelatihans
     * const count = await prisma.pelatihan.count({
     *   where: {
     *     // ... the filter for the Pelatihans we want to count
     *   }
     * })
    **/
    count<T extends pelatihanCountArgs>(
      args?: Subset<T, pelatihanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PelatihanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pelatihan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PelatihanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PelatihanAggregateArgs>(args: Subset<T, PelatihanAggregateArgs>): Prisma.PrismaPromise<GetPelatihanAggregateType<T>>

    /**
     * Group by Pelatihan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pelatihanGroupByArgs} args - Group by arguments.
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
      T extends pelatihanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: pelatihanGroupByArgs['orderBy'] }
        : { orderBy?: pelatihanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, pelatihanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPelatihanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the pelatihan model
   */
  readonly fields: pelatihanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for pelatihan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__pelatihanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pegawai<T extends pelatihan$pegawaiArgs<ExtArgs> = {}>(args?: Subset<T, pelatihan$pegawaiArgs<ExtArgs>>): Prisma__pegawaiClient<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the pelatihan model
   */
  interface pelatihanFieldRefs {
    readonly id_pelatihan: FieldRef<"pelatihan", 'Int'>
    readonly nup: FieldRef<"pelatihan", 'String'>
    readonly nama_pelatihan: FieldRef<"pelatihan", 'String'>
    readonly penyelenggara: FieldRef<"pelatihan", 'String'>
    readonly nomor_sertifikat: FieldRef<"pelatihan", 'String'>
    readonly file_sertifikat: FieldRef<"pelatihan", 'String'>
    readonly tanggal_awal: FieldRef<"pelatihan", 'DateTime'>
    readonly masa_berlaku: FieldRef<"pelatihan", 'DateTime'>
    readonly status: FieldRef<"pelatihan", 'StatusPelatihan'>
    readonly keterangan_utilisasi: FieldRef<"pelatihan", 'String'>
    readonly tahun: FieldRef<"pelatihan", 'Int'>
    readonly tanggal_akhir: FieldRef<"pelatihan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * pelatihan findUnique
   */
  export type pelatihanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanInclude<ExtArgs> | null
    /**
     * Filter, which pelatihan to fetch.
     */
    where: pelatihanWhereUniqueInput
  }

  /**
   * pelatihan findUniqueOrThrow
   */
  export type pelatihanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanInclude<ExtArgs> | null
    /**
     * Filter, which pelatihan to fetch.
     */
    where: pelatihanWhereUniqueInput
  }

  /**
   * pelatihan findFirst
   */
  export type pelatihanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanInclude<ExtArgs> | null
    /**
     * Filter, which pelatihan to fetch.
     */
    where?: pelatihanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pelatihans to fetch.
     */
    orderBy?: pelatihanOrderByWithRelationInput | pelatihanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pelatihans.
     */
    cursor?: pelatihanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pelatihans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pelatihans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pelatihans.
     */
    distinct?: PelatihanScalarFieldEnum | PelatihanScalarFieldEnum[]
  }

  /**
   * pelatihan findFirstOrThrow
   */
  export type pelatihanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanInclude<ExtArgs> | null
    /**
     * Filter, which pelatihan to fetch.
     */
    where?: pelatihanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pelatihans to fetch.
     */
    orderBy?: pelatihanOrderByWithRelationInput | pelatihanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pelatihans.
     */
    cursor?: pelatihanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pelatihans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pelatihans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pelatihans.
     */
    distinct?: PelatihanScalarFieldEnum | PelatihanScalarFieldEnum[]
  }

  /**
   * pelatihan findMany
   */
  export type pelatihanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanInclude<ExtArgs> | null
    /**
     * Filter, which pelatihans to fetch.
     */
    where?: pelatihanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pelatihans to fetch.
     */
    orderBy?: pelatihanOrderByWithRelationInput | pelatihanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing pelatihans.
     */
    cursor?: pelatihanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pelatihans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pelatihans.
     */
    skip?: number
    distinct?: PelatihanScalarFieldEnum | PelatihanScalarFieldEnum[]
  }

  /**
   * pelatihan create
   */
  export type pelatihanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanInclude<ExtArgs> | null
    /**
     * The data needed to create a pelatihan.
     */
    data: XOR<pelatihanCreateInput, pelatihanUncheckedCreateInput>
  }

  /**
   * pelatihan createMany
   */
  export type pelatihanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many pelatihans.
     */
    data: pelatihanCreateManyInput | pelatihanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * pelatihan createManyAndReturn
   */
  export type pelatihanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * The data used to create many pelatihans.
     */
    data: pelatihanCreateManyInput | pelatihanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * pelatihan update
   */
  export type pelatihanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanInclude<ExtArgs> | null
    /**
     * The data needed to update a pelatihan.
     */
    data: XOR<pelatihanUpdateInput, pelatihanUncheckedUpdateInput>
    /**
     * Choose, which pelatihan to update.
     */
    where: pelatihanWhereUniqueInput
  }

  /**
   * pelatihan updateMany
   */
  export type pelatihanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update pelatihans.
     */
    data: XOR<pelatihanUpdateManyMutationInput, pelatihanUncheckedUpdateManyInput>
    /**
     * Filter which pelatihans to update
     */
    where?: pelatihanWhereInput
    /**
     * Limit how many pelatihans to update.
     */
    limit?: number
  }

  /**
   * pelatihan updateManyAndReturn
   */
  export type pelatihanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * The data used to update pelatihans.
     */
    data: XOR<pelatihanUpdateManyMutationInput, pelatihanUncheckedUpdateManyInput>
    /**
     * Filter which pelatihans to update
     */
    where?: pelatihanWhereInput
    /**
     * Limit how many pelatihans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * pelatihan upsert
   */
  export type pelatihanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanInclude<ExtArgs> | null
    /**
     * The filter to search for the pelatihan to update in case it exists.
     */
    where: pelatihanWhereUniqueInput
    /**
     * In case the pelatihan found by the `where` argument doesn't exist, create a new pelatihan with this data.
     */
    create: XOR<pelatihanCreateInput, pelatihanUncheckedCreateInput>
    /**
     * In case the pelatihan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<pelatihanUpdateInput, pelatihanUncheckedUpdateInput>
  }

  /**
   * pelatihan delete
   */
  export type pelatihanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanInclude<ExtArgs> | null
    /**
     * Filter which pelatihan to delete.
     */
    where: pelatihanWhereUniqueInput
  }

  /**
   * pelatihan deleteMany
   */
  export type pelatihanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pelatihans to delete
     */
    where?: pelatihanWhereInput
    /**
     * Limit how many pelatihans to delete.
     */
    limit?: number
  }

  /**
   * pelatihan.pegawai
   */
  export type pelatihan$pegawaiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pegawaiInclude<ExtArgs> | null
    where?: pegawaiWhereInput
  }

  /**
   * pelatihan without action
   */
  export type pelatihanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pelatihan
     */
    select?: pelatihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pelatihan
     */
    omit?: pelatihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pelatihanInclude<ExtArgs> | null
  }


  /**
   * Model pengalaman_kerja
   */

  export type AggregatePengalaman_kerja = {
    _count: Pengalaman_kerjaCountAggregateOutputType | null
    _avg: Pengalaman_kerjaAvgAggregateOutputType | null
    _sum: Pengalaman_kerjaSumAggregateOutputType | null
    _min: Pengalaman_kerjaMinAggregateOutputType | null
    _max: Pengalaman_kerjaMaxAggregateOutputType | null
  }

  export type Pengalaman_kerjaAvgAggregateOutputType = {
    id_pengalaman: number | null
    tahun: number | null
  }

  export type Pengalaman_kerjaSumAggregateOutputType = {
    id_pengalaman: number | null
    tahun: number | null
  }

  export type Pengalaman_kerjaMinAggregateOutputType = {
    id_pengalaman: number | null
    nup: string | null
    tahun: number | null
    pengalaman_kerja: string | null
    perusahaan: string | null
  }

  export type Pengalaman_kerjaMaxAggregateOutputType = {
    id_pengalaman: number | null
    nup: string | null
    tahun: number | null
    pengalaman_kerja: string | null
    perusahaan: string | null
  }

  export type Pengalaman_kerjaCountAggregateOutputType = {
    id_pengalaman: number
    nup: number
    tahun: number
    pengalaman_kerja: number
    perusahaan: number
    _all: number
  }


  export type Pengalaman_kerjaAvgAggregateInputType = {
    id_pengalaman?: true
    tahun?: true
  }

  export type Pengalaman_kerjaSumAggregateInputType = {
    id_pengalaman?: true
    tahun?: true
  }

  export type Pengalaman_kerjaMinAggregateInputType = {
    id_pengalaman?: true
    nup?: true
    tahun?: true
    pengalaman_kerja?: true
    perusahaan?: true
  }

  export type Pengalaman_kerjaMaxAggregateInputType = {
    id_pengalaman?: true
    nup?: true
    tahun?: true
    pengalaman_kerja?: true
    perusahaan?: true
  }

  export type Pengalaman_kerjaCountAggregateInputType = {
    id_pengalaman?: true
    nup?: true
    tahun?: true
    pengalaman_kerja?: true
    perusahaan?: true
    _all?: true
  }

  export type Pengalaman_kerjaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pengalaman_kerja to aggregate.
     */
    where?: pengalaman_kerjaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pengalaman_kerjas to fetch.
     */
    orderBy?: pengalaman_kerjaOrderByWithRelationInput | pengalaman_kerjaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: pengalaman_kerjaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pengalaman_kerjas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pengalaman_kerjas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned pengalaman_kerjas
    **/
    _count?: true | Pengalaman_kerjaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Pengalaman_kerjaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Pengalaman_kerjaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Pengalaman_kerjaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Pengalaman_kerjaMaxAggregateInputType
  }

  export type GetPengalaman_kerjaAggregateType<T extends Pengalaman_kerjaAggregateArgs> = {
        [P in keyof T & keyof AggregatePengalaman_kerja]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePengalaman_kerja[P]>
      : GetScalarType<T[P], AggregatePengalaman_kerja[P]>
  }




  export type pengalaman_kerjaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pengalaman_kerjaWhereInput
    orderBy?: pengalaman_kerjaOrderByWithAggregationInput | pengalaman_kerjaOrderByWithAggregationInput[]
    by: Pengalaman_kerjaScalarFieldEnum[] | Pengalaman_kerjaScalarFieldEnum
    having?: pengalaman_kerjaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Pengalaman_kerjaCountAggregateInputType | true
    _avg?: Pengalaman_kerjaAvgAggregateInputType
    _sum?: Pengalaman_kerjaSumAggregateInputType
    _min?: Pengalaman_kerjaMinAggregateInputType
    _max?: Pengalaman_kerjaMaxAggregateInputType
  }

  export type Pengalaman_kerjaGroupByOutputType = {
    id_pengalaman: number
    nup: string | null
    tahun: number | null
    pengalaman_kerja: string | null
    perusahaan: string | null
    _count: Pengalaman_kerjaCountAggregateOutputType | null
    _avg: Pengalaman_kerjaAvgAggregateOutputType | null
    _sum: Pengalaman_kerjaSumAggregateOutputType | null
    _min: Pengalaman_kerjaMinAggregateOutputType | null
    _max: Pengalaman_kerjaMaxAggregateOutputType | null
  }

  type GetPengalaman_kerjaGroupByPayload<T extends pengalaman_kerjaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Pengalaman_kerjaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Pengalaman_kerjaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Pengalaman_kerjaGroupByOutputType[P]>
            : GetScalarType<T[P], Pengalaman_kerjaGroupByOutputType[P]>
        }
      >
    >


  export type pengalaman_kerjaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_pengalaman?: boolean
    nup?: boolean
    tahun?: boolean
    pengalaman_kerja?: boolean
    perusahaan?: boolean
    pegawai?: boolean | pengalaman_kerja$pegawaiArgs<ExtArgs>
  }, ExtArgs["result"]["pengalaman_kerja"]>

  export type pengalaman_kerjaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_pengalaman?: boolean
    nup?: boolean
    tahun?: boolean
    pengalaman_kerja?: boolean
    perusahaan?: boolean
    pegawai?: boolean | pengalaman_kerja$pegawaiArgs<ExtArgs>
  }, ExtArgs["result"]["pengalaman_kerja"]>

  export type pengalaman_kerjaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_pengalaman?: boolean
    nup?: boolean
    tahun?: boolean
    pengalaman_kerja?: boolean
    perusahaan?: boolean
    pegawai?: boolean | pengalaman_kerja$pegawaiArgs<ExtArgs>
  }, ExtArgs["result"]["pengalaman_kerja"]>

  export type pengalaman_kerjaSelectScalar = {
    id_pengalaman?: boolean
    nup?: boolean
    tahun?: boolean
    pengalaman_kerja?: boolean
    perusahaan?: boolean
  }

  export type pengalaman_kerjaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_pengalaman" | "nup" | "tahun" | "pengalaman_kerja" | "perusahaan", ExtArgs["result"]["pengalaman_kerja"]>
  export type pengalaman_kerjaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai?: boolean | pengalaman_kerja$pegawaiArgs<ExtArgs>
  }
  export type pengalaman_kerjaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai?: boolean | pengalaman_kerja$pegawaiArgs<ExtArgs>
  }
  export type pengalaman_kerjaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai?: boolean | pengalaman_kerja$pegawaiArgs<ExtArgs>
  }

  export type $pengalaman_kerjaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "pengalaman_kerja"
    objects: {
      pegawai: Prisma.$pegawaiPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id_pengalaman: number
      nup: string | null
      tahun: number | null
      pengalaman_kerja: string | null
      perusahaan: string | null
    }, ExtArgs["result"]["pengalaman_kerja"]>
    composites: {}
  }

  type pengalaman_kerjaGetPayload<S extends boolean | null | undefined | pengalaman_kerjaDefaultArgs> = $Result.GetResult<Prisma.$pengalaman_kerjaPayload, S>

  type pengalaman_kerjaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<pengalaman_kerjaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Pengalaman_kerjaCountAggregateInputType | true
    }

  export interface pengalaman_kerjaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['pengalaman_kerja'], meta: { name: 'pengalaman_kerja' } }
    /**
     * Find zero or one Pengalaman_kerja that matches the filter.
     * @param {pengalaman_kerjaFindUniqueArgs} args - Arguments to find a Pengalaman_kerja
     * @example
     * // Get one Pengalaman_kerja
     * const pengalaman_kerja = await prisma.pengalaman_kerja.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends pengalaman_kerjaFindUniqueArgs>(args: SelectSubset<T, pengalaman_kerjaFindUniqueArgs<ExtArgs>>): Prisma__pengalaman_kerjaClient<$Result.GetResult<Prisma.$pengalaman_kerjaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pengalaman_kerja that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {pengalaman_kerjaFindUniqueOrThrowArgs} args - Arguments to find a Pengalaman_kerja
     * @example
     * // Get one Pengalaman_kerja
     * const pengalaman_kerja = await prisma.pengalaman_kerja.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends pengalaman_kerjaFindUniqueOrThrowArgs>(args: SelectSubset<T, pengalaman_kerjaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__pengalaman_kerjaClient<$Result.GetResult<Prisma.$pengalaman_kerjaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pengalaman_kerja that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pengalaman_kerjaFindFirstArgs} args - Arguments to find a Pengalaman_kerja
     * @example
     * // Get one Pengalaman_kerja
     * const pengalaman_kerja = await prisma.pengalaman_kerja.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends pengalaman_kerjaFindFirstArgs>(args?: SelectSubset<T, pengalaman_kerjaFindFirstArgs<ExtArgs>>): Prisma__pengalaman_kerjaClient<$Result.GetResult<Prisma.$pengalaman_kerjaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pengalaman_kerja that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pengalaman_kerjaFindFirstOrThrowArgs} args - Arguments to find a Pengalaman_kerja
     * @example
     * // Get one Pengalaman_kerja
     * const pengalaman_kerja = await prisma.pengalaman_kerja.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends pengalaman_kerjaFindFirstOrThrowArgs>(args?: SelectSubset<T, pengalaman_kerjaFindFirstOrThrowArgs<ExtArgs>>): Prisma__pengalaman_kerjaClient<$Result.GetResult<Prisma.$pengalaman_kerjaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pengalaman_kerjas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pengalaman_kerjaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pengalaman_kerjas
     * const pengalaman_kerjas = await prisma.pengalaman_kerja.findMany()
     * 
     * // Get first 10 Pengalaman_kerjas
     * const pengalaman_kerjas = await prisma.pengalaman_kerja.findMany({ take: 10 })
     * 
     * // Only select the `id_pengalaman`
     * const pengalaman_kerjaWithId_pengalamanOnly = await prisma.pengalaman_kerja.findMany({ select: { id_pengalaman: true } })
     * 
     */
    findMany<T extends pengalaman_kerjaFindManyArgs>(args?: SelectSubset<T, pengalaman_kerjaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pengalaman_kerjaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pengalaman_kerja.
     * @param {pengalaman_kerjaCreateArgs} args - Arguments to create a Pengalaman_kerja.
     * @example
     * // Create one Pengalaman_kerja
     * const Pengalaman_kerja = await prisma.pengalaman_kerja.create({
     *   data: {
     *     // ... data to create a Pengalaman_kerja
     *   }
     * })
     * 
     */
    create<T extends pengalaman_kerjaCreateArgs>(args: SelectSubset<T, pengalaman_kerjaCreateArgs<ExtArgs>>): Prisma__pengalaman_kerjaClient<$Result.GetResult<Prisma.$pengalaman_kerjaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pengalaman_kerjas.
     * @param {pengalaman_kerjaCreateManyArgs} args - Arguments to create many Pengalaman_kerjas.
     * @example
     * // Create many Pengalaman_kerjas
     * const pengalaman_kerja = await prisma.pengalaman_kerja.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends pengalaman_kerjaCreateManyArgs>(args?: SelectSubset<T, pengalaman_kerjaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pengalaman_kerjas and returns the data saved in the database.
     * @param {pengalaman_kerjaCreateManyAndReturnArgs} args - Arguments to create many Pengalaman_kerjas.
     * @example
     * // Create many Pengalaman_kerjas
     * const pengalaman_kerja = await prisma.pengalaman_kerja.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pengalaman_kerjas and only return the `id_pengalaman`
     * const pengalaman_kerjaWithId_pengalamanOnly = await prisma.pengalaman_kerja.createManyAndReturn({
     *   select: { id_pengalaman: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends pengalaman_kerjaCreateManyAndReturnArgs>(args?: SelectSubset<T, pengalaman_kerjaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pengalaman_kerjaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pengalaman_kerja.
     * @param {pengalaman_kerjaDeleteArgs} args - Arguments to delete one Pengalaman_kerja.
     * @example
     * // Delete one Pengalaman_kerja
     * const Pengalaman_kerja = await prisma.pengalaman_kerja.delete({
     *   where: {
     *     // ... filter to delete one Pengalaman_kerja
     *   }
     * })
     * 
     */
    delete<T extends pengalaman_kerjaDeleteArgs>(args: SelectSubset<T, pengalaman_kerjaDeleteArgs<ExtArgs>>): Prisma__pengalaman_kerjaClient<$Result.GetResult<Prisma.$pengalaman_kerjaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pengalaman_kerja.
     * @param {pengalaman_kerjaUpdateArgs} args - Arguments to update one Pengalaman_kerja.
     * @example
     * // Update one Pengalaman_kerja
     * const pengalaman_kerja = await prisma.pengalaman_kerja.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends pengalaman_kerjaUpdateArgs>(args: SelectSubset<T, pengalaman_kerjaUpdateArgs<ExtArgs>>): Prisma__pengalaman_kerjaClient<$Result.GetResult<Prisma.$pengalaman_kerjaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pengalaman_kerjas.
     * @param {pengalaman_kerjaDeleteManyArgs} args - Arguments to filter Pengalaman_kerjas to delete.
     * @example
     * // Delete a few Pengalaman_kerjas
     * const { count } = await prisma.pengalaman_kerja.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends pengalaman_kerjaDeleteManyArgs>(args?: SelectSubset<T, pengalaman_kerjaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pengalaman_kerjas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pengalaman_kerjaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pengalaman_kerjas
     * const pengalaman_kerja = await prisma.pengalaman_kerja.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends pengalaman_kerjaUpdateManyArgs>(args: SelectSubset<T, pengalaman_kerjaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pengalaman_kerjas and returns the data updated in the database.
     * @param {pengalaman_kerjaUpdateManyAndReturnArgs} args - Arguments to update many Pengalaman_kerjas.
     * @example
     * // Update many Pengalaman_kerjas
     * const pengalaman_kerja = await prisma.pengalaman_kerja.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pengalaman_kerjas and only return the `id_pengalaman`
     * const pengalaman_kerjaWithId_pengalamanOnly = await prisma.pengalaman_kerja.updateManyAndReturn({
     *   select: { id_pengalaman: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends pengalaman_kerjaUpdateManyAndReturnArgs>(args: SelectSubset<T, pengalaman_kerjaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pengalaman_kerjaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pengalaman_kerja.
     * @param {pengalaman_kerjaUpsertArgs} args - Arguments to update or create a Pengalaman_kerja.
     * @example
     * // Update or create a Pengalaman_kerja
     * const pengalaman_kerja = await prisma.pengalaman_kerja.upsert({
     *   create: {
     *     // ... data to create a Pengalaman_kerja
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pengalaman_kerja we want to update
     *   }
     * })
     */
    upsert<T extends pengalaman_kerjaUpsertArgs>(args: SelectSubset<T, pengalaman_kerjaUpsertArgs<ExtArgs>>): Prisma__pengalaman_kerjaClient<$Result.GetResult<Prisma.$pengalaman_kerjaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pengalaman_kerjas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pengalaman_kerjaCountArgs} args - Arguments to filter Pengalaman_kerjas to count.
     * @example
     * // Count the number of Pengalaman_kerjas
     * const count = await prisma.pengalaman_kerja.count({
     *   where: {
     *     // ... the filter for the Pengalaman_kerjas we want to count
     *   }
     * })
    **/
    count<T extends pengalaman_kerjaCountArgs>(
      args?: Subset<T, pengalaman_kerjaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Pengalaman_kerjaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pengalaman_kerja.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Pengalaman_kerjaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Pengalaman_kerjaAggregateArgs>(args: Subset<T, Pengalaman_kerjaAggregateArgs>): Prisma.PrismaPromise<GetPengalaman_kerjaAggregateType<T>>

    /**
     * Group by Pengalaman_kerja.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pengalaman_kerjaGroupByArgs} args - Group by arguments.
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
      T extends pengalaman_kerjaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: pengalaman_kerjaGroupByArgs['orderBy'] }
        : { orderBy?: pengalaman_kerjaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, pengalaman_kerjaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPengalaman_kerjaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the pengalaman_kerja model
   */
  readonly fields: pengalaman_kerjaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for pengalaman_kerja.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__pengalaman_kerjaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pegawai<T extends pengalaman_kerja$pegawaiArgs<ExtArgs> = {}>(args?: Subset<T, pengalaman_kerja$pegawaiArgs<ExtArgs>>): Prisma__pegawaiClient<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the pengalaman_kerja model
   */
  interface pengalaman_kerjaFieldRefs {
    readonly id_pengalaman: FieldRef<"pengalaman_kerja", 'Int'>
    readonly nup: FieldRef<"pengalaman_kerja", 'String'>
    readonly tahun: FieldRef<"pengalaman_kerja", 'Int'>
    readonly pengalaman_kerja: FieldRef<"pengalaman_kerja", 'String'>
    readonly perusahaan: FieldRef<"pengalaman_kerja", 'String'>
  }
    

  // Custom InputTypes
  /**
   * pengalaman_kerja findUnique
   */
  export type pengalaman_kerjaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaInclude<ExtArgs> | null
    /**
     * Filter, which pengalaman_kerja to fetch.
     */
    where: pengalaman_kerjaWhereUniqueInput
  }

  /**
   * pengalaman_kerja findUniqueOrThrow
   */
  export type pengalaman_kerjaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaInclude<ExtArgs> | null
    /**
     * Filter, which pengalaman_kerja to fetch.
     */
    where: pengalaman_kerjaWhereUniqueInput
  }

  /**
   * pengalaman_kerja findFirst
   */
  export type pengalaman_kerjaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaInclude<ExtArgs> | null
    /**
     * Filter, which pengalaman_kerja to fetch.
     */
    where?: pengalaman_kerjaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pengalaman_kerjas to fetch.
     */
    orderBy?: pengalaman_kerjaOrderByWithRelationInput | pengalaman_kerjaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pengalaman_kerjas.
     */
    cursor?: pengalaman_kerjaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pengalaman_kerjas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pengalaman_kerjas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pengalaman_kerjas.
     */
    distinct?: Pengalaman_kerjaScalarFieldEnum | Pengalaman_kerjaScalarFieldEnum[]
  }

  /**
   * pengalaman_kerja findFirstOrThrow
   */
  export type pengalaman_kerjaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaInclude<ExtArgs> | null
    /**
     * Filter, which pengalaman_kerja to fetch.
     */
    where?: pengalaman_kerjaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pengalaman_kerjas to fetch.
     */
    orderBy?: pengalaman_kerjaOrderByWithRelationInput | pengalaman_kerjaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pengalaman_kerjas.
     */
    cursor?: pengalaman_kerjaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pengalaman_kerjas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pengalaman_kerjas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pengalaman_kerjas.
     */
    distinct?: Pengalaman_kerjaScalarFieldEnum | Pengalaman_kerjaScalarFieldEnum[]
  }

  /**
   * pengalaman_kerja findMany
   */
  export type pengalaman_kerjaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaInclude<ExtArgs> | null
    /**
     * Filter, which pengalaman_kerjas to fetch.
     */
    where?: pengalaman_kerjaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pengalaman_kerjas to fetch.
     */
    orderBy?: pengalaman_kerjaOrderByWithRelationInput | pengalaman_kerjaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing pengalaman_kerjas.
     */
    cursor?: pengalaman_kerjaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pengalaman_kerjas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pengalaman_kerjas.
     */
    skip?: number
    distinct?: Pengalaman_kerjaScalarFieldEnum | Pengalaman_kerjaScalarFieldEnum[]
  }

  /**
   * pengalaman_kerja create
   */
  export type pengalaman_kerjaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaInclude<ExtArgs> | null
    /**
     * The data needed to create a pengalaman_kerja.
     */
    data?: XOR<pengalaman_kerjaCreateInput, pengalaman_kerjaUncheckedCreateInput>
  }

  /**
   * pengalaman_kerja createMany
   */
  export type pengalaman_kerjaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many pengalaman_kerjas.
     */
    data: pengalaman_kerjaCreateManyInput | pengalaman_kerjaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * pengalaman_kerja createManyAndReturn
   */
  export type pengalaman_kerjaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * The data used to create many pengalaman_kerjas.
     */
    data: pengalaman_kerjaCreateManyInput | pengalaman_kerjaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * pengalaman_kerja update
   */
  export type pengalaman_kerjaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaInclude<ExtArgs> | null
    /**
     * The data needed to update a pengalaman_kerja.
     */
    data: XOR<pengalaman_kerjaUpdateInput, pengalaman_kerjaUncheckedUpdateInput>
    /**
     * Choose, which pengalaman_kerja to update.
     */
    where: pengalaman_kerjaWhereUniqueInput
  }

  /**
   * pengalaman_kerja updateMany
   */
  export type pengalaman_kerjaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update pengalaman_kerjas.
     */
    data: XOR<pengalaman_kerjaUpdateManyMutationInput, pengalaman_kerjaUncheckedUpdateManyInput>
    /**
     * Filter which pengalaman_kerjas to update
     */
    where?: pengalaman_kerjaWhereInput
    /**
     * Limit how many pengalaman_kerjas to update.
     */
    limit?: number
  }

  /**
   * pengalaman_kerja updateManyAndReturn
   */
  export type pengalaman_kerjaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * The data used to update pengalaman_kerjas.
     */
    data: XOR<pengalaman_kerjaUpdateManyMutationInput, pengalaman_kerjaUncheckedUpdateManyInput>
    /**
     * Filter which pengalaman_kerjas to update
     */
    where?: pengalaman_kerjaWhereInput
    /**
     * Limit how many pengalaman_kerjas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * pengalaman_kerja upsert
   */
  export type pengalaman_kerjaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaInclude<ExtArgs> | null
    /**
     * The filter to search for the pengalaman_kerja to update in case it exists.
     */
    where: pengalaman_kerjaWhereUniqueInput
    /**
     * In case the pengalaman_kerja found by the `where` argument doesn't exist, create a new pengalaman_kerja with this data.
     */
    create: XOR<pengalaman_kerjaCreateInput, pengalaman_kerjaUncheckedCreateInput>
    /**
     * In case the pengalaman_kerja was found with the provided `where` argument, update it with this data.
     */
    update: XOR<pengalaman_kerjaUpdateInput, pengalaman_kerjaUncheckedUpdateInput>
  }

  /**
   * pengalaman_kerja delete
   */
  export type pengalaman_kerjaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaInclude<ExtArgs> | null
    /**
     * Filter which pengalaman_kerja to delete.
     */
    where: pengalaman_kerjaWhereUniqueInput
  }

  /**
   * pengalaman_kerja deleteMany
   */
  export type pengalaman_kerjaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pengalaman_kerjas to delete
     */
    where?: pengalaman_kerjaWhereInput
    /**
     * Limit how many pengalaman_kerjas to delete.
     */
    limit?: number
  }

  /**
   * pengalaman_kerja.pegawai
   */
  export type pengalaman_kerja$pegawaiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pegawai
     */
    select?: pegawaiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pegawai
     */
    omit?: pegawaiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pegawaiInclude<ExtArgs> | null
    where?: pegawaiWhereInput
  }

  /**
   * pengalaman_kerja without action
   */
  export type pengalaman_kerjaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pengalaman_kerja
     */
    select?: pengalaman_kerjaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pengalaman_kerja
     */
    omit?: pengalaman_kerjaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: pengalaman_kerjaInclude<ExtArgs> | null
  }


  /**
   * Model SuratTugas
   */

  export type AggregateSuratTugas = {
    _count: SuratTugasCountAggregateOutputType | null
    _avg: SuratTugasAvgAggregateOutputType | null
    _sum: SuratTugasSumAggregateOutputType | null
    _min: SuratTugasMinAggregateOutputType | null
    _max: SuratTugasMaxAggregateOutputType | null
  }

  export type SuratTugasAvgAggregateOutputType = {
    id: number | null
  }

  export type SuratTugasSumAggregateOutputType = {
    id: number | null
  }

  export type SuratTugasMinAggregateOutputType = {
    id: number | null
    nomor_surat: string | null
    klien: string | null
    pekerjaan: string | null
    status_pekerjaan: string | null
    no_service_order: string | null
    bidang_pekerjaan: string | null
    tanggal_berangkat: Date | null
    tanggal_kembali: Date | null
    transportasi_operasional: boolean | null
    transportasi_ditanggung_klien: boolean | null
    transportasi_asal_tujuan: boolean | null
    transportasi_dinas: boolean | null
    tiket: boolean | null
    penginapan: boolean | null
    keterangan_lain: string | null
    createdAt: Date | null
    updatedAt: Date | null
    spi: string | null
    wbs: string | null
    status: $Enums.StatusSuratTugas | null
  }

  export type SuratTugasMaxAggregateOutputType = {
    id: number | null
    nomor_surat: string | null
    klien: string | null
    pekerjaan: string | null
    status_pekerjaan: string | null
    no_service_order: string | null
    bidang_pekerjaan: string | null
    tanggal_berangkat: Date | null
    tanggal_kembali: Date | null
    transportasi_operasional: boolean | null
    transportasi_ditanggung_klien: boolean | null
    transportasi_asal_tujuan: boolean | null
    transportasi_dinas: boolean | null
    tiket: boolean | null
    penginapan: boolean | null
    keterangan_lain: string | null
    createdAt: Date | null
    updatedAt: Date | null
    spi: string | null
    wbs: string | null
    status: $Enums.StatusSuratTugas | null
  }

  export type SuratTugasCountAggregateOutputType = {
    id: number
    nomor_surat: number
    klien: number
    pekerjaan: number
    status_pekerjaan: number
    no_service_order: number
    bidang_pekerjaan: number
    peralatan_inspeksi: number
    kebutuhan_material: number
    lokasi_pekerjaan: number
    tanggal_berangkat: number
    tanggal_kembali: number
    transportasi_operasional: number
    transportasi_ditanggung_klien: number
    transportasi_asal_tujuan: number
    transportasi_dinas: number
    tiket: number
    penginapan: number
    keterangan_lain: number
    createdAt: number
    updatedAt: number
    spi: number
    wbs: number
    status: number
    _all: number
  }


  export type SuratTugasAvgAggregateInputType = {
    id?: true
  }

  export type SuratTugasSumAggregateInputType = {
    id?: true
  }

  export type SuratTugasMinAggregateInputType = {
    id?: true
    nomor_surat?: true
    klien?: true
    pekerjaan?: true
    status_pekerjaan?: true
    no_service_order?: true
    bidang_pekerjaan?: true
    tanggal_berangkat?: true
    tanggal_kembali?: true
    transportasi_operasional?: true
    transportasi_ditanggung_klien?: true
    transportasi_asal_tujuan?: true
    transportasi_dinas?: true
    tiket?: true
    penginapan?: true
    keterangan_lain?: true
    createdAt?: true
    updatedAt?: true
    spi?: true
    wbs?: true
    status?: true
  }

  export type SuratTugasMaxAggregateInputType = {
    id?: true
    nomor_surat?: true
    klien?: true
    pekerjaan?: true
    status_pekerjaan?: true
    no_service_order?: true
    bidang_pekerjaan?: true
    tanggal_berangkat?: true
    tanggal_kembali?: true
    transportasi_operasional?: true
    transportasi_ditanggung_klien?: true
    transportasi_asal_tujuan?: true
    transportasi_dinas?: true
    tiket?: true
    penginapan?: true
    keterangan_lain?: true
    createdAt?: true
    updatedAt?: true
    spi?: true
    wbs?: true
    status?: true
  }

  export type SuratTugasCountAggregateInputType = {
    id?: true
    nomor_surat?: true
    klien?: true
    pekerjaan?: true
    status_pekerjaan?: true
    no_service_order?: true
    bidang_pekerjaan?: true
    peralatan_inspeksi?: true
    kebutuhan_material?: true
    lokasi_pekerjaan?: true
    tanggal_berangkat?: true
    tanggal_kembali?: true
    transportasi_operasional?: true
    transportasi_ditanggung_klien?: true
    transportasi_asal_tujuan?: true
    transportasi_dinas?: true
    tiket?: true
    penginapan?: true
    keterangan_lain?: true
    createdAt?: true
    updatedAt?: true
    spi?: true
    wbs?: true
    status?: true
    _all?: true
  }

  export type SuratTugasAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuratTugas to aggregate.
     */
    where?: SuratTugasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuratTugases to fetch.
     */
    orderBy?: SuratTugasOrderByWithRelationInput | SuratTugasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SuratTugasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuratTugases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuratTugases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SuratTugases
    **/
    _count?: true | SuratTugasCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SuratTugasAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SuratTugasSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SuratTugasMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SuratTugasMaxAggregateInputType
  }

  export type GetSuratTugasAggregateType<T extends SuratTugasAggregateArgs> = {
        [P in keyof T & keyof AggregateSuratTugas]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSuratTugas[P]>
      : GetScalarType<T[P], AggregateSuratTugas[P]>
  }




  export type SuratTugasGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SuratTugasWhereInput
    orderBy?: SuratTugasOrderByWithAggregationInput | SuratTugasOrderByWithAggregationInput[]
    by: SuratTugasScalarFieldEnum[] | SuratTugasScalarFieldEnum
    having?: SuratTugasScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SuratTugasCountAggregateInputType | true
    _avg?: SuratTugasAvgAggregateInputType
    _sum?: SuratTugasSumAggregateInputType
    _min?: SuratTugasMinAggregateInputType
    _max?: SuratTugasMaxAggregateInputType
  }

  export type SuratTugasGroupByOutputType = {
    id: number
    nomor_surat: string | null
    klien: string
    pekerjaan: string
    status_pekerjaan: string | null
    no_service_order: string | null
    bidang_pekerjaan: string | null
    peralatan_inspeksi: string[]
    kebutuhan_material: string[]
    lokasi_pekerjaan: string[]
    tanggal_berangkat: Date | null
    tanggal_kembali: Date | null
    transportasi_operasional: boolean
    transportasi_ditanggung_klien: boolean
    transportasi_asal_tujuan: boolean
    transportasi_dinas: boolean
    tiket: boolean
    penginapan: boolean
    keterangan_lain: string | null
    createdAt: Date
    updatedAt: Date
    spi: string | null
    wbs: string | null
    status: $Enums.StatusSuratTugas
    _count: SuratTugasCountAggregateOutputType | null
    _avg: SuratTugasAvgAggregateOutputType | null
    _sum: SuratTugasSumAggregateOutputType | null
    _min: SuratTugasMinAggregateOutputType | null
    _max: SuratTugasMaxAggregateOutputType | null
  }

  type GetSuratTugasGroupByPayload<T extends SuratTugasGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SuratTugasGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SuratTugasGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SuratTugasGroupByOutputType[P]>
            : GetScalarType<T[P], SuratTugasGroupByOutputType[P]>
        }
      >
    >


  export type SuratTugasSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nomor_surat?: boolean
    klien?: boolean
    pekerjaan?: boolean
    status_pekerjaan?: boolean
    no_service_order?: boolean
    bidang_pekerjaan?: boolean
    peralatan_inspeksi?: boolean
    kebutuhan_material?: boolean
    lokasi_pekerjaan?: boolean
    tanggal_berangkat?: boolean
    tanggal_kembali?: boolean
    transportasi_operasional?: boolean
    transportasi_ditanggung_klien?: boolean
    transportasi_asal_tujuan?: boolean
    transportasi_dinas?: boolean
    tiket?: boolean
    penginapan?: boolean
    keterangan_lain?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    spi?: boolean
    wbs?: boolean
    status?: boolean
    pegawai_surat_tugas?: boolean | SuratTugas$pegawai_surat_tugasArgs<ExtArgs>
    _count?: boolean | SuratTugasCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["suratTugas"]>

  export type SuratTugasSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nomor_surat?: boolean
    klien?: boolean
    pekerjaan?: boolean
    status_pekerjaan?: boolean
    no_service_order?: boolean
    bidang_pekerjaan?: boolean
    peralatan_inspeksi?: boolean
    kebutuhan_material?: boolean
    lokasi_pekerjaan?: boolean
    tanggal_berangkat?: boolean
    tanggal_kembali?: boolean
    transportasi_operasional?: boolean
    transportasi_ditanggung_klien?: boolean
    transportasi_asal_tujuan?: boolean
    transportasi_dinas?: boolean
    tiket?: boolean
    penginapan?: boolean
    keterangan_lain?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    spi?: boolean
    wbs?: boolean
    status?: boolean
  }, ExtArgs["result"]["suratTugas"]>

  export type SuratTugasSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nomor_surat?: boolean
    klien?: boolean
    pekerjaan?: boolean
    status_pekerjaan?: boolean
    no_service_order?: boolean
    bidang_pekerjaan?: boolean
    peralatan_inspeksi?: boolean
    kebutuhan_material?: boolean
    lokasi_pekerjaan?: boolean
    tanggal_berangkat?: boolean
    tanggal_kembali?: boolean
    transportasi_operasional?: boolean
    transportasi_ditanggung_klien?: boolean
    transportasi_asal_tujuan?: boolean
    transportasi_dinas?: boolean
    tiket?: boolean
    penginapan?: boolean
    keterangan_lain?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    spi?: boolean
    wbs?: boolean
    status?: boolean
  }, ExtArgs["result"]["suratTugas"]>

  export type SuratTugasSelectScalar = {
    id?: boolean
    nomor_surat?: boolean
    klien?: boolean
    pekerjaan?: boolean
    status_pekerjaan?: boolean
    no_service_order?: boolean
    bidang_pekerjaan?: boolean
    peralatan_inspeksi?: boolean
    kebutuhan_material?: boolean
    lokasi_pekerjaan?: boolean
    tanggal_berangkat?: boolean
    tanggal_kembali?: boolean
    transportasi_operasional?: boolean
    transportasi_ditanggung_klien?: boolean
    transportasi_asal_tujuan?: boolean
    transportasi_dinas?: boolean
    tiket?: boolean
    penginapan?: boolean
    keterangan_lain?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    spi?: boolean
    wbs?: boolean
    status?: boolean
  }

  export type SuratTugasOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nomor_surat" | "klien" | "pekerjaan" | "status_pekerjaan" | "no_service_order" | "bidang_pekerjaan" | "peralatan_inspeksi" | "kebutuhan_material" | "lokasi_pekerjaan" | "tanggal_berangkat" | "tanggal_kembali" | "transportasi_operasional" | "transportasi_ditanggung_klien" | "transportasi_asal_tujuan" | "transportasi_dinas" | "tiket" | "penginapan" | "keterangan_lain" | "createdAt" | "updatedAt" | "spi" | "wbs" | "status", ExtArgs["result"]["suratTugas"]>
  export type SuratTugasInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai_surat_tugas?: boolean | SuratTugas$pegawai_surat_tugasArgs<ExtArgs>
    _count?: boolean | SuratTugasCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SuratTugasIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SuratTugasIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SuratTugasPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SuratTugas"
    objects: {
      pegawai_surat_tugas: Prisma.$PegawaiSuratTugasPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nomor_surat: string | null
      klien: string
      pekerjaan: string
      status_pekerjaan: string | null
      no_service_order: string | null
      bidang_pekerjaan: string | null
      peralatan_inspeksi: string[]
      kebutuhan_material: string[]
      lokasi_pekerjaan: string[]
      tanggal_berangkat: Date | null
      tanggal_kembali: Date | null
      transportasi_operasional: boolean
      transportasi_ditanggung_klien: boolean
      transportasi_asal_tujuan: boolean
      transportasi_dinas: boolean
      tiket: boolean
      penginapan: boolean
      keterangan_lain: string | null
      createdAt: Date
      updatedAt: Date
      spi: string | null
      wbs: string | null
      status: $Enums.StatusSuratTugas
    }, ExtArgs["result"]["suratTugas"]>
    composites: {}
  }

  type SuratTugasGetPayload<S extends boolean | null | undefined | SuratTugasDefaultArgs> = $Result.GetResult<Prisma.$SuratTugasPayload, S>

  type SuratTugasCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SuratTugasFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SuratTugasCountAggregateInputType | true
    }

  export interface SuratTugasDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SuratTugas'], meta: { name: 'SuratTugas' } }
    /**
     * Find zero or one SuratTugas that matches the filter.
     * @param {SuratTugasFindUniqueArgs} args - Arguments to find a SuratTugas
     * @example
     * // Get one SuratTugas
     * const suratTugas = await prisma.suratTugas.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SuratTugasFindUniqueArgs>(args: SelectSubset<T, SuratTugasFindUniqueArgs<ExtArgs>>): Prisma__SuratTugasClient<$Result.GetResult<Prisma.$SuratTugasPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SuratTugas that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SuratTugasFindUniqueOrThrowArgs} args - Arguments to find a SuratTugas
     * @example
     * // Get one SuratTugas
     * const suratTugas = await prisma.suratTugas.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SuratTugasFindUniqueOrThrowArgs>(args: SelectSubset<T, SuratTugasFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SuratTugasClient<$Result.GetResult<Prisma.$SuratTugasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SuratTugas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuratTugasFindFirstArgs} args - Arguments to find a SuratTugas
     * @example
     * // Get one SuratTugas
     * const suratTugas = await prisma.suratTugas.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SuratTugasFindFirstArgs>(args?: SelectSubset<T, SuratTugasFindFirstArgs<ExtArgs>>): Prisma__SuratTugasClient<$Result.GetResult<Prisma.$SuratTugasPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SuratTugas that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuratTugasFindFirstOrThrowArgs} args - Arguments to find a SuratTugas
     * @example
     * // Get one SuratTugas
     * const suratTugas = await prisma.suratTugas.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SuratTugasFindFirstOrThrowArgs>(args?: SelectSubset<T, SuratTugasFindFirstOrThrowArgs<ExtArgs>>): Prisma__SuratTugasClient<$Result.GetResult<Prisma.$SuratTugasPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SuratTugases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuratTugasFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SuratTugases
     * const suratTugases = await prisma.suratTugas.findMany()
     * 
     * // Get first 10 SuratTugases
     * const suratTugases = await prisma.suratTugas.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const suratTugasWithIdOnly = await prisma.suratTugas.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SuratTugasFindManyArgs>(args?: SelectSubset<T, SuratTugasFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuratTugasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SuratTugas.
     * @param {SuratTugasCreateArgs} args - Arguments to create a SuratTugas.
     * @example
     * // Create one SuratTugas
     * const SuratTugas = await prisma.suratTugas.create({
     *   data: {
     *     // ... data to create a SuratTugas
     *   }
     * })
     * 
     */
    create<T extends SuratTugasCreateArgs>(args: SelectSubset<T, SuratTugasCreateArgs<ExtArgs>>): Prisma__SuratTugasClient<$Result.GetResult<Prisma.$SuratTugasPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SuratTugases.
     * @param {SuratTugasCreateManyArgs} args - Arguments to create many SuratTugases.
     * @example
     * // Create many SuratTugases
     * const suratTugas = await prisma.suratTugas.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SuratTugasCreateManyArgs>(args?: SelectSubset<T, SuratTugasCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SuratTugases and returns the data saved in the database.
     * @param {SuratTugasCreateManyAndReturnArgs} args - Arguments to create many SuratTugases.
     * @example
     * // Create many SuratTugases
     * const suratTugas = await prisma.suratTugas.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SuratTugases and only return the `id`
     * const suratTugasWithIdOnly = await prisma.suratTugas.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SuratTugasCreateManyAndReturnArgs>(args?: SelectSubset<T, SuratTugasCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuratTugasPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SuratTugas.
     * @param {SuratTugasDeleteArgs} args - Arguments to delete one SuratTugas.
     * @example
     * // Delete one SuratTugas
     * const SuratTugas = await prisma.suratTugas.delete({
     *   where: {
     *     // ... filter to delete one SuratTugas
     *   }
     * })
     * 
     */
    delete<T extends SuratTugasDeleteArgs>(args: SelectSubset<T, SuratTugasDeleteArgs<ExtArgs>>): Prisma__SuratTugasClient<$Result.GetResult<Prisma.$SuratTugasPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SuratTugas.
     * @param {SuratTugasUpdateArgs} args - Arguments to update one SuratTugas.
     * @example
     * // Update one SuratTugas
     * const suratTugas = await prisma.suratTugas.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SuratTugasUpdateArgs>(args: SelectSubset<T, SuratTugasUpdateArgs<ExtArgs>>): Prisma__SuratTugasClient<$Result.GetResult<Prisma.$SuratTugasPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SuratTugases.
     * @param {SuratTugasDeleteManyArgs} args - Arguments to filter SuratTugases to delete.
     * @example
     * // Delete a few SuratTugases
     * const { count } = await prisma.suratTugas.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SuratTugasDeleteManyArgs>(args?: SelectSubset<T, SuratTugasDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SuratTugases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuratTugasUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SuratTugases
     * const suratTugas = await prisma.suratTugas.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SuratTugasUpdateManyArgs>(args: SelectSubset<T, SuratTugasUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SuratTugases and returns the data updated in the database.
     * @param {SuratTugasUpdateManyAndReturnArgs} args - Arguments to update many SuratTugases.
     * @example
     * // Update many SuratTugases
     * const suratTugas = await prisma.suratTugas.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SuratTugases and only return the `id`
     * const suratTugasWithIdOnly = await prisma.suratTugas.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SuratTugasUpdateManyAndReturnArgs>(args: SelectSubset<T, SuratTugasUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuratTugasPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SuratTugas.
     * @param {SuratTugasUpsertArgs} args - Arguments to update or create a SuratTugas.
     * @example
     * // Update or create a SuratTugas
     * const suratTugas = await prisma.suratTugas.upsert({
     *   create: {
     *     // ... data to create a SuratTugas
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SuratTugas we want to update
     *   }
     * })
     */
    upsert<T extends SuratTugasUpsertArgs>(args: SelectSubset<T, SuratTugasUpsertArgs<ExtArgs>>): Prisma__SuratTugasClient<$Result.GetResult<Prisma.$SuratTugasPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SuratTugases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuratTugasCountArgs} args - Arguments to filter SuratTugases to count.
     * @example
     * // Count the number of SuratTugases
     * const count = await prisma.suratTugas.count({
     *   where: {
     *     // ... the filter for the SuratTugases we want to count
     *   }
     * })
    **/
    count<T extends SuratTugasCountArgs>(
      args?: Subset<T, SuratTugasCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SuratTugasCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SuratTugas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuratTugasAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SuratTugasAggregateArgs>(args: Subset<T, SuratTugasAggregateArgs>): Prisma.PrismaPromise<GetSuratTugasAggregateType<T>>

    /**
     * Group by SuratTugas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuratTugasGroupByArgs} args - Group by arguments.
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
      T extends SuratTugasGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SuratTugasGroupByArgs['orderBy'] }
        : { orderBy?: SuratTugasGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, SuratTugasGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSuratTugasGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SuratTugas model
   */
  readonly fields: SuratTugasFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SuratTugas.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SuratTugasClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pegawai_surat_tugas<T extends SuratTugas$pegawai_surat_tugasArgs<ExtArgs> = {}>(args?: Subset<T, SuratTugas$pegawai_surat_tugasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SuratTugas model
   */
  interface SuratTugasFieldRefs {
    readonly id: FieldRef<"SuratTugas", 'Int'>
    readonly nomor_surat: FieldRef<"SuratTugas", 'String'>
    readonly klien: FieldRef<"SuratTugas", 'String'>
    readonly pekerjaan: FieldRef<"SuratTugas", 'String'>
    readonly status_pekerjaan: FieldRef<"SuratTugas", 'String'>
    readonly no_service_order: FieldRef<"SuratTugas", 'String'>
    readonly bidang_pekerjaan: FieldRef<"SuratTugas", 'String'>
    readonly peralatan_inspeksi: FieldRef<"SuratTugas", 'String[]'>
    readonly kebutuhan_material: FieldRef<"SuratTugas", 'String[]'>
    readonly lokasi_pekerjaan: FieldRef<"SuratTugas", 'String[]'>
    readonly tanggal_berangkat: FieldRef<"SuratTugas", 'DateTime'>
    readonly tanggal_kembali: FieldRef<"SuratTugas", 'DateTime'>
    readonly transportasi_operasional: FieldRef<"SuratTugas", 'Boolean'>
    readonly transportasi_ditanggung_klien: FieldRef<"SuratTugas", 'Boolean'>
    readonly transportasi_asal_tujuan: FieldRef<"SuratTugas", 'Boolean'>
    readonly transportasi_dinas: FieldRef<"SuratTugas", 'Boolean'>
    readonly tiket: FieldRef<"SuratTugas", 'Boolean'>
    readonly penginapan: FieldRef<"SuratTugas", 'Boolean'>
    readonly keterangan_lain: FieldRef<"SuratTugas", 'String'>
    readonly createdAt: FieldRef<"SuratTugas", 'DateTime'>
    readonly updatedAt: FieldRef<"SuratTugas", 'DateTime'>
    readonly spi: FieldRef<"SuratTugas", 'String'>
    readonly wbs: FieldRef<"SuratTugas", 'String'>
    readonly status: FieldRef<"SuratTugas", 'StatusSuratTugas'>
  }
    

  // Custom InputTypes
  /**
   * SuratTugas findUnique
   */
  export type SuratTugasFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugas
     */
    select?: SuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuratTugas
     */
    omit?: SuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuratTugasInclude<ExtArgs> | null
    /**
     * Filter, which SuratTugas to fetch.
     */
    where: SuratTugasWhereUniqueInput
  }

  /**
   * SuratTugas findUniqueOrThrow
   */
  export type SuratTugasFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugas
     */
    select?: SuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuratTugas
     */
    omit?: SuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuratTugasInclude<ExtArgs> | null
    /**
     * Filter, which SuratTugas to fetch.
     */
    where: SuratTugasWhereUniqueInput
  }

  /**
   * SuratTugas findFirst
   */
  export type SuratTugasFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugas
     */
    select?: SuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuratTugas
     */
    omit?: SuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuratTugasInclude<ExtArgs> | null
    /**
     * Filter, which SuratTugas to fetch.
     */
    where?: SuratTugasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuratTugases to fetch.
     */
    orderBy?: SuratTugasOrderByWithRelationInput | SuratTugasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuratTugases.
     */
    cursor?: SuratTugasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuratTugases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuratTugases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuratTugases.
     */
    distinct?: SuratTugasScalarFieldEnum | SuratTugasScalarFieldEnum[]
  }

  /**
   * SuratTugas findFirstOrThrow
   */
  export type SuratTugasFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugas
     */
    select?: SuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuratTugas
     */
    omit?: SuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuratTugasInclude<ExtArgs> | null
    /**
     * Filter, which SuratTugas to fetch.
     */
    where?: SuratTugasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuratTugases to fetch.
     */
    orderBy?: SuratTugasOrderByWithRelationInput | SuratTugasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuratTugases.
     */
    cursor?: SuratTugasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuratTugases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuratTugases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuratTugases.
     */
    distinct?: SuratTugasScalarFieldEnum | SuratTugasScalarFieldEnum[]
  }

  /**
   * SuratTugas findMany
   */
  export type SuratTugasFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugas
     */
    select?: SuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuratTugas
     */
    omit?: SuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuratTugasInclude<ExtArgs> | null
    /**
     * Filter, which SuratTugases to fetch.
     */
    where?: SuratTugasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuratTugases to fetch.
     */
    orderBy?: SuratTugasOrderByWithRelationInput | SuratTugasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SuratTugases.
     */
    cursor?: SuratTugasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuratTugases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuratTugases.
     */
    skip?: number
    distinct?: SuratTugasScalarFieldEnum | SuratTugasScalarFieldEnum[]
  }

  /**
   * SuratTugas create
   */
  export type SuratTugasCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugas
     */
    select?: SuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuratTugas
     */
    omit?: SuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuratTugasInclude<ExtArgs> | null
    /**
     * The data needed to create a SuratTugas.
     */
    data: XOR<SuratTugasCreateInput, SuratTugasUncheckedCreateInput>
  }

  /**
   * SuratTugas createMany
   */
  export type SuratTugasCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SuratTugases.
     */
    data: SuratTugasCreateManyInput | SuratTugasCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuratTugas createManyAndReturn
   */
  export type SuratTugasCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugas
     */
    select?: SuratTugasSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SuratTugas
     */
    omit?: SuratTugasOmit<ExtArgs> | null
    /**
     * The data used to create many SuratTugases.
     */
    data: SuratTugasCreateManyInput | SuratTugasCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuratTugas update
   */
  export type SuratTugasUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugas
     */
    select?: SuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuratTugas
     */
    omit?: SuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuratTugasInclude<ExtArgs> | null
    /**
     * The data needed to update a SuratTugas.
     */
    data: XOR<SuratTugasUpdateInput, SuratTugasUncheckedUpdateInput>
    /**
     * Choose, which SuratTugas to update.
     */
    where: SuratTugasWhereUniqueInput
  }

  /**
   * SuratTugas updateMany
   */
  export type SuratTugasUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SuratTugases.
     */
    data: XOR<SuratTugasUpdateManyMutationInput, SuratTugasUncheckedUpdateManyInput>
    /**
     * Filter which SuratTugases to update
     */
    where?: SuratTugasWhereInput
    /**
     * Limit how many SuratTugases to update.
     */
    limit?: number
  }

  /**
   * SuratTugas updateManyAndReturn
   */
  export type SuratTugasUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugas
     */
    select?: SuratTugasSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SuratTugas
     */
    omit?: SuratTugasOmit<ExtArgs> | null
    /**
     * The data used to update SuratTugases.
     */
    data: XOR<SuratTugasUpdateManyMutationInput, SuratTugasUncheckedUpdateManyInput>
    /**
     * Filter which SuratTugases to update
     */
    where?: SuratTugasWhereInput
    /**
     * Limit how many SuratTugases to update.
     */
    limit?: number
  }

  /**
   * SuratTugas upsert
   */
  export type SuratTugasUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugas
     */
    select?: SuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuratTugas
     */
    omit?: SuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuratTugasInclude<ExtArgs> | null
    /**
     * The filter to search for the SuratTugas to update in case it exists.
     */
    where: SuratTugasWhereUniqueInput
    /**
     * In case the SuratTugas found by the `where` argument doesn't exist, create a new SuratTugas with this data.
     */
    create: XOR<SuratTugasCreateInput, SuratTugasUncheckedCreateInput>
    /**
     * In case the SuratTugas was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SuratTugasUpdateInput, SuratTugasUncheckedUpdateInput>
  }

  /**
   * SuratTugas delete
   */
  export type SuratTugasDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugas
     */
    select?: SuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuratTugas
     */
    omit?: SuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuratTugasInclude<ExtArgs> | null
    /**
     * Filter which SuratTugas to delete.
     */
    where: SuratTugasWhereUniqueInput
  }

  /**
   * SuratTugas deleteMany
   */
  export type SuratTugasDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuratTugases to delete
     */
    where?: SuratTugasWhereInput
    /**
     * Limit how many SuratTugases to delete.
     */
    limit?: number
  }

  /**
   * SuratTugas.pegawai_surat_tugas
   */
  export type SuratTugas$pegawai_surat_tugasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasInclude<ExtArgs> | null
    where?: PegawaiSuratTugasWhereInput
    orderBy?: PegawaiSuratTugasOrderByWithRelationInput | PegawaiSuratTugasOrderByWithRelationInput[]
    cursor?: PegawaiSuratTugasWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PegawaiSuratTugasScalarFieldEnum | PegawaiSuratTugasScalarFieldEnum[]
  }

  /**
   * SuratTugas without action
   */
  export type SuratTugasDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuratTugas
     */
    select?: SuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuratTugas
     */
    omit?: SuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuratTugasInclude<ExtArgs> | null
  }


  /**
   * Model PegawaiSuratTugas
   */

  export type AggregatePegawaiSuratTugas = {
    _count: PegawaiSuratTugasCountAggregateOutputType | null
    _avg: PegawaiSuratTugasAvgAggregateOutputType | null
    _sum: PegawaiSuratTugasSumAggregateOutputType | null
    _min: PegawaiSuratTugasMinAggregateOutputType | null
    _max: PegawaiSuratTugasMaxAggregateOutputType | null
  }

  export type PegawaiSuratTugasAvgAggregateOutputType = {
    id: number | null
    suratTugasId: number | null
  }

  export type PegawaiSuratTugasSumAggregateOutputType = {
    id: number | null
    suratTugasId: number | null
  }

  export type PegawaiSuratTugasMinAggregateOutputType = {
    id: number | null
    suratTugasId: number | null
    pegawaiNup: string | null
    jabatan: string | null
    approved: boolean | null
    approvedBy: string | null
    approvedAt: Date | null
  }

  export type PegawaiSuratTugasMaxAggregateOutputType = {
    id: number | null
    suratTugasId: number | null
    pegawaiNup: string | null
    jabatan: string | null
    approved: boolean | null
    approvedBy: string | null
    approvedAt: Date | null
  }

  export type PegawaiSuratTugasCountAggregateOutputType = {
    id: number
    suratTugasId: number
    pegawaiNup: number
    jabatan: number
    approved: number
    approvedBy: number
    approvedAt: number
    _all: number
  }


  export type PegawaiSuratTugasAvgAggregateInputType = {
    id?: true
    suratTugasId?: true
  }

  export type PegawaiSuratTugasSumAggregateInputType = {
    id?: true
    suratTugasId?: true
  }

  export type PegawaiSuratTugasMinAggregateInputType = {
    id?: true
    suratTugasId?: true
    pegawaiNup?: true
    jabatan?: true
    approved?: true
    approvedBy?: true
    approvedAt?: true
  }

  export type PegawaiSuratTugasMaxAggregateInputType = {
    id?: true
    suratTugasId?: true
    pegawaiNup?: true
    jabatan?: true
    approved?: true
    approvedBy?: true
    approvedAt?: true
  }

  export type PegawaiSuratTugasCountAggregateInputType = {
    id?: true
    suratTugasId?: true
    pegawaiNup?: true
    jabatan?: true
    approved?: true
    approvedBy?: true
    approvedAt?: true
    _all?: true
  }

  export type PegawaiSuratTugasAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PegawaiSuratTugas to aggregate.
     */
    where?: PegawaiSuratTugasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PegawaiSuratTugases to fetch.
     */
    orderBy?: PegawaiSuratTugasOrderByWithRelationInput | PegawaiSuratTugasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PegawaiSuratTugasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PegawaiSuratTugases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PegawaiSuratTugases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PegawaiSuratTugases
    **/
    _count?: true | PegawaiSuratTugasCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PegawaiSuratTugasAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PegawaiSuratTugasSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PegawaiSuratTugasMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PegawaiSuratTugasMaxAggregateInputType
  }

  export type GetPegawaiSuratTugasAggregateType<T extends PegawaiSuratTugasAggregateArgs> = {
        [P in keyof T & keyof AggregatePegawaiSuratTugas]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePegawaiSuratTugas[P]>
      : GetScalarType<T[P], AggregatePegawaiSuratTugas[P]>
  }




  export type PegawaiSuratTugasGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PegawaiSuratTugasWhereInput
    orderBy?: PegawaiSuratTugasOrderByWithAggregationInput | PegawaiSuratTugasOrderByWithAggregationInput[]
    by: PegawaiSuratTugasScalarFieldEnum[] | PegawaiSuratTugasScalarFieldEnum
    having?: PegawaiSuratTugasScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PegawaiSuratTugasCountAggregateInputType | true
    _avg?: PegawaiSuratTugasAvgAggregateInputType
    _sum?: PegawaiSuratTugasSumAggregateInputType
    _min?: PegawaiSuratTugasMinAggregateInputType
    _max?: PegawaiSuratTugasMaxAggregateInputType
  }

  export type PegawaiSuratTugasGroupByOutputType = {
    id: number
    suratTugasId: number
    pegawaiNup: string
    jabatan: string | null
    approved: boolean
    approvedBy: string | null
    approvedAt: Date | null
    _count: PegawaiSuratTugasCountAggregateOutputType | null
    _avg: PegawaiSuratTugasAvgAggregateOutputType | null
    _sum: PegawaiSuratTugasSumAggregateOutputType | null
    _min: PegawaiSuratTugasMinAggregateOutputType | null
    _max: PegawaiSuratTugasMaxAggregateOutputType | null
  }

  type GetPegawaiSuratTugasGroupByPayload<T extends PegawaiSuratTugasGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PegawaiSuratTugasGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PegawaiSuratTugasGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PegawaiSuratTugasGroupByOutputType[P]>
            : GetScalarType<T[P], PegawaiSuratTugasGroupByOutputType[P]>
        }
      >
    >


  export type PegawaiSuratTugasSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    suratTugasId?: boolean
    pegawaiNup?: boolean
    jabatan?: boolean
    approved?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    pegawai?: boolean | pegawaiDefaultArgs<ExtArgs>
    suratTugas?: boolean | SuratTugasDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pegawaiSuratTugas"]>

  export type PegawaiSuratTugasSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    suratTugasId?: boolean
    pegawaiNup?: boolean
    jabatan?: boolean
    approved?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    pegawai?: boolean | pegawaiDefaultArgs<ExtArgs>
    suratTugas?: boolean | SuratTugasDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pegawaiSuratTugas"]>

  export type PegawaiSuratTugasSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    suratTugasId?: boolean
    pegawaiNup?: boolean
    jabatan?: boolean
    approved?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    pegawai?: boolean | pegawaiDefaultArgs<ExtArgs>
    suratTugas?: boolean | SuratTugasDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pegawaiSuratTugas"]>

  export type PegawaiSuratTugasSelectScalar = {
    id?: boolean
    suratTugasId?: boolean
    pegawaiNup?: boolean
    jabatan?: boolean
    approved?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
  }

  export type PegawaiSuratTugasOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "suratTugasId" | "pegawaiNup" | "jabatan" | "approved" | "approvedBy" | "approvedAt", ExtArgs["result"]["pegawaiSuratTugas"]>
  export type PegawaiSuratTugasInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai?: boolean | pegawaiDefaultArgs<ExtArgs>
    suratTugas?: boolean | SuratTugasDefaultArgs<ExtArgs>
  }
  export type PegawaiSuratTugasIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai?: boolean | pegawaiDefaultArgs<ExtArgs>
    suratTugas?: boolean | SuratTugasDefaultArgs<ExtArgs>
  }
  export type PegawaiSuratTugasIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pegawai?: boolean | pegawaiDefaultArgs<ExtArgs>
    suratTugas?: boolean | SuratTugasDefaultArgs<ExtArgs>
  }

  export type $PegawaiSuratTugasPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PegawaiSuratTugas"
    objects: {
      pegawai: Prisma.$pegawaiPayload<ExtArgs>
      suratTugas: Prisma.$SuratTugasPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      suratTugasId: number
      pegawaiNup: string
      jabatan: string | null
      approved: boolean
      approvedBy: string | null
      approvedAt: Date | null
    }, ExtArgs["result"]["pegawaiSuratTugas"]>
    composites: {}
  }

  type PegawaiSuratTugasGetPayload<S extends boolean | null | undefined | PegawaiSuratTugasDefaultArgs> = $Result.GetResult<Prisma.$PegawaiSuratTugasPayload, S>

  type PegawaiSuratTugasCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PegawaiSuratTugasFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PegawaiSuratTugasCountAggregateInputType | true
    }

  export interface PegawaiSuratTugasDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PegawaiSuratTugas'], meta: { name: 'PegawaiSuratTugas' } }
    /**
     * Find zero or one PegawaiSuratTugas that matches the filter.
     * @param {PegawaiSuratTugasFindUniqueArgs} args - Arguments to find a PegawaiSuratTugas
     * @example
     * // Get one PegawaiSuratTugas
     * const pegawaiSuratTugas = await prisma.pegawaiSuratTugas.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PegawaiSuratTugasFindUniqueArgs>(args: SelectSubset<T, PegawaiSuratTugasFindUniqueArgs<ExtArgs>>): Prisma__PegawaiSuratTugasClient<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PegawaiSuratTugas that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PegawaiSuratTugasFindUniqueOrThrowArgs} args - Arguments to find a PegawaiSuratTugas
     * @example
     * // Get one PegawaiSuratTugas
     * const pegawaiSuratTugas = await prisma.pegawaiSuratTugas.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PegawaiSuratTugasFindUniqueOrThrowArgs>(args: SelectSubset<T, PegawaiSuratTugasFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PegawaiSuratTugasClient<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PegawaiSuratTugas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PegawaiSuratTugasFindFirstArgs} args - Arguments to find a PegawaiSuratTugas
     * @example
     * // Get one PegawaiSuratTugas
     * const pegawaiSuratTugas = await prisma.pegawaiSuratTugas.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PegawaiSuratTugasFindFirstArgs>(args?: SelectSubset<T, PegawaiSuratTugasFindFirstArgs<ExtArgs>>): Prisma__PegawaiSuratTugasClient<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PegawaiSuratTugas that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PegawaiSuratTugasFindFirstOrThrowArgs} args - Arguments to find a PegawaiSuratTugas
     * @example
     * // Get one PegawaiSuratTugas
     * const pegawaiSuratTugas = await prisma.pegawaiSuratTugas.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PegawaiSuratTugasFindFirstOrThrowArgs>(args?: SelectSubset<T, PegawaiSuratTugasFindFirstOrThrowArgs<ExtArgs>>): Prisma__PegawaiSuratTugasClient<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PegawaiSuratTugases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PegawaiSuratTugasFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PegawaiSuratTugases
     * const pegawaiSuratTugases = await prisma.pegawaiSuratTugas.findMany()
     * 
     * // Get first 10 PegawaiSuratTugases
     * const pegawaiSuratTugases = await prisma.pegawaiSuratTugas.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pegawaiSuratTugasWithIdOnly = await prisma.pegawaiSuratTugas.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PegawaiSuratTugasFindManyArgs>(args?: SelectSubset<T, PegawaiSuratTugasFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PegawaiSuratTugas.
     * @param {PegawaiSuratTugasCreateArgs} args - Arguments to create a PegawaiSuratTugas.
     * @example
     * // Create one PegawaiSuratTugas
     * const PegawaiSuratTugas = await prisma.pegawaiSuratTugas.create({
     *   data: {
     *     // ... data to create a PegawaiSuratTugas
     *   }
     * })
     * 
     */
    create<T extends PegawaiSuratTugasCreateArgs>(args: SelectSubset<T, PegawaiSuratTugasCreateArgs<ExtArgs>>): Prisma__PegawaiSuratTugasClient<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PegawaiSuratTugases.
     * @param {PegawaiSuratTugasCreateManyArgs} args - Arguments to create many PegawaiSuratTugases.
     * @example
     * // Create many PegawaiSuratTugases
     * const pegawaiSuratTugas = await prisma.pegawaiSuratTugas.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PegawaiSuratTugasCreateManyArgs>(args?: SelectSubset<T, PegawaiSuratTugasCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PegawaiSuratTugases and returns the data saved in the database.
     * @param {PegawaiSuratTugasCreateManyAndReturnArgs} args - Arguments to create many PegawaiSuratTugases.
     * @example
     * // Create many PegawaiSuratTugases
     * const pegawaiSuratTugas = await prisma.pegawaiSuratTugas.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PegawaiSuratTugases and only return the `id`
     * const pegawaiSuratTugasWithIdOnly = await prisma.pegawaiSuratTugas.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PegawaiSuratTugasCreateManyAndReturnArgs>(args?: SelectSubset<T, PegawaiSuratTugasCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PegawaiSuratTugas.
     * @param {PegawaiSuratTugasDeleteArgs} args - Arguments to delete one PegawaiSuratTugas.
     * @example
     * // Delete one PegawaiSuratTugas
     * const PegawaiSuratTugas = await prisma.pegawaiSuratTugas.delete({
     *   where: {
     *     // ... filter to delete one PegawaiSuratTugas
     *   }
     * })
     * 
     */
    delete<T extends PegawaiSuratTugasDeleteArgs>(args: SelectSubset<T, PegawaiSuratTugasDeleteArgs<ExtArgs>>): Prisma__PegawaiSuratTugasClient<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PegawaiSuratTugas.
     * @param {PegawaiSuratTugasUpdateArgs} args - Arguments to update one PegawaiSuratTugas.
     * @example
     * // Update one PegawaiSuratTugas
     * const pegawaiSuratTugas = await prisma.pegawaiSuratTugas.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PegawaiSuratTugasUpdateArgs>(args: SelectSubset<T, PegawaiSuratTugasUpdateArgs<ExtArgs>>): Prisma__PegawaiSuratTugasClient<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PegawaiSuratTugases.
     * @param {PegawaiSuratTugasDeleteManyArgs} args - Arguments to filter PegawaiSuratTugases to delete.
     * @example
     * // Delete a few PegawaiSuratTugases
     * const { count } = await prisma.pegawaiSuratTugas.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PegawaiSuratTugasDeleteManyArgs>(args?: SelectSubset<T, PegawaiSuratTugasDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PegawaiSuratTugases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PegawaiSuratTugasUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PegawaiSuratTugases
     * const pegawaiSuratTugas = await prisma.pegawaiSuratTugas.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PegawaiSuratTugasUpdateManyArgs>(args: SelectSubset<T, PegawaiSuratTugasUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PegawaiSuratTugases and returns the data updated in the database.
     * @param {PegawaiSuratTugasUpdateManyAndReturnArgs} args - Arguments to update many PegawaiSuratTugases.
     * @example
     * // Update many PegawaiSuratTugases
     * const pegawaiSuratTugas = await prisma.pegawaiSuratTugas.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PegawaiSuratTugases and only return the `id`
     * const pegawaiSuratTugasWithIdOnly = await prisma.pegawaiSuratTugas.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PegawaiSuratTugasUpdateManyAndReturnArgs>(args: SelectSubset<T, PegawaiSuratTugasUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PegawaiSuratTugas.
     * @param {PegawaiSuratTugasUpsertArgs} args - Arguments to update or create a PegawaiSuratTugas.
     * @example
     * // Update or create a PegawaiSuratTugas
     * const pegawaiSuratTugas = await prisma.pegawaiSuratTugas.upsert({
     *   create: {
     *     // ... data to create a PegawaiSuratTugas
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PegawaiSuratTugas we want to update
     *   }
     * })
     */
    upsert<T extends PegawaiSuratTugasUpsertArgs>(args: SelectSubset<T, PegawaiSuratTugasUpsertArgs<ExtArgs>>): Prisma__PegawaiSuratTugasClient<$Result.GetResult<Prisma.$PegawaiSuratTugasPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PegawaiSuratTugases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PegawaiSuratTugasCountArgs} args - Arguments to filter PegawaiSuratTugases to count.
     * @example
     * // Count the number of PegawaiSuratTugases
     * const count = await prisma.pegawaiSuratTugas.count({
     *   where: {
     *     // ... the filter for the PegawaiSuratTugases we want to count
     *   }
     * })
    **/
    count<T extends PegawaiSuratTugasCountArgs>(
      args?: Subset<T, PegawaiSuratTugasCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PegawaiSuratTugasCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PegawaiSuratTugas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PegawaiSuratTugasAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PegawaiSuratTugasAggregateArgs>(args: Subset<T, PegawaiSuratTugasAggregateArgs>): Prisma.PrismaPromise<GetPegawaiSuratTugasAggregateType<T>>

    /**
     * Group by PegawaiSuratTugas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PegawaiSuratTugasGroupByArgs} args - Group by arguments.
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
      T extends PegawaiSuratTugasGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PegawaiSuratTugasGroupByArgs['orderBy'] }
        : { orderBy?: PegawaiSuratTugasGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, PegawaiSuratTugasGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPegawaiSuratTugasGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PegawaiSuratTugas model
   */
  readonly fields: PegawaiSuratTugasFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PegawaiSuratTugas.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PegawaiSuratTugasClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pegawai<T extends pegawaiDefaultArgs<ExtArgs> = {}>(args?: Subset<T, pegawaiDefaultArgs<ExtArgs>>): Prisma__pegawaiClient<$Result.GetResult<Prisma.$pegawaiPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    suratTugas<T extends SuratTugasDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SuratTugasDefaultArgs<ExtArgs>>): Prisma__SuratTugasClient<$Result.GetResult<Prisma.$SuratTugasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PegawaiSuratTugas model
   */
  interface PegawaiSuratTugasFieldRefs {
    readonly id: FieldRef<"PegawaiSuratTugas", 'Int'>
    readonly suratTugasId: FieldRef<"PegawaiSuratTugas", 'Int'>
    readonly pegawaiNup: FieldRef<"PegawaiSuratTugas", 'String'>
    readonly jabatan: FieldRef<"PegawaiSuratTugas", 'String'>
    readonly approved: FieldRef<"PegawaiSuratTugas", 'Boolean'>
    readonly approvedBy: FieldRef<"PegawaiSuratTugas", 'String'>
    readonly approvedAt: FieldRef<"PegawaiSuratTugas", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PegawaiSuratTugas findUnique
   */
  export type PegawaiSuratTugasFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasInclude<ExtArgs> | null
    /**
     * Filter, which PegawaiSuratTugas to fetch.
     */
    where: PegawaiSuratTugasWhereUniqueInput
  }

  /**
   * PegawaiSuratTugas findUniqueOrThrow
   */
  export type PegawaiSuratTugasFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasInclude<ExtArgs> | null
    /**
     * Filter, which PegawaiSuratTugas to fetch.
     */
    where: PegawaiSuratTugasWhereUniqueInput
  }

  /**
   * PegawaiSuratTugas findFirst
   */
  export type PegawaiSuratTugasFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasInclude<ExtArgs> | null
    /**
     * Filter, which PegawaiSuratTugas to fetch.
     */
    where?: PegawaiSuratTugasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PegawaiSuratTugases to fetch.
     */
    orderBy?: PegawaiSuratTugasOrderByWithRelationInput | PegawaiSuratTugasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PegawaiSuratTugases.
     */
    cursor?: PegawaiSuratTugasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PegawaiSuratTugases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PegawaiSuratTugases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PegawaiSuratTugases.
     */
    distinct?: PegawaiSuratTugasScalarFieldEnum | PegawaiSuratTugasScalarFieldEnum[]
  }

  /**
   * PegawaiSuratTugas findFirstOrThrow
   */
  export type PegawaiSuratTugasFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasInclude<ExtArgs> | null
    /**
     * Filter, which PegawaiSuratTugas to fetch.
     */
    where?: PegawaiSuratTugasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PegawaiSuratTugases to fetch.
     */
    orderBy?: PegawaiSuratTugasOrderByWithRelationInput | PegawaiSuratTugasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PegawaiSuratTugases.
     */
    cursor?: PegawaiSuratTugasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PegawaiSuratTugases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PegawaiSuratTugases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PegawaiSuratTugases.
     */
    distinct?: PegawaiSuratTugasScalarFieldEnum | PegawaiSuratTugasScalarFieldEnum[]
  }

  /**
   * PegawaiSuratTugas findMany
   */
  export type PegawaiSuratTugasFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasInclude<ExtArgs> | null
    /**
     * Filter, which PegawaiSuratTugases to fetch.
     */
    where?: PegawaiSuratTugasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PegawaiSuratTugases to fetch.
     */
    orderBy?: PegawaiSuratTugasOrderByWithRelationInput | PegawaiSuratTugasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PegawaiSuratTugases.
     */
    cursor?: PegawaiSuratTugasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PegawaiSuratTugases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PegawaiSuratTugases.
     */
    skip?: number
    distinct?: PegawaiSuratTugasScalarFieldEnum | PegawaiSuratTugasScalarFieldEnum[]
  }

  /**
   * PegawaiSuratTugas create
   */
  export type PegawaiSuratTugasCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasInclude<ExtArgs> | null
    /**
     * The data needed to create a PegawaiSuratTugas.
     */
    data: XOR<PegawaiSuratTugasCreateInput, PegawaiSuratTugasUncheckedCreateInput>
  }

  /**
   * PegawaiSuratTugas createMany
   */
  export type PegawaiSuratTugasCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PegawaiSuratTugases.
     */
    data: PegawaiSuratTugasCreateManyInput | PegawaiSuratTugasCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PegawaiSuratTugas createManyAndReturn
   */
  export type PegawaiSuratTugasCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * The data used to create many PegawaiSuratTugases.
     */
    data: PegawaiSuratTugasCreateManyInput | PegawaiSuratTugasCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PegawaiSuratTugas update
   */
  export type PegawaiSuratTugasUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasInclude<ExtArgs> | null
    /**
     * The data needed to update a PegawaiSuratTugas.
     */
    data: XOR<PegawaiSuratTugasUpdateInput, PegawaiSuratTugasUncheckedUpdateInput>
    /**
     * Choose, which PegawaiSuratTugas to update.
     */
    where: PegawaiSuratTugasWhereUniqueInput
  }

  /**
   * PegawaiSuratTugas updateMany
   */
  export type PegawaiSuratTugasUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PegawaiSuratTugases.
     */
    data: XOR<PegawaiSuratTugasUpdateManyMutationInput, PegawaiSuratTugasUncheckedUpdateManyInput>
    /**
     * Filter which PegawaiSuratTugases to update
     */
    where?: PegawaiSuratTugasWhereInput
    /**
     * Limit how many PegawaiSuratTugases to update.
     */
    limit?: number
  }

  /**
   * PegawaiSuratTugas updateManyAndReturn
   */
  export type PegawaiSuratTugasUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * The data used to update PegawaiSuratTugases.
     */
    data: XOR<PegawaiSuratTugasUpdateManyMutationInput, PegawaiSuratTugasUncheckedUpdateManyInput>
    /**
     * Filter which PegawaiSuratTugases to update
     */
    where?: PegawaiSuratTugasWhereInput
    /**
     * Limit how many PegawaiSuratTugases to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PegawaiSuratTugas upsert
   */
  export type PegawaiSuratTugasUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasInclude<ExtArgs> | null
    /**
     * The filter to search for the PegawaiSuratTugas to update in case it exists.
     */
    where: PegawaiSuratTugasWhereUniqueInput
    /**
     * In case the PegawaiSuratTugas found by the `where` argument doesn't exist, create a new PegawaiSuratTugas with this data.
     */
    create: XOR<PegawaiSuratTugasCreateInput, PegawaiSuratTugasUncheckedCreateInput>
    /**
     * In case the PegawaiSuratTugas was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PegawaiSuratTugasUpdateInput, PegawaiSuratTugasUncheckedUpdateInput>
  }

  /**
   * PegawaiSuratTugas delete
   */
  export type PegawaiSuratTugasDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasInclude<ExtArgs> | null
    /**
     * Filter which PegawaiSuratTugas to delete.
     */
    where: PegawaiSuratTugasWhereUniqueInput
  }

  /**
   * PegawaiSuratTugas deleteMany
   */
  export type PegawaiSuratTugasDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PegawaiSuratTugases to delete
     */
    where?: PegawaiSuratTugasWhereInput
    /**
     * Limit how many PegawaiSuratTugases to delete.
     */
    limit?: number
  }

  /**
   * PegawaiSuratTugas without action
   */
  export type PegawaiSuratTugasDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PegawaiSuratTugas
     */
    select?: PegawaiSuratTugasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PegawaiSuratTugas
     */
    omit?: PegawaiSuratTugasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PegawaiSuratTugasInclude<ExtArgs> | null
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


  export const PegawaiScalarFieldEnum: {
    nup: 'nup',
    nama_pegawai: 'nama_pegawai',
    status_pegawai: 'status_pegawai',
    jabatan: 'jabatan',
    tempat_lahir: 'tempat_lahir',
    tanggal_lahir: 'tanggal_lahir',
    alamat: 'alamat',
    warga_negara: 'warga_negara',
    agama: 'agama',
    no_telepon: 'no_telepon',
    email: 'email',
    password: 'password',
    role: 'role',
    username: 'username',
    id: 'id',
    nik: 'nik'
  };

  export type PegawaiScalarFieldEnum = (typeof PegawaiScalarFieldEnum)[keyof typeof PegawaiScalarFieldEnum]


  export const PelatihanScalarFieldEnum: {
    id_pelatihan: 'id_pelatihan',
    nup: 'nup',
    nama_pelatihan: 'nama_pelatihan',
    penyelenggara: 'penyelenggara',
    nomor_sertifikat: 'nomor_sertifikat',
    file_sertifikat: 'file_sertifikat',
    tanggal_awal: 'tanggal_awal',
    masa_berlaku: 'masa_berlaku',
    status: 'status',
    keterangan_utilisasi: 'keterangan_utilisasi',
    tahun: 'tahun',
    tanggal_akhir: 'tanggal_akhir'
  };

  export type PelatihanScalarFieldEnum = (typeof PelatihanScalarFieldEnum)[keyof typeof PelatihanScalarFieldEnum]


  export const Pengalaman_kerjaScalarFieldEnum: {
    id_pengalaman: 'id_pengalaman',
    nup: 'nup',
    tahun: 'tahun',
    pengalaman_kerja: 'pengalaman_kerja',
    perusahaan: 'perusahaan'
  };

  export type Pengalaman_kerjaScalarFieldEnum = (typeof Pengalaman_kerjaScalarFieldEnum)[keyof typeof Pengalaman_kerjaScalarFieldEnum]


  export const SuratTugasScalarFieldEnum: {
    id: 'id',
    nomor_surat: 'nomor_surat',
    klien: 'klien',
    pekerjaan: 'pekerjaan',
    status_pekerjaan: 'status_pekerjaan',
    no_service_order: 'no_service_order',
    bidang_pekerjaan: 'bidang_pekerjaan',
    peralatan_inspeksi: 'peralatan_inspeksi',
    kebutuhan_material: 'kebutuhan_material',
    lokasi_pekerjaan: 'lokasi_pekerjaan',
    tanggal_berangkat: 'tanggal_berangkat',
    tanggal_kembali: 'tanggal_kembali',
    transportasi_operasional: 'transportasi_operasional',
    transportasi_ditanggung_klien: 'transportasi_ditanggung_klien',
    transportasi_asal_tujuan: 'transportasi_asal_tujuan',
    transportasi_dinas: 'transportasi_dinas',
    tiket: 'tiket',
    penginapan: 'penginapan',
    keterangan_lain: 'keterangan_lain',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    spi: 'spi',
    wbs: 'wbs',
    status: 'status'
  };

  export type SuratTugasScalarFieldEnum = (typeof SuratTugasScalarFieldEnum)[keyof typeof SuratTugasScalarFieldEnum]


  export const PegawaiSuratTugasScalarFieldEnum: {
    id: 'id',
    suratTugasId: 'suratTugasId',
    pegawaiNup: 'pegawaiNup',
    jabatan: 'jabatan',
    approved: 'approved',
    approvedBy: 'approvedBy',
    approvedAt: 'approvedAt'
  };

  export type PegawaiSuratTugasScalarFieldEnum = (typeof PegawaiSuratTugasScalarFieldEnum)[keyof typeof PegawaiSuratTugasScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'StatusPelatihan'
   */
  export type EnumStatusPelatihanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusPelatihan'>
    


  /**
   * Reference to a field of type 'StatusPelatihan[]'
   */
  export type ListEnumStatusPelatihanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusPelatihan[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'StatusSuratTugas'
   */
  export type EnumStatusSuratTugasFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusSuratTugas'>
    


  /**
   * Reference to a field of type 'StatusSuratTugas[]'
   */
  export type ListEnumStatusSuratTugasFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusSuratTugas[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type pegawaiWhereInput = {
    AND?: pegawaiWhereInput | pegawaiWhereInput[]
    OR?: pegawaiWhereInput[]
    NOT?: pegawaiWhereInput | pegawaiWhereInput[]
    nup?: StringFilter<"pegawai"> | string
    nama_pegawai?: StringFilter<"pegawai"> | string
    status_pegawai?: StringNullableFilter<"pegawai"> | string | null
    jabatan?: StringNullableFilter<"pegawai"> | string | null
    tempat_lahir?: StringNullableFilter<"pegawai"> | string | null
    tanggal_lahir?: DateTimeNullableFilter<"pegawai"> | Date | string | null
    alamat?: StringNullableFilter<"pegawai"> | string | null
    warga_negara?: StringNullableFilter<"pegawai"> | string | null
    agama?: StringNullableFilter<"pegawai"> | string | null
    no_telepon?: StringNullableFilter<"pegawai"> | string | null
    email?: StringNullableFilter<"pegawai"> | string | null
    password?: StringFilter<"pegawai"> | string
    role?: StringNullableFilter<"pegawai"> | string | null
    username?: StringNullableFilter<"pegawai"> | string | null
    id?: IntFilter<"pegawai"> | number
    nik?: StringNullableFilter<"pegawai"> | string | null
    pegawai_surat_tugas?: PegawaiSuratTugasListRelationFilter
    pelatihan?: PelatihanListRelationFilter
    pengalaman_kerja?: Pengalaman_kerjaListRelationFilter
  }

  export type pegawaiOrderByWithRelationInput = {
    nup?: SortOrder
    nama_pegawai?: SortOrder
    status_pegawai?: SortOrderInput | SortOrder
    jabatan?: SortOrderInput | SortOrder
    tempat_lahir?: SortOrderInput | SortOrder
    tanggal_lahir?: SortOrderInput | SortOrder
    alamat?: SortOrderInput | SortOrder
    warga_negara?: SortOrderInput | SortOrder
    agama?: SortOrderInput | SortOrder
    no_telepon?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    password?: SortOrder
    role?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    id?: SortOrder
    nik?: SortOrderInput | SortOrder
    pegawai_surat_tugas?: PegawaiSuratTugasOrderByRelationAggregateInput
    pelatihan?: pelatihanOrderByRelationAggregateInput
    pengalaman_kerja?: pengalaman_kerjaOrderByRelationAggregateInput
  }

  export type pegawaiWhereUniqueInput = Prisma.AtLeast<{
    nup?: string
    username?: string
    id?: number
    AND?: pegawaiWhereInput | pegawaiWhereInput[]
    OR?: pegawaiWhereInput[]
    NOT?: pegawaiWhereInput | pegawaiWhereInput[]
    nama_pegawai?: StringFilter<"pegawai"> | string
    status_pegawai?: StringNullableFilter<"pegawai"> | string | null
    jabatan?: StringNullableFilter<"pegawai"> | string | null
    tempat_lahir?: StringNullableFilter<"pegawai"> | string | null
    tanggal_lahir?: DateTimeNullableFilter<"pegawai"> | Date | string | null
    alamat?: StringNullableFilter<"pegawai"> | string | null
    warga_negara?: StringNullableFilter<"pegawai"> | string | null
    agama?: StringNullableFilter<"pegawai"> | string | null
    no_telepon?: StringNullableFilter<"pegawai"> | string | null
    email?: StringNullableFilter<"pegawai"> | string | null
    password?: StringFilter<"pegawai"> | string
    role?: StringNullableFilter<"pegawai"> | string | null
    nik?: StringNullableFilter<"pegawai"> | string | null
    pegawai_surat_tugas?: PegawaiSuratTugasListRelationFilter
    pelatihan?: PelatihanListRelationFilter
    pengalaman_kerja?: Pengalaman_kerjaListRelationFilter
  }, "nup" | "nup" | "username" | "id">

  export type pegawaiOrderByWithAggregationInput = {
    nup?: SortOrder
    nama_pegawai?: SortOrder
    status_pegawai?: SortOrderInput | SortOrder
    jabatan?: SortOrderInput | SortOrder
    tempat_lahir?: SortOrderInput | SortOrder
    tanggal_lahir?: SortOrderInput | SortOrder
    alamat?: SortOrderInput | SortOrder
    warga_negara?: SortOrderInput | SortOrder
    agama?: SortOrderInput | SortOrder
    no_telepon?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    password?: SortOrder
    role?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    id?: SortOrder
    nik?: SortOrderInput | SortOrder
    _count?: pegawaiCountOrderByAggregateInput
    _avg?: pegawaiAvgOrderByAggregateInput
    _max?: pegawaiMaxOrderByAggregateInput
    _min?: pegawaiMinOrderByAggregateInput
    _sum?: pegawaiSumOrderByAggregateInput
  }

  export type pegawaiScalarWhereWithAggregatesInput = {
    AND?: pegawaiScalarWhereWithAggregatesInput | pegawaiScalarWhereWithAggregatesInput[]
    OR?: pegawaiScalarWhereWithAggregatesInput[]
    NOT?: pegawaiScalarWhereWithAggregatesInput | pegawaiScalarWhereWithAggregatesInput[]
    nup?: StringWithAggregatesFilter<"pegawai"> | string
    nama_pegawai?: StringWithAggregatesFilter<"pegawai"> | string
    status_pegawai?: StringNullableWithAggregatesFilter<"pegawai"> | string | null
    jabatan?: StringNullableWithAggregatesFilter<"pegawai"> | string | null
    tempat_lahir?: StringNullableWithAggregatesFilter<"pegawai"> | string | null
    tanggal_lahir?: DateTimeNullableWithAggregatesFilter<"pegawai"> | Date | string | null
    alamat?: StringNullableWithAggregatesFilter<"pegawai"> | string | null
    warga_negara?: StringNullableWithAggregatesFilter<"pegawai"> | string | null
    agama?: StringNullableWithAggregatesFilter<"pegawai"> | string | null
    no_telepon?: StringNullableWithAggregatesFilter<"pegawai"> | string | null
    email?: StringNullableWithAggregatesFilter<"pegawai"> | string | null
    password?: StringWithAggregatesFilter<"pegawai"> | string
    role?: StringNullableWithAggregatesFilter<"pegawai"> | string | null
    username?: StringNullableWithAggregatesFilter<"pegawai"> | string | null
    id?: IntWithAggregatesFilter<"pegawai"> | number
    nik?: StringNullableWithAggregatesFilter<"pegawai"> | string | null
  }

  export type pelatihanWhereInput = {
    AND?: pelatihanWhereInput | pelatihanWhereInput[]
    OR?: pelatihanWhereInput[]
    NOT?: pelatihanWhereInput | pelatihanWhereInput[]
    id_pelatihan?: IntFilter<"pelatihan"> | number
    nup?: StringNullableFilter<"pelatihan"> | string | null
    nama_pelatihan?: StringNullableFilter<"pelatihan"> | string | null
    penyelenggara?: StringNullableFilter<"pelatihan"> | string | null
    nomor_sertifikat?: StringNullableFilter<"pelatihan"> | string | null
    file_sertifikat?: StringNullableFilter<"pelatihan"> | string | null
    tanggal_awal?: DateTimeNullableFilter<"pelatihan"> | Date | string | null
    masa_berlaku?: DateTimeNullableFilter<"pelatihan"> | Date | string | null
    status?: EnumStatusPelatihanFilter<"pelatihan"> | $Enums.StatusPelatihan
    keterangan_utilisasi?: StringNullableFilter<"pelatihan"> | string | null
    tahun?: IntNullableFilter<"pelatihan"> | number | null
    tanggal_akhir?: DateTimeNullableFilter<"pelatihan"> | Date | string | null
    pegawai?: XOR<PegawaiNullableScalarRelationFilter, pegawaiWhereInput> | null
  }

  export type pelatihanOrderByWithRelationInput = {
    id_pelatihan?: SortOrder
    nup?: SortOrderInput | SortOrder
    nama_pelatihan?: SortOrderInput | SortOrder
    penyelenggara?: SortOrderInput | SortOrder
    nomor_sertifikat?: SortOrderInput | SortOrder
    file_sertifikat?: SortOrderInput | SortOrder
    tanggal_awal?: SortOrderInput | SortOrder
    masa_berlaku?: SortOrderInput | SortOrder
    status?: SortOrder
    keterangan_utilisasi?: SortOrderInput | SortOrder
    tahun?: SortOrderInput | SortOrder
    tanggal_akhir?: SortOrderInput | SortOrder
    pegawai?: pegawaiOrderByWithRelationInput
  }

  export type pelatihanWhereUniqueInput = Prisma.AtLeast<{
    id_pelatihan?: number
    AND?: pelatihanWhereInput | pelatihanWhereInput[]
    OR?: pelatihanWhereInput[]
    NOT?: pelatihanWhereInput | pelatihanWhereInput[]
    nup?: StringNullableFilter<"pelatihan"> | string | null
    nama_pelatihan?: StringNullableFilter<"pelatihan"> | string | null
    penyelenggara?: StringNullableFilter<"pelatihan"> | string | null
    nomor_sertifikat?: StringNullableFilter<"pelatihan"> | string | null
    file_sertifikat?: StringNullableFilter<"pelatihan"> | string | null
    tanggal_awal?: DateTimeNullableFilter<"pelatihan"> | Date | string | null
    masa_berlaku?: DateTimeNullableFilter<"pelatihan"> | Date | string | null
    status?: EnumStatusPelatihanFilter<"pelatihan"> | $Enums.StatusPelatihan
    keterangan_utilisasi?: StringNullableFilter<"pelatihan"> | string | null
    tahun?: IntNullableFilter<"pelatihan"> | number | null
    tanggal_akhir?: DateTimeNullableFilter<"pelatihan"> | Date | string | null
    pegawai?: XOR<PegawaiNullableScalarRelationFilter, pegawaiWhereInput> | null
  }, "id_pelatihan">

  export type pelatihanOrderByWithAggregationInput = {
    id_pelatihan?: SortOrder
    nup?: SortOrderInput | SortOrder
    nama_pelatihan?: SortOrderInput | SortOrder
    penyelenggara?: SortOrderInput | SortOrder
    nomor_sertifikat?: SortOrderInput | SortOrder
    file_sertifikat?: SortOrderInput | SortOrder
    tanggal_awal?: SortOrderInput | SortOrder
    masa_berlaku?: SortOrderInput | SortOrder
    status?: SortOrder
    keterangan_utilisasi?: SortOrderInput | SortOrder
    tahun?: SortOrderInput | SortOrder
    tanggal_akhir?: SortOrderInput | SortOrder
    _count?: pelatihanCountOrderByAggregateInput
    _avg?: pelatihanAvgOrderByAggregateInput
    _max?: pelatihanMaxOrderByAggregateInput
    _min?: pelatihanMinOrderByAggregateInput
    _sum?: pelatihanSumOrderByAggregateInput
  }

  export type pelatihanScalarWhereWithAggregatesInput = {
    AND?: pelatihanScalarWhereWithAggregatesInput | pelatihanScalarWhereWithAggregatesInput[]
    OR?: pelatihanScalarWhereWithAggregatesInput[]
    NOT?: pelatihanScalarWhereWithAggregatesInput | pelatihanScalarWhereWithAggregatesInput[]
    id_pelatihan?: IntWithAggregatesFilter<"pelatihan"> | number
    nup?: StringNullableWithAggregatesFilter<"pelatihan"> | string | null
    nama_pelatihan?: StringNullableWithAggregatesFilter<"pelatihan"> | string | null
    penyelenggara?: StringNullableWithAggregatesFilter<"pelatihan"> | string | null
    nomor_sertifikat?: StringNullableWithAggregatesFilter<"pelatihan"> | string | null
    file_sertifikat?: StringNullableWithAggregatesFilter<"pelatihan"> | string | null
    tanggal_awal?: DateTimeNullableWithAggregatesFilter<"pelatihan"> | Date | string | null
    masa_berlaku?: DateTimeNullableWithAggregatesFilter<"pelatihan"> | Date | string | null
    status?: EnumStatusPelatihanWithAggregatesFilter<"pelatihan"> | $Enums.StatusPelatihan
    keterangan_utilisasi?: StringNullableWithAggregatesFilter<"pelatihan"> | string | null
    tahun?: IntNullableWithAggregatesFilter<"pelatihan"> | number | null
    tanggal_akhir?: DateTimeNullableWithAggregatesFilter<"pelatihan"> | Date | string | null
  }

  export type pengalaman_kerjaWhereInput = {
    AND?: pengalaman_kerjaWhereInput | pengalaman_kerjaWhereInput[]
    OR?: pengalaman_kerjaWhereInput[]
    NOT?: pengalaman_kerjaWhereInput | pengalaman_kerjaWhereInput[]
    id_pengalaman?: IntFilter<"pengalaman_kerja"> | number
    nup?: StringNullableFilter<"pengalaman_kerja"> | string | null
    tahun?: IntNullableFilter<"pengalaman_kerja"> | number | null
    pengalaman_kerja?: StringNullableFilter<"pengalaman_kerja"> | string | null
    perusahaan?: StringNullableFilter<"pengalaman_kerja"> | string | null
    pegawai?: XOR<PegawaiNullableScalarRelationFilter, pegawaiWhereInput> | null
  }

  export type pengalaman_kerjaOrderByWithRelationInput = {
    id_pengalaman?: SortOrder
    nup?: SortOrderInput | SortOrder
    tahun?: SortOrderInput | SortOrder
    pengalaman_kerja?: SortOrderInput | SortOrder
    perusahaan?: SortOrderInput | SortOrder
    pegawai?: pegawaiOrderByWithRelationInput
  }

  export type pengalaman_kerjaWhereUniqueInput = Prisma.AtLeast<{
    id_pengalaman?: number
    AND?: pengalaman_kerjaWhereInput | pengalaman_kerjaWhereInput[]
    OR?: pengalaman_kerjaWhereInput[]
    NOT?: pengalaman_kerjaWhereInput | pengalaman_kerjaWhereInput[]
    nup?: StringNullableFilter<"pengalaman_kerja"> | string | null
    tahun?: IntNullableFilter<"pengalaman_kerja"> | number | null
    pengalaman_kerja?: StringNullableFilter<"pengalaman_kerja"> | string | null
    perusahaan?: StringNullableFilter<"pengalaman_kerja"> | string | null
    pegawai?: XOR<PegawaiNullableScalarRelationFilter, pegawaiWhereInput> | null
  }, "id_pengalaman">

  export type pengalaman_kerjaOrderByWithAggregationInput = {
    id_pengalaman?: SortOrder
    nup?: SortOrderInput | SortOrder
    tahun?: SortOrderInput | SortOrder
    pengalaman_kerja?: SortOrderInput | SortOrder
    perusahaan?: SortOrderInput | SortOrder
    _count?: pengalaman_kerjaCountOrderByAggregateInput
    _avg?: pengalaman_kerjaAvgOrderByAggregateInput
    _max?: pengalaman_kerjaMaxOrderByAggregateInput
    _min?: pengalaman_kerjaMinOrderByAggregateInput
    _sum?: pengalaman_kerjaSumOrderByAggregateInput
  }

  export type pengalaman_kerjaScalarWhereWithAggregatesInput = {
    AND?: pengalaman_kerjaScalarWhereWithAggregatesInput | pengalaman_kerjaScalarWhereWithAggregatesInput[]
    OR?: pengalaman_kerjaScalarWhereWithAggregatesInput[]
    NOT?: pengalaman_kerjaScalarWhereWithAggregatesInput | pengalaman_kerjaScalarWhereWithAggregatesInput[]
    id_pengalaman?: IntWithAggregatesFilter<"pengalaman_kerja"> | number
    nup?: StringNullableWithAggregatesFilter<"pengalaman_kerja"> | string | null
    tahun?: IntNullableWithAggregatesFilter<"pengalaman_kerja"> | number | null
    pengalaman_kerja?: StringNullableWithAggregatesFilter<"pengalaman_kerja"> | string | null
    perusahaan?: StringNullableWithAggregatesFilter<"pengalaman_kerja"> | string | null
  }

  export type SuratTugasWhereInput = {
    AND?: SuratTugasWhereInput | SuratTugasWhereInput[]
    OR?: SuratTugasWhereInput[]
    NOT?: SuratTugasWhereInput | SuratTugasWhereInput[]
    id?: IntFilter<"SuratTugas"> | number
    nomor_surat?: StringNullableFilter<"SuratTugas"> | string | null
    klien?: StringFilter<"SuratTugas"> | string
    pekerjaan?: StringFilter<"SuratTugas"> | string
    status_pekerjaan?: StringNullableFilter<"SuratTugas"> | string | null
    no_service_order?: StringNullableFilter<"SuratTugas"> | string | null
    bidang_pekerjaan?: StringNullableFilter<"SuratTugas"> | string | null
    peralatan_inspeksi?: StringNullableListFilter<"SuratTugas">
    kebutuhan_material?: StringNullableListFilter<"SuratTugas">
    lokasi_pekerjaan?: StringNullableListFilter<"SuratTugas">
    tanggal_berangkat?: DateTimeNullableFilter<"SuratTugas"> | Date | string | null
    tanggal_kembali?: DateTimeNullableFilter<"SuratTugas"> | Date | string | null
    transportasi_operasional?: BoolFilter<"SuratTugas"> | boolean
    transportasi_ditanggung_klien?: BoolFilter<"SuratTugas"> | boolean
    transportasi_asal_tujuan?: BoolFilter<"SuratTugas"> | boolean
    transportasi_dinas?: BoolFilter<"SuratTugas"> | boolean
    tiket?: BoolFilter<"SuratTugas"> | boolean
    penginapan?: BoolFilter<"SuratTugas"> | boolean
    keterangan_lain?: StringNullableFilter<"SuratTugas"> | string | null
    createdAt?: DateTimeFilter<"SuratTugas"> | Date | string
    updatedAt?: DateTimeFilter<"SuratTugas"> | Date | string
    spi?: StringNullableFilter<"SuratTugas"> | string | null
    wbs?: StringNullableFilter<"SuratTugas"> | string | null
    status?: EnumStatusSuratTugasFilter<"SuratTugas"> | $Enums.StatusSuratTugas
    pegawai_surat_tugas?: PegawaiSuratTugasListRelationFilter
  }

  export type SuratTugasOrderByWithRelationInput = {
    id?: SortOrder
    nomor_surat?: SortOrderInput | SortOrder
    klien?: SortOrder
    pekerjaan?: SortOrder
    status_pekerjaan?: SortOrderInput | SortOrder
    no_service_order?: SortOrderInput | SortOrder
    bidang_pekerjaan?: SortOrderInput | SortOrder
    peralatan_inspeksi?: SortOrder
    kebutuhan_material?: SortOrder
    lokasi_pekerjaan?: SortOrder
    tanggal_berangkat?: SortOrderInput | SortOrder
    tanggal_kembali?: SortOrderInput | SortOrder
    transportasi_operasional?: SortOrder
    transportasi_ditanggung_klien?: SortOrder
    transportasi_asal_tujuan?: SortOrder
    transportasi_dinas?: SortOrder
    tiket?: SortOrder
    penginapan?: SortOrder
    keterangan_lain?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    spi?: SortOrderInput | SortOrder
    wbs?: SortOrderInput | SortOrder
    status?: SortOrder
    pegawai_surat_tugas?: PegawaiSuratTugasOrderByRelationAggregateInput
  }

  export type SuratTugasWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    nomor_surat?: string
    AND?: SuratTugasWhereInput | SuratTugasWhereInput[]
    OR?: SuratTugasWhereInput[]
    NOT?: SuratTugasWhereInput | SuratTugasWhereInput[]
    klien?: StringFilter<"SuratTugas"> | string
    pekerjaan?: StringFilter<"SuratTugas"> | string
    status_pekerjaan?: StringNullableFilter<"SuratTugas"> | string | null
    no_service_order?: StringNullableFilter<"SuratTugas"> | string | null
    bidang_pekerjaan?: StringNullableFilter<"SuratTugas"> | string | null
    peralatan_inspeksi?: StringNullableListFilter<"SuratTugas">
    kebutuhan_material?: StringNullableListFilter<"SuratTugas">
    lokasi_pekerjaan?: StringNullableListFilter<"SuratTugas">
    tanggal_berangkat?: DateTimeNullableFilter<"SuratTugas"> | Date | string | null
    tanggal_kembali?: DateTimeNullableFilter<"SuratTugas"> | Date | string | null
    transportasi_operasional?: BoolFilter<"SuratTugas"> | boolean
    transportasi_ditanggung_klien?: BoolFilter<"SuratTugas"> | boolean
    transportasi_asal_tujuan?: BoolFilter<"SuratTugas"> | boolean
    transportasi_dinas?: BoolFilter<"SuratTugas"> | boolean
    tiket?: BoolFilter<"SuratTugas"> | boolean
    penginapan?: BoolFilter<"SuratTugas"> | boolean
    keterangan_lain?: StringNullableFilter<"SuratTugas"> | string | null
    createdAt?: DateTimeFilter<"SuratTugas"> | Date | string
    updatedAt?: DateTimeFilter<"SuratTugas"> | Date | string
    spi?: StringNullableFilter<"SuratTugas"> | string | null
    wbs?: StringNullableFilter<"SuratTugas"> | string | null
    status?: EnumStatusSuratTugasFilter<"SuratTugas"> | $Enums.StatusSuratTugas
    pegawai_surat_tugas?: PegawaiSuratTugasListRelationFilter
  }, "id" | "nomor_surat">

  export type SuratTugasOrderByWithAggregationInput = {
    id?: SortOrder
    nomor_surat?: SortOrderInput | SortOrder
    klien?: SortOrder
    pekerjaan?: SortOrder
    status_pekerjaan?: SortOrderInput | SortOrder
    no_service_order?: SortOrderInput | SortOrder
    bidang_pekerjaan?: SortOrderInput | SortOrder
    peralatan_inspeksi?: SortOrder
    kebutuhan_material?: SortOrder
    lokasi_pekerjaan?: SortOrder
    tanggal_berangkat?: SortOrderInput | SortOrder
    tanggal_kembali?: SortOrderInput | SortOrder
    transportasi_operasional?: SortOrder
    transportasi_ditanggung_klien?: SortOrder
    transportasi_asal_tujuan?: SortOrder
    transportasi_dinas?: SortOrder
    tiket?: SortOrder
    penginapan?: SortOrder
    keterangan_lain?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    spi?: SortOrderInput | SortOrder
    wbs?: SortOrderInput | SortOrder
    status?: SortOrder
    _count?: SuratTugasCountOrderByAggregateInput
    _avg?: SuratTugasAvgOrderByAggregateInput
    _max?: SuratTugasMaxOrderByAggregateInput
    _min?: SuratTugasMinOrderByAggregateInput
    _sum?: SuratTugasSumOrderByAggregateInput
  }

  export type SuratTugasScalarWhereWithAggregatesInput = {
    AND?: SuratTugasScalarWhereWithAggregatesInput | SuratTugasScalarWhereWithAggregatesInput[]
    OR?: SuratTugasScalarWhereWithAggregatesInput[]
    NOT?: SuratTugasScalarWhereWithAggregatesInput | SuratTugasScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SuratTugas"> | number
    nomor_surat?: StringNullableWithAggregatesFilter<"SuratTugas"> | string | null
    klien?: StringWithAggregatesFilter<"SuratTugas"> | string
    pekerjaan?: StringWithAggregatesFilter<"SuratTugas"> | string
    status_pekerjaan?: StringNullableWithAggregatesFilter<"SuratTugas"> | string | null
    no_service_order?: StringNullableWithAggregatesFilter<"SuratTugas"> | string | null
    bidang_pekerjaan?: StringNullableWithAggregatesFilter<"SuratTugas"> | string | null
    peralatan_inspeksi?: StringNullableListFilter<"SuratTugas">
    kebutuhan_material?: StringNullableListFilter<"SuratTugas">
    lokasi_pekerjaan?: StringNullableListFilter<"SuratTugas">
    tanggal_berangkat?: DateTimeNullableWithAggregatesFilter<"SuratTugas"> | Date | string | null
    tanggal_kembali?: DateTimeNullableWithAggregatesFilter<"SuratTugas"> | Date | string | null
    transportasi_operasional?: BoolWithAggregatesFilter<"SuratTugas"> | boolean
    transportasi_ditanggung_klien?: BoolWithAggregatesFilter<"SuratTugas"> | boolean
    transportasi_asal_tujuan?: BoolWithAggregatesFilter<"SuratTugas"> | boolean
    transportasi_dinas?: BoolWithAggregatesFilter<"SuratTugas"> | boolean
    tiket?: BoolWithAggregatesFilter<"SuratTugas"> | boolean
    penginapan?: BoolWithAggregatesFilter<"SuratTugas"> | boolean
    keterangan_lain?: StringNullableWithAggregatesFilter<"SuratTugas"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SuratTugas"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SuratTugas"> | Date | string
    spi?: StringNullableWithAggregatesFilter<"SuratTugas"> | string | null
    wbs?: StringNullableWithAggregatesFilter<"SuratTugas"> | string | null
    status?: EnumStatusSuratTugasWithAggregatesFilter<"SuratTugas"> | $Enums.StatusSuratTugas
  }

  export type PegawaiSuratTugasWhereInput = {
    AND?: PegawaiSuratTugasWhereInput | PegawaiSuratTugasWhereInput[]
    OR?: PegawaiSuratTugasWhereInput[]
    NOT?: PegawaiSuratTugasWhereInput | PegawaiSuratTugasWhereInput[]
    id?: IntFilter<"PegawaiSuratTugas"> | number
    suratTugasId?: IntFilter<"PegawaiSuratTugas"> | number
    pegawaiNup?: StringFilter<"PegawaiSuratTugas"> | string
    jabatan?: StringNullableFilter<"PegawaiSuratTugas"> | string | null
    approved?: BoolFilter<"PegawaiSuratTugas"> | boolean
    approvedBy?: StringNullableFilter<"PegawaiSuratTugas"> | string | null
    approvedAt?: DateTimeNullableFilter<"PegawaiSuratTugas"> | Date | string | null
    pegawai?: XOR<PegawaiScalarRelationFilter, pegawaiWhereInput>
    suratTugas?: XOR<SuratTugasScalarRelationFilter, SuratTugasWhereInput>
  }

  export type PegawaiSuratTugasOrderByWithRelationInput = {
    id?: SortOrder
    suratTugasId?: SortOrder
    pegawaiNup?: SortOrder
    jabatan?: SortOrderInput | SortOrder
    approved?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    pegawai?: pegawaiOrderByWithRelationInput
    suratTugas?: SuratTugasOrderByWithRelationInput
  }

  export type PegawaiSuratTugasWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PegawaiSuratTugasWhereInput | PegawaiSuratTugasWhereInput[]
    OR?: PegawaiSuratTugasWhereInput[]
    NOT?: PegawaiSuratTugasWhereInput | PegawaiSuratTugasWhereInput[]
    suratTugasId?: IntFilter<"PegawaiSuratTugas"> | number
    pegawaiNup?: StringFilter<"PegawaiSuratTugas"> | string
    jabatan?: StringNullableFilter<"PegawaiSuratTugas"> | string | null
    approved?: BoolFilter<"PegawaiSuratTugas"> | boolean
    approvedBy?: StringNullableFilter<"PegawaiSuratTugas"> | string | null
    approvedAt?: DateTimeNullableFilter<"PegawaiSuratTugas"> | Date | string | null
    pegawai?: XOR<PegawaiScalarRelationFilter, pegawaiWhereInput>
    suratTugas?: XOR<SuratTugasScalarRelationFilter, SuratTugasWhereInput>
  }, "id">

  export type PegawaiSuratTugasOrderByWithAggregationInput = {
    id?: SortOrder
    suratTugasId?: SortOrder
    pegawaiNup?: SortOrder
    jabatan?: SortOrderInput | SortOrder
    approved?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    _count?: PegawaiSuratTugasCountOrderByAggregateInput
    _avg?: PegawaiSuratTugasAvgOrderByAggregateInput
    _max?: PegawaiSuratTugasMaxOrderByAggregateInput
    _min?: PegawaiSuratTugasMinOrderByAggregateInput
    _sum?: PegawaiSuratTugasSumOrderByAggregateInput
  }

  export type PegawaiSuratTugasScalarWhereWithAggregatesInput = {
    AND?: PegawaiSuratTugasScalarWhereWithAggregatesInput | PegawaiSuratTugasScalarWhereWithAggregatesInput[]
    OR?: PegawaiSuratTugasScalarWhereWithAggregatesInput[]
    NOT?: PegawaiSuratTugasScalarWhereWithAggregatesInput | PegawaiSuratTugasScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PegawaiSuratTugas"> | number
    suratTugasId?: IntWithAggregatesFilter<"PegawaiSuratTugas"> | number
    pegawaiNup?: StringWithAggregatesFilter<"PegawaiSuratTugas"> | string
    jabatan?: StringNullableWithAggregatesFilter<"PegawaiSuratTugas"> | string | null
    approved?: BoolWithAggregatesFilter<"PegawaiSuratTugas"> | boolean
    approvedBy?: StringNullableWithAggregatesFilter<"PegawaiSuratTugas"> | string | null
    approvedAt?: DateTimeNullableWithAggregatesFilter<"PegawaiSuratTugas"> | Date | string | null
  }

  export type pegawaiCreateInput = {
    nup: string
    nama_pegawai: string
    status_pegawai?: string | null
    jabatan?: string | null
    tempat_lahir?: string | null
    tanggal_lahir?: Date | string | null
    alamat?: string | null
    warga_negara?: string | null
    agama?: string | null
    no_telepon?: string | null
    email?: string | null
    password: string
    role?: string | null
    username?: string | null
    id?: number
    nik?: string | null
    pegawai_surat_tugas?: PegawaiSuratTugasCreateNestedManyWithoutPegawaiInput
    pelatihan?: pelatihanCreateNestedManyWithoutPegawaiInput
    pengalaman_kerja?: pengalaman_kerjaCreateNestedManyWithoutPegawaiInput
  }

  export type pegawaiUncheckedCreateInput = {
    nup: string
    nama_pegawai: string
    status_pegawai?: string | null
    jabatan?: string | null
    tempat_lahir?: string | null
    tanggal_lahir?: Date | string | null
    alamat?: string | null
    warga_negara?: string | null
    agama?: string | null
    no_telepon?: string | null
    email?: string | null
    password: string
    role?: string | null
    username?: string | null
    id?: number
    nik?: string | null
    pegawai_surat_tugas?: PegawaiSuratTugasUncheckedCreateNestedManyWithoutPegawaiInput
    pelatihan?: pelatihanUncheckedCreateNestedManyWithoutPegawaiInput
    pengalaman_kerja?: pengalaman_kerjaUncheckedCreateNestedManyWithoutPegawaiInput
  }

  export type pegawaiUpdateInput = {
    nup?: StringFieldUpdateOperationsInput | string
    nama_pegawai?: StringFieldUpdateOperationsInput | string
    status_pegawai?: NullableStringFieldUpdateOperationsInput | string | null
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    tempat_lahir?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_lahir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    alamat?: NullableStringFieldUpdateOperationsInput | string | null
    warga_negara?: NullableStringFieldUpdateOperationsInput | string | null
    agama?: NullableStringFieldUpdateOperationsInput | string | null
    no_telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: NullableStringFieldUpdateOperationsInput | string | null
    pegawai_surat_tugas?: PegawaiSuratTugasUpdateManyWithoutPegawaiNestedInput
    pelatihan?: pelatihanUpdateManyWithoutPegawaiNestedInput
    pengalaman_kerja?: pengalaman_kerjaUpdateManyWithoutPegawaiNestedInput
  }

  export type pegawaiUncheckedUpdateInput = {
    nup?: StringFieldUpdateOperationsInput | string
    nama_pegawai?: StringFieldUpdateOperationsInput | string
    status_pegawai?: NullableStringFieldUpdateOperationsInput | string | null
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    tempat_lahir?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_lahir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    alamat?: NullableStringFieldUpdateOperationsInput | string | null
    warga_negara?: NullableStringFieldUpdateOperationsInput | string | null
    agama?: NullableStringFieldUpdateOperationsInput | string | null
    no_telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    id?: IntFieldUpdateOperationsInput | number
    nik?: NullableStringFieldUpdateOperationsInput | string | null
    pegawai_surat_tugas?: PegawaiSuratTugasUncheckedUpdateManyWithoutPegawaiNestedInput
    pelatihan?: pelatihanUncheckedUpdateManyWithoutPegawaiNestedInput
    pengalaman_kerja?: pengalaman_kerjaUncheckedUpdateManyWithoutPegawaiNestedInput
  }

  export type pegawaiCreateManyInput = {
    nup: string
    nama_pegawai: string
    status_pegawai?: string | null
    jabatan?: string | null
    tempat_lahir?: string | null
    tanggal_lahir?: Date | string | null
    alamat?: string | null
    warga_negara?: string | null
    agama?: string | null
    no_telepon?: string | null
    email?: string | null
    password: string
    role?: string | null
    username?: string | null
    id?: number
    nik?: string | null
  }

  export type pegawaiUpdateManyMutationInput = {
    nup?: StringFieldUpdateOperationsInput | string
    nama_pegawai?: StringFieldUpdateOperationsInput | string
    status_pegawai?: NullableStringFieldUpdateOperationsInput | string | null
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    tempat_lahir?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_lahir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    alamat?: NullableStringFieldUpdateOperationsInput | string | null
    warga_negara?: NullableStringFieldUpdateOperationsInput | string | null
    agama?: NullableStringFieldUpdateOperationsInput | string | null
    no_telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type pegawaiUncheckedUpdateManyInput = {
    nup?: StringFieldUpdateOperationsInput | string
    nama_pegawai?: StringFieldUpdateOperationsInput | string
    status_pegawai?: NullableStringFieldUpdateOperationsInput | string | null
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    tempat_lahir?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_lahir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    alamat?: NullableStringFieldUpdateOperationsInput | string | null
    warga_negara?: NullableStringFieldUpdateOperationsInput | string | null
    agama?: NullableStringFieldUpdateOperationsInput | string | null
    no_telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    id?: IntFieldUpdateOperationsInput | number
    nik?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type pelatihanCreateInput = {
    nama_pelatihan?: string | null
    penyelenggara?: string | null
    nomor_sertifikat?: string | null
    file_sertifikat?: string | null
    tanggal_awal?: Date | string | null
    masa_berlaku?: Date | string | null
    status: $Enums.StatusPelatihan
    keterangan_utilisasi?: string | null
    tahun?: number | null
    tanggal_akhir?: Date | string | null
    pegawai?: pegawaiCreateNestedOneWithoutPelatihanInput
  }

  export type pelatihanUncheckedCreateInput = {
    id_pelatihan?: number
    nup?: string | null
    nama_pelatihan?: string | null
    penyelenggara?: string | null
    nomor_sertifikat?: string | null
    file_sertifikat?: string | null
    tanggal_awal?: Date | string | null
    masa_berlaku?: Date | string | null
    status: $Enums.StatusPelatihan
    keterangan_utilisasi?: string | null
    tahun?: number | null
    tanggal_akhir?: Date | string | null
  }

  export type pelatihanUpdateInput = {
    nama_pelatihan?: NullableStringFieldUpdateOperationsInput | string | null
    penyelenggara?: NullableStringFieldUpdateOperationsInput | string | null
    nomor_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    file_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_awal?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    masa_berlaku?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusPelatihanFieldUpdateOperationsInput | $Enums.StatusPelatihan
    keterangan_utilisasi?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    tanggal_akhir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pegawai?: pegawaiUpdateOneWithoutPelatihanNestedInput
  }

  export type pelatihanUncheckedUpdateInput = {
    id_pelatihan?: IntFieldUpdateOperationsInput | number
    nup?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pelatihan?: NullableStringFieldUpdateOperationsInput | string | null
    penyelenggara?: NullableStringFieldUpdateOperationsInput | string | null
    nomor_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    file_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_awal?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    masa_berlaku?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusPelatihanFieldUpdateOperationsInput | $Enums.StatusPelatihan
    keterangan_utilisasi?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    tanggal_akhir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type pelatihanCreateManyInput = {
    id_pelatihan?: number
    nup?: string | null
    nama_pelatihan?: string | null
    penyelenggara?: string | null
    nomor_sertifikat?: string | null
    file_sertifikat?: string | null
    tanggal_awal?: Date | string | null
    masa_berlaku?: Date | string | null
    status: $Enums.StatusPelatihan
    keterangan_utilisasi?: string | null
    tahun?: number | null
    tanggal_akhir?: Date | string | null
  }

  export type pelatihanUpdateManyMutationInput = {
    nama_pelatihan?: NullableStringFieldUpdateOperationsInput | string | null
    penyelenggara?: NullableStringFieldUpdateOperationsInput | string | null
    nomor_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    file_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_awal?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    masa_berlaku?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusPelatihanFieldUpdateOperationsInput | $Enums.StatusPelatihan
    keterangan_utilisasi?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    tanggal_akhir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type pelatihanUncheckedUpdateManyInput = {
    id_pelatihan?: IntFieldUpdateOperationsInput | number
    nup?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pelatihan?: NullableStringFieldUpdateOperationsInput | string | null
    penyelenggara?: NullableStringFieldUpdateOperationsInput | string | null
    nomor_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    file_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_awal?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    masa_berlaku?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusPelatihanFieldUpdateOperationsInput | $Enums.StatusPelatihan
    keterangan_utilisasi?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    tanggal_akhir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type pengalaman_kerjaCreateInput = {
    tahun?: number | null
    pengalaman_kerja?: string | null
    perusahaan?: string | null
    pegawai?: pegawaiCreateNestedOneWithoutPengalaman_kerjaInput
  }

  export type pengalaman_kerjaUncheckedCreateInput = {
    id_pengalaman?: number
    nup?: string | null
    tahun?: number | null
    pengalaman_kerja?: string | null
    perusahaan?: string | null
  }

  export type pengalaman_kerjaUpdateInput = {
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    pengalaman_kerja?: NullableStringFieldUpdateOperationsInput | string | null
    perusahaan?: NullableStringFieldUpdateOperationsInput | string | null
    pegawai?: pegawaiUpdateOneWithoutPengalaman_kerjaNestedInput
  }

  export type pengalaman_kerjaUncheckedUpdateInput = {
    id_pengalaman?: IntFieldUpdateOperationsInput | number
    nup?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    pengalaman_kerja?: NullableStringFieldUpdateOperationsInput | string | null
    perusahaan?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type pengalaman_kerjaCreateManyInput = {
    id_pengalaman?: number
    nup?: string | null
    tahun?: number | null
    pengalaman_kerja?: string | null
    perusahaan?: string | null
  }

  export type pengalaman_kerjaUpdateManyMutationInput = {
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    pengalaman_kerja?: NullableStringFieldUpdateOperationsInput | string | null
    perusahaan?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type pengalaman_kerjaUncheckedUpdateManyInput = {
    id_pengalaman?: IntFieldUpdateOperationsInput | number
    nup?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    pengalaman_kerja?: NullableStringFieldUpdateOperationsInput | string | null
    perusahaan?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SuratTugasCreateInput = {
    nomor_surat?: string | null
    klien: string
    pekerjaan: string
    status_pekerjaan?: string | null
    no_service_order?: string | null
    bidang_pekerjaan?: string | null
    peralatan_inspeksi?: SuratTugasCreateperalatan_inspeksiInput | string[]
    kebutuhan_material?: SuratTugasCreatekebutuhan_materialInput | string[]
    lokasi_pekerjaan?: SuratTugasCreatelokasi_pekerjaanInput | string[]
    tanggal_berangkat?: Date | string | null
    tanggal_kembali?: Date | string | null
    transportasi_operasional?: boolean
    transportasi_ditanggung_klien?: boolean
    transportasi_asal_tujuan?: boolean
    transportasi_dinas?: boolean
    tiket?: boolean
    penginapan?: boolean
    keterangan_lain?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    spi?: string | null
    wbs?: string | null
    status?: $Enums.StatusSuratTugas
    pegawai_surat_tugas?: PegawaiSuratTugasCreateNestedManyWithoutSuratTugasInput
  }

  export type SuratTugasUncheckedCreateInput = {
    id?: number
    nomor_surat?: string | null
    klien: string
    pekerjaan: string
    status_pekerjaan?: string | null
    no_service_order?: string | null
    bidang_pekerjaan?: string | null
    peralatan_inspeksi?: SuratTugasCreateperalatan_inspeksiInput | string[]
    kebutuhan_material?: SuratTugasCreatekebutuhan_materialInput | string[]
    lokasi_pekerjaan?: SuratTugasCreatelokasi_pekerjaanInput | string[]
    tanggal_berangkat?: Date | string | null
    tanggal_kembali?: Date | string | null
    transportasi_operasional?: boolean
    transportasi_ditanggung_klien?: boolean
    transportasi_asal_tujuan?: boolean
    transportasi_dinas?: boolean
    tiket?: boolean
    penginapan?: boolean
    keterangan_lain?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    spi?: string | null
    wbs?: string | null
    status?: $Enums.StatusSuratTugas
    pegawai_surat_tugas?: PegawaiSuratTugasUncheckedCreateNestedManyWithoutSuratTugasInput
  }

  export type SuratTugasUpdateInput = {
    nomor_surat?: NullableStringFieldUpdateOperationsInput | string | null
    klien?: StringFieldUpdateOperationsInput | string
    pekerjaan?: StringFieldUpdateOperationsInput | string
    status_pekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    no_service_order?: NullableStringFieldUpdateOperationsInput | string | null
    bidang_pekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    peralatan_inspeksi?: SuratTugasUpdateperalatan_inspeksiInput | string[]
    kebutuhan_material?: SuratTugasUpdatekebutuhan_materialInput | string[]
    lokasi_pekerjaan?: SuratTugasUpdatelokasi_pekerjaanInput | string[]
    tanggal_berangkat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggal_kembali?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transportasi_operasional?: BoolFieldUpdateOperationsInput | boolean
    transportasi_ditanggung_klien?: BoolFieldUpdateOperationsInput | boolean
    transportasi_asal_tujuan?: BoolFieldUpdateOperationsInput | boolean
    transportasi_dinas?: BoolFieldUpdateOperationsInput | boolean
    tiket?: BoolFieldUpdateOperationsInput | boolean
    penginapan?: BoolFieldUpdateOperationsInput | boolean
    keterangan_lain?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spi?: NullableStringFieldUpdateOperationsInput | string | null
    wbs?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusSuratTugasFieldUpdateOperationsInput | $Enums.StatusSuratTugas
    pegawai_surat_tugas?: PegawaiSuratTugasUpdateManyWithoutSuratTugasNestedInput
  }

  export type SuratTugasUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nomor_surat?: NullableStringFieldUpdateOperationsInput | string | null
    klien?: StringFieldUpdateOperationsInput | string
    pekerjaan?: StringFieldUpdateOperationsInput | string
    status_pekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    no_service_order?: NullableStringFieldUpdateOperationsInput | string | null
    bidang_pekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    peralatan_inspeksi?: SuratTugasUpdateperalatan_inspeksiInput | string[]
    kebutuhan_material?: SuratTugasUpdatekebutuhan_materialInput | string[]
    lokasi_pekerjaan?: SuratTugasUpdatelokasi_pekerjaanInput | string[]
    tanggal_berangkat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggal_kembali?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transportasi_operasional?: BoolFieldUpdateOperationsInput | boolean
    transportasi_ditanggung_klien?: BoolFieldUpdateOperationsInput | boolean
    transportasi_asal_tujuan?: BoolFieldUpdateOperationsInput | boolean
    transportasi_dinas?: BoolFieldUpdateOperationsInput | boolean
    tiket?: BoolFieldUpdateOperationsInput | boolean
    penginapan?: BoolFieldUpdateOperationsInput | boolean
    keterangan_lain?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spi?: NullableStringFieldUpdateOperationsInput | string | null
    wbs?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusSuratTugasFieldUpdateOperationsInput | $Enums.StatusSuratTugas
    pegawai_surat_tugas?: PegawaiSuratTugasUncheckedUpdateManyWithoutSuratTugasNestedInput
  }

  export type SuratTugasCreateManyInput = {
    id?: number
    nomor_surat?: string | null
    klien: string
    pekerjaan: string
    status_pekerjaan?: string | null
    no_service_order?: string | null
    bidang_pekerjaan?: string | null
    peralatan_inspeksi?: SuratTugasCreateperalatan_inspeksiInput | string[]
    kebutuhan_material?: SuratTugasCreatekebutuhan_materialInput | string[]
    lokasi_pekerjaan?: SuratTugasCreatelokasi_pekerjaanInput | string[]
    tanggal_berangkat?: Date | string | null
    tanggal_kembali?: Date | string | null
    transportasi_operasional?: boolean
    transportasi_ditanggung_klien?: boolean
    transportasi_asal_tujuan?: boolean
    transportasi_dinas?: boolean
    tiket?: boolean
    penginapan?: boolean
    keterangan_lain?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    spi?: string | null
    wbs?: string | null
    status?: $Enums.StatusSuratTugas
  }

  export type SuratTugasUpdateManyMutationInput = {
    nomor_surat?: NullableStringFieldUpdateOperationsInput | string | null
    klien?: StringFieldUpdateOperationsInput | string
    pekerjaan?: StringFieldUpdateOperationsInput | string
    status_pekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    no_service_order?: NullableStringFieldUpdateOperationsInput | string | null
    bidang_pekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    peralatan_inspeksi?: SuratTugasUpdateperalatan_inspeksiInput | string[]
    kebutuhan_material?: SuratTugasUpdatekebutuhan_materialInput | string[]
    lokasi_pekerjaan?: SuratTugasUpdatelokasi_pekerjaanInput | string[]
    tanggal_berangkat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggal_kembali?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transportasi_operasional?: BoolFieldUpdateOperationsInput | boolean
    transportasi_ditanggung_klien?: BoolFieldUpdateOperationsInput | boolean
    transportasi_asal_tujuan?: BoolFieldUpdateOperationsInput | boolean
    transportasi_dinas?: BoolFieldUpdateOperationsInput | boolean
    tiket?: BoolFieldUpdateOperationsInput | boolean
    penginapan?: BoolFieldUpdateOperationsInput | boolean
    keterangan_lain?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spi?: NullableStringFieldUpdateOperationsInput | string | null
    wbs?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusSuratTugasFieldUpdateOperationsInput | $Enums.StatusSuratTugas
  }

  export type SuratTugasUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nomor_surat?: NullableStringFieldUpdateOperationsInput | string | null
    klien?: StringFieldUpdateOperationsInput | string
    pekerjaan?: StringFieldUpdateOperationsInput | string
    status_pekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    no_service_order?: NullableStringFieldUpdateOperationsInput | string | null
    bidang_pekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    peralatan_inspeksi?: SuratTugasUpdateperalatan_inspeksiInput | string[]
    kebutuhan_material?: SuratTugasUpdatekebutuhan_materialInput | string[]
    lokasi_pekerjaan?: SuratTugasUpdatelokasi_pekerjaanInput | string[]
    tanggal_berangkat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggal_kembali?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transportasi_operasional?: BoolFieldUpdateOperationsInput | boolean
    transportasi_ditanggung_klien?: BoolFieldUpdateOperationsInput | boolean
    transportasi_asal_tujuan?: BoolFieldUpdateOperationsInput | boolean
    transportasi_dinas?: BoolFieldUpdateOperationsInput | boolean
    tiket?: BoolFieldUpdateOperationsInput | boolean
    penginapan?: BoolFieldUpdateOperationsInput | boolean
    keterangan_lain?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spi?: NullableStringFieldUpdateOperationsInput | string | null
    wbs?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusSuratTugasFieldUpdateOperationsInput | $Enums.StatusSuratTugas
  }

  export type PegawaiSuratTugasCreateInput = {
    jabatan?: string | null
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
    pegawai: pegawaiCreateNestedOneWithoutPegawai_surat_tugasInput
    suratTugas: SuratTugasCreateNestedOneWithoutPegawai_surat_tugasInput
  }

  export type PegawaiSuratTugasUncheckedCreateInput = {
    id?: number
    suratTugasId: number
    pegawaiNup: string
    jabatan?: string | null
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
  }

  export type PegawaiSuratTugasUpdateInput = {
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pegawai?: pegawaiUpdateOneRequiredWithoutPegawai_surat_tugasNestedInput
    suratTugas?: SuratTugasUpdateOneRequiredWithoutPegawai_surat_tugasNestedInput
  }

  export type PegawaiSuratTugasUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    suratTugasId?: IntFieldUpdateOperationsInput | number
    pegawaiNup?: StringFieldUpdateOperationsInput | string
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PegawaiSuratTugasCreateManyInput = {
    id?: number
    suratTugasId: number
    pegawaiNup: string
    jabatan?: string | null
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
  }

  export type PegawaiSuratTugasUpdateManyMutationInput = {
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PegawaiSuratTugasUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    suratTugasId?: IntFieldUpdateOperationsInput | number
    pegawaiNup?: StringFieldUpdateOperationsInput | string
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type PegawaiSuratTugasListRelationFilter = {
    every?: PegawaiSuratTugasWhereInput
    some?: PegawaiSuratTugasWhereInput
    none?: PegawaiSuratTugasWhereInput
  }

  export type PelatihanListRelationFilter = {
    every?: pelatihanWhereInput
    some?: pelatihanWhereInput
    none?: pelatihanWhereInput
  }

  export type Pengalaman_kerjaListRelationFilter = {
    every?: pengalaman_kerjaWhereInput
    some?: pengalaman_kerjaWhereInput
    none?: pengalaman_kerjaWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PegawaiSuratTugasOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type pelatihanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type pengalaman_kerjaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type pegawaiCountOrderByAggregateInput = {
    nup?: SortOrder
    nama_pegawai?: SortOrder
    status_pegawai?: SortOrder
    jabatan?: SortOrder
    tempat_lahir?: SortOrder
    tanggal_lahir?: SortOrder
    alamat?: SortOrder
    warga_negara?: SortOrder
    agama?: SortOrder
    no_telepon?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    username?: SortOrder
    id?: SortOrder
    nik?: SortOrder
  }

  export type pegawaiAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type pegawaiMaxOrderByAggregateInput = {
    nup?: SortOrder
    nama_pegawai?: SortOrder
    status_pegawai?: SortOrder
    jabatan?: SortOrder
    tempat_lahir?: SortOrder
    tanggal_lahir?: SortOrder
    alamat?: SortOrder
    warga_negara?: SortOrder
    agama?: SortOrder
    no_telepon?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    username?: SortOrder
    id?: SortOrder
    nik?: SortOrder
  }

  export type pegawaiMinOrderByAggregateInput = {
    nup?: SortOrder
    nama_pegawai?: SortOrder
    status_pegawai?: SortOrder
    jabatan?: SortOrder
    tempat_lahir?: SortOrder
    tanggal_lahir?: SortOrder
    alamat?: SortOrder
    warga_negara?: SortOrder
    agama?: SortOrder
    no_telepon?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    username?: SortOrder
    id?: SortOrder
    nik?: SortOrder
  }

  export type pegawaiSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumStatusPelatihanFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusPelatihan | EnumStatusPelatihanFieldRefInput<$PrismaModel>
    in?: $Enums.StatusPelatihan[] | ListEnumStatusPelatihanFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusPelatihan[] | ListEnumStatusPelatihanFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusPelatihanFilter<$PrismaModel> | $Enums.StatusPelatihan
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type PegawaiNullableScalarRelationFilter = {
    is?: pegawaiWhereInput | null
    isNot?: pegawaiWhereInput | null
  }

  export type pelatihanCountOrderByAggregateInput = {
    id_pelatihan?: SortOrder
    nup?: SortOrder
    nama_pelatihan?: SortOrder
    penyelenggara?: SortOrder
    nomor_sertifikat?: SortOrder
    file_sertifikat?: SortOrder
    tanggal_awal?: SortOrder
    masa_berlaku?: SortOrder
    status?: SortOrder
    keterangan_utilisasi?: SortOrder
    tahun?: SortOrder
    tanggal_akhir?: SortOrder
  }

  export type pelatihanAvgOrderByAggregateInput = {
    id_pelatihan?: SortOrder
    tahun?: SortOrder
  }

  export type pelatihanMaxOrderByAggregateInput = {
    id_pelatihan?: SortOrder
    nup?: SortOrder
    nama_pelatihan?: SortOrder
    penyelenggara?: SortOrder
    nomor_sertifikat?: SortOrder
    file_sertifikat?: SortOrder
    tanggal_awal?: SortOrder
    masa_berlaku?: SortOrder
    status?: SortOrder
    keterangan_utilisasi?: SortOrder
    tahun?: SortOrder
    tanggal_akhir?: SortOrder
  }

  export type pelatihanMinOrderByAggregateInput = {
    id_pelatihan?: SortOrder
    nup?: SortOrder
    nama_pelatihan?: SortOrder
    penyelenggara?: SortOrder
    nomor_sertifikat?: SortOrder
    file_sertifikat?: SortOrder
    tanggal_awal?: SortOrder
    masa_berlaku?: SortOrder
    status?: SortOrder
    keterangan_utilisasi?: SortOrder
    tahun?: SortOrder
    tanggal_akhir?: SortOrder
  }

  export type pelatihanSumOrderByAggregateInput = {
    id_pelatihan?: SortOrder
    tahun?: SortOrder
  }

  export type EnumStatusPelatihanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusPelatihan | EnumStatusPelatihanFieldRefInput<$PrismaModel>
    in?: $Enums.StatusPelatihan[] | ListEnumStatusPelatihanFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusPelatihan[] | ListEnumStatusPelatihanFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusPelatihanWithAggregatesFilter<$PrismaModel> | $Enums.StatusPelatihan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusPelatihanFilter<$PrismaModel>
    _max?: NestedEnumStatusPelatihanFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type pengalaman_kerjaCountOrderByAggregateInput = {
    id_pengalaman?: SortOrder
    nup?: SortOrder
    tahun?: SortOrder
    pengalaman_kerja?: SortOrder
    perusahaan?: SortOrder
  }

  export type pengalaman_kerjaAvgOrderByAggregateInput = {
    id_pengalaman?: SortOrder
    tahun?: SortOrder
  }

  export type pengalaman_kerjaMaxOrderByAggregateInput = {
    id_pengalaman?: SortOrder
    nup?: SortOrder
    tahun?: SortOrder
    pengalaman_kerja?: SortOrder
    perusahaan?: SortOrder
  }

  export type pengalaman_kerjaMinOrderByAggregateInput = {
    id_pengalaman?: SortOrder
    nup?: SortOrder
    tahun?: SortOrder
    pengalaman_kerja?: SortOrder
    perusahaan?: SortOrder
  }

  export type pengalaman_kerjaSumOrderByAggregateInput = {
    id_pengalaman?: SortOrder
    tahun?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EnumStatusSuratTugasFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusSuratTugas | EnumStatusSuratTugasFieldRefInput<$PrismaModel>
    in?: $Enums.StatusSuratTugas[] | ListEnumStatusSuratTugasFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusSuratTugas[] | ListEnumStatusSuratTugasFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusSuratTugasFilter<$PrismaModel> | $Enums.StatusSuratTugas
  }

  export type SuratTugasCountOrderByAggregateInput = {
    id?: SortOrder
    nomor_surat?: SortOrder
    klien?: SortOrder
    pekerjaan?: SortOrder
    status_pekerjaan?: SortOrder
    no_service_order?: SortOrder
    bidang_pekerjaan?: SortOrder
    peralatan_inspeksi?: SortOrder
    kebutuhan_material?: SortOrder
    lokasi_pekerjaan?: SortOrder
    tanggal_berangkat?: SortOrder
    tanggal_kembali?: SortOrder
    transportasi_operasional?: SortOrder
    transportasi_ditanggung_klien?: SortOrder
    transportasi_asal_tujuan?: SortOrder
    transportasi_dinas?: SortOrder
    tiket?: SortOrder
    penginapan?: SortOrder
    keterangan_lain?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    spi?: SortOrder
    wbs?: SortOrder
    status?: SortOrder
  }

  export type SuratTugasAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SuratTugasMaxOrderByAggregateInput = {
    id?: SortOrder
    nomor_surat?: SortOrder
    klien?: SortOrder
    pekerjaan?: SortOrder
    status_pekerjaan?: SortOrder
    no_service_order?: SortOrder
    bidang_pekerjaan?: SortOrder
    tanggal_berangkat?: SortOrder
    tanggal_kembali?: SortOrder
    transportasi_operasional?: SortOrder
    transportasi_ditanggung_klien?: SortOrder
    transportasi_asal_tujuan?: SortOrder
    transportasi_dinas?: SortOrder
    tiket?: SortOrder
    penginapan?: SortOrder
    keterangan_lain?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    spi?: SortOrder
    wbs?: SortOrder
    status?: SortOrder
  }

  export type SuratTugasMinOrderByAggregateInput = {
    id?: SortOrder
    nomor_surat?: SortOrder
    klien?: SortOrder
    pekerjaan?: SortOrder
    status_pekerjaan?: SortOrder
    no_service_order?: SortOrder
    bidang_pekerjaan?: SortOrder
    tanggal_berangkat?: SortOrder
    tanggal_kembali?: SortOrder
    transportasi_operasional?: SortOrder
    transportasi_ditanggung_klien?: SortOrder
    transportasi_asal_tujuan?: SortOrder
    transportasi_dinas?: SortOrder
    tiket?: SortOrder
    penginapan?: SortOrder
    keterangan_lain?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    spi?: SortOrder
    wbs?: SortOrder
    status?: SortOrder
  }

  export type SuratTugasSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumStatusSuratTugasWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusSuratTugas | EnumStatusSuratTugasFieldRefInput<$PrismaModel>
    in?: $Enums.StatusSuratTugas[] | ListEnumStatusSuratTugasFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusSuratTugas[] | ListEnumStatusSuratTugasFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusSuratTugasWithAggregatesFilter<$PrismaModel> | $Enums.StatusSuratTugas
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusSuratTugasFilter<$PrismaModel>
    _max?: NestedEnumStatusSuratTugasFilter<$PrismaModel>
  }

  export type PegawaiScalarRelationFilter = {
    is?: pegawaiWhereInput
    isNot?: pegawaiWhereInput
  }

  export type SuratTugasScalarRelationFilter = {
    is?: SuratTugasWhereInput
    isNot?: SuratTugasWhereInput
  }

  export type PegawaiSuratTugasCountOrderByAggregateInput = {
    id?: SortOrder
    suratTugasId?: SortOrder
    pegawaiNup?: SortOrder
    jabatan?: SortOrder
    approved?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
  }

  export type PegawaiSuratTugasAvgOrderByAggregateInput = {
    id?: SortOrder
    suratTugasId?: SortOrder
  }

  export type PegawaiSuratTugasMaxOrderByAggregateInput = {
    id?: SortOrder
    suratTugasId?: SortOrder
    pegawaiNup?: SortOrder
    jabatan?: SortOrder
    approved?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
  }

  export type PegawaiSuratTugasMinOrderByAggregateInput = {
    id?: SortOrder
    suratTugasId?: SortOrder
    pegawaiNup?: SortOrder
    jabatan?: SortOrder
    approved?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
  }

  export type PegawaiSuratTugasSumOrderByAggregateInput = {
    id?: SortOrder
    suratTugasId?: SortOrder
  }

  export type PegawaiSuratTugasCreateNestedManyWithoutPegawaiInput = {
    create?: XOR<PegawaiSuratTugasCreateWithoutPegawaiInput, PegawaiSuratTugasUncheckedCreateWithoutPegawaiInput> | PegawaiSuratTugasCreateWithoutPegawaiInput[] | PegawaiSuratTugasUncheckedCreateWithoutPegawaiInput[]
    connectOrCreate?: PegawaiSuratTugasCreateOrConnectWithoutPegawaiInput | PegawaiSuratTugasCreateOrConnectWithoutPegawaiInput[]
    createMany?: PegawaiSuratTugasCreateManyPegawaiInputEnvelope
    connect?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
  }

  export type pelatihanCreateNestedManyWithoutPegawaiInput = {
    create?: XOR<pelatihanCreateWithoutPegawaiInput, pelatihanUncheckedCreateWithoutPegawaiInput> | pelatihanCreateWithoutPegawaiInput[] | pelatihanUncheckedCreateWithoutPegawaiInput[]
    connectOrCreate?: pelatihanCreateOrConnectWithoutPegawaiInput | pelatihanCreateOrConnectWithoutPegawaiInput[]
    createMany?: pelatihanCreateManyPegawaiInputEnvelope
    connect?: pelatihanWhereUniqueInput | pelatihanWhereUniqueInput[]
  }

  export type pengalaman_kerjaCreateNestedManyWithoutPegawaiInput = {
    create?: XOR<pengalaman_kerjaCreateWithoutPegawaiInput, pengalaman_kerjaUncheckedCreateWithoutPegawaiInput> | pengalaman_kerjaCreateWithoutPegawaiInput[] | pengalaman_kerjaUncheckedCreateWithoutPegawaiInput[]
    connectOrCreate?: pengalaman_kerjaCreateOrConnectWithoutPegawaiInput | pengalaman_kerjaCreateOrConnectWithoutPegawaiInput[]
    createMany?: pengalaman_kerjaCreateManyPegawaiInputEnvelope
    connect?: pengalaman_kerjaWhereUniqueInput | pengalaman_kerjaWhereUniqueInput[]
  }

  export type PegawaiSuratTugasUncheckedCreateNestedManyWithoutPegawaiInput = {
    create?: XOR<PegawaiSuratTugasCreateWithoutPegawaiInput, PegawaiSuratTugasUncheckedCreateWithoutPegawaiInput> | PegawaiSuratTugasCreateWithoutPegawaiInput[] | PegawaiSuratTugasUncheckedCreateWithoutPegawaiInput[]
    connectOrCreate?: PegawaiSuratTugasCreateOrConnectWithoutPegawaiInput | PegawaiSuratTugasCreateOrConnectWithoutPegawaiInput[]
    createMany?: PegawaiSuratTugasCreateManyPegawaiInputEnvelope
    connect?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
  }

  export type pelatihanUncheckedCreateNestedManyWithoutPegawaiInput = {
    create?: XOR<pelatihanCreateWithoutPegawaiInput, pelatihanUncheckedCreateWithoutPegawaiInput> | pelatihanCreateWithoutPegawaiInput[] | pelatihanUncheckedCreateWithoutPegawaiInput[]
    connectOrCreate?: pelatihanCreateOrConnectWithoutPegawaiInput | pelatihanCreateOrConnectWithoutPegawaiInput[]
    createMany?: pelatihanCreateManyPegawaiInputEnvelope
    connect?: pelatihanWhereUniqueInput | pelatihanWhereUniqueInput[]
  }

  export type pengalaman_kerjaUncheckedCreateNestedManyWithoutPegawaiInput = {
    create?: XOR<pengalaman_kerjaCreateWithoutPegawaiInput, pengalaman_kerjaUncheckedCreateWithoutPegawaiInput> | pengalaman_kerjaCreateWithoutPegawaiInput[] | pengalaman_kerjaUncheckedCreateWithoutPegawaiInput[]
    connectOrCreate?: pengalaman_kerjaCreateOrConnectWithoutPegawaiInput | pengalaman_kerjaCreateOrConnectWithoutPegawaiInput[]
    createMany?: pengalaman_kerjaCreateManyPegawaiInputEnvelope
    connect?: pengalaman_kerjaWhereUniqueInput | pengalaman_kerjaWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type PegawaiSuratTugasUpdateManyWithoutPegawaiNestedInput = {
    create?: XOR<PegawaiSuratTugasCreateWithoutPegawaiInput, PegawaiSuratTugasUncheckedCreateWithoutPegawaiInput> | PegawaiSuratTugasCreateWithoutPegawaiInput[] | PegawaiSuratTugasUncheckedCreateWithoutPegawaiInput[]
    connectOrCreate?: PegawaiSuratTugasCreateOrConnectWithoutPegawaiInput | PegawaiSuratTugasCreateOrConnectWithoutPegawaiInput[]
    upsert?: PegawaiSuratTugasUpsertWithWhereUniqueWithoutPegawaiInput | PegawaiSuratTugasUpsertWithWhereUniqueWithoutPegawaiInput[]
    createMany?: PegawaiSuratTugasCreateManyPegawaiInputEnvelope
    set?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    disconnect?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    delete?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    connect?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    update?: PegawaiSuratTugasUpdateWithWhereUniqueWithoutPegawaiInput | PegawaiSuratTugasUpdateWithWhereUniqueWithoutPegawaiInput[]
    updateMany?: PegawaiSuratTugasUpdateManyWithWhereWithoutPegawaiInput | PegawaiSuratTugasUpdateManyWithWhereWithoutPegawaiInput[]
    deleteMany?: PegawaiSuratTugasScalarWhereInput | PegawaiSuratTugasScalarWhereInput[]
  }

  export type pelatihanUpdateManyWithoutPegawaiNestedInput = {
    create?: XOR<pelatihanCreateWithoutPegawaiInput, pelatihanUncheckedCreateWithoutPegawaiInput> | pelatihanCreateWithoutPegawaiInput[] | pelatihanUncheckedCreateWithoutPegawaiInput[]
    connectOrCreate?: pelatihanCreateOrConnectWithoutPegawaiInput | pelatihanCreateOrConnectWithoutPegawaiInput[]
    upsert?: pelatihanUpsertWithWhereUniqueWithoutPegawaiInput | pelatihanUpsertWithWhereUniqueWithoutPegawaiInput[]
    createMany?: pelatihanCreateManyPegawaiInputEnvelope
    set?: pelatihanWhereUniqueInput | pelatihanWhereUniqueInput[]
    disconnect?: pelatihanWhereUniqueInput | pelatihanWhereUniqueInput[]
    delete?: pelatihanWhereUniqueInput | pelatihanWhereUniqueInput[]
    connect?: pelatihanWhereUniqueInput | pelatihanWhereUniqueInput[]
    update?: pelatihanUpdateWithWhereUniqueWithoutPegawaiInput | pelatihanUpdateWithWhereUniqueWithoutPegawaiInput[]
    updateMany?: pelatihanUpdateManyWithWhereWithoutPegawaiInput | pelatihanUpdateManyWithWhereWithoutPegawaiInput[]
    deleteMany?: pelatihanScalarWhereInput | pelatihanScalarWhereInput[]
  }

  export type pengalaman_kerjaUpdateManyWithoutPegawaiNestedInput = {
    create?: XOR<pengalaman_kerjaCreateWithoutPegawaiInput, pengalaman_kerjaUncheckedCreateWithoutPegawaiInput> | pengalaman_kerjaCreateWithoutPegawaiInput[] | pengalaman_kerjaUncheckedCreateWithoutPegawaiInput[]
    connectOrCreate?: pengalaman_kerjaCreateOrConnectWithoutPegawaiInput | pengalaman_kerjaCreateOrConnectWithoutPegawaiInput[]
    upsert?: pengalaman_kerjaUpsertWithWhereUniqueWithoutPegawaiInput | pengalaman_kerjaUpsertWithWhereUniqueWithoutPegawaiInput[]
    createMany?: pengalaman_kerjaCreateManyPegawaiInputEnvelope
    set?: pengalaman_kerjaWhereUniqueInput | pengalaman_kerjaWhereUniqueInput[]
    disconnect?: pengalaman_kerjaWhereUniqueInput | pengalaman_kerjaWhereUniqueInput[]
    delete?: pengalaman_kerjaWhereUniqueInput | pengalaman_kerjaWhereUniqueInput[]
    connect?: pengalaman_kerjaWhereUniqueInput | pengalaman_kerjaWhereUniqueInput[]
    update?: pengalaman_kerjaUpdateWithWhereUniqueWithoutPegawaiInput | pengalaman_kerjaUpdateWithWhereUniqueWithoutPegawaiInput[]
    updateMany?: pengalaman_kerjaUpdateManyWithWhereWithoutPegawaiInput | pengalaman_kerjaUpdateManyWithWhereWithoutPegawaiInput[]
    deleteMany?: pengalaman_kerjaScalarWhereInput | pengalaman_kerjaScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PegawaiSuratTugasUncheckedUpdateManyWithoutPegawaiNestedInput = {
    create?: XOR<PegawaiSuratTugasCreateWithoutPegawaiInput, PegawaiSuratTugasUncheckedCreateWithoutPegawaiInput> | PegawaiSuratTugasCreateWithoutPegawaiInput[] | PegawaiSuratTugasUncheckedCreateWithoutPegawaiInput[]
    connectOrCreate?: PegawaiSuratTugasCreateOrConnectWithoutPegawaiInput | PegawaiSuratTugasCreateOrConnectWithoutPegawaiInput[]
    upsert?: PegawaiSuratTugasUpsertWithWhereUniqueWithoutPegawaiInput | PegawaiSuratTugasUpsertWithWhereUniqueWithoutPegawaiInput[]
    createMany?: PegawaiSuratTugasCreateManyPegawaiInputEnvelope
    set?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    disconnect?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    delete?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    connect?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    update?: PegawaiSuratTugasUpdateWithWhereUniqueWithoutPegawaiInput | PegawaiSuratTugasUpdateWithWhereUniqueWithoutPegawaiInput[]
    updateMany?: PegawaiSuratTugasUpdateManyWithWhereWithoutPegawaiInput | PegawaiSuratTugasUpdateManyWithWhereWithoutPegawaiInput[]
    deleteMany?: PegawaiSuratTugasScalarWhereInput | PegawaiSuratTugasScalarWhereInput[]
  }

  export type pelatihanUncheckedUpdateManyWithoutPegawaiNestedInput = {
    create?: XOR<pelatihanCreateWithoutPegawaiInput, pelatihanUncheckedCreateWithoutPegawaiInput> | pelatihanCreateWithoutPegawaiInput[] | pelatihanUncheckedCreateWithoutPegawaiInput[]
    connectOrCreate?: pelatihanCreateOrConnectWithoutPegawaiInput | pelatihanCreateOrConnectWithoutPegawaiInput[]
    upsert?: pelatihanUpsertWithWhereUniqueWithoutPegawaiInput | pelatihanUpsertWithWhereUniqueWithoutPegawaiInput[]
    createMany?: pelatihanCreateManyPegawaiInputEnvelope
    set?: pelatihanWhereUniqueInput | pelatihanWhereUniqueInput[]
    disconnect?: pelatihanWhereUniqueInput | pelatihanWhereUniqueInput[]
    delete?: pelatihanWhereUniqueInput | pelatihanWhereUniqueInput[]
    connect?: pelatihanWhereUniqueInput | pelatihanWhereUniqueInput[]
    update?: pelatihanUpdateWithWhereUniqueWithoutPegawaiInput | pelatihanUpdateWithWhereUniqueWithoutPegawaiInput[]
    updateMany?: pelatihanUpdateManyWithWhereWithoutPegawaiInput | pelatihanUpdateManyWithWhereWithoutPegawaiInput[]
    deleteMany?: pelatihanScalarWhereInput | pelatihanScalarWhereInput[]
  }

  export type pengalaman_kerjaUncheckedUpdateManyWithoutPegawaiNestedInput = {
    create?: XOR<pengalaman_kerjaCreateWithoutPegawaiInput, pengalaman_kerjaUncheckedCreateWithoutPegawaiInput> | pengalaman_kerjaCreateWithoutPegawaiInput[] | pengalaman_kerjaUncheckedCreateWithoutPegawaiInput[]
    connectOrCreate?: pengalaman_kerjaCreateOrConnectWithoutPegawaiInput | pengalaman_kerjaCreateOrConnectWithoutPegawaiInput[]
    upsert?: pengalaman_kerjaUpsertWithWhereUniqueWithoutPegawaiInput | pengalaman_kerjaUpsertWithWhereUniqueWithoutPegawaiInput[]
    createMany?: pengalaman_kerjaCreateManyPegawaiInputEnvelope
    set?: pengalaman_kerjaWhereUniqueInput | pengalaman_kerjaWhereUniqueInput[]
    disconnect?: pengalaman_kerjaWhereUniqueInput | pengalaman_kerjaWhereUniqueInput[]
    delete?: pengalaman_kerjaWhereUniqueInput | pengalaman_kerjaWhereUniqueInput[]
    connect?: pengalaman_kerjaWhereUniqueInput | pengalaman_kerjaWhereUniqueInput[]
    update?: pengalaman_kerjaUpdateWithWhereUniqueWithoutPegawaiInput | pengalaman_kerjaUpdateWithWhereUniqueWithoutPegawaiInput[]
    updateMany?: pengalaman_kerjaUpdateManyWithWhereWithoutPegawaiInput | pengalaman_kerjaUpdateManyWithWhereWithoutPegawaiInput[]
    deleteMany?: pengalaman_kerjaScalarWhereInput | pengalaman_kerjaScalarWhereInput[]
  }

  export type pegawaiCreateNestedOneWithoutPelatihanInput = {
    create?: XOR<pegawaiCreateWithoutPelatihanInput, pegawaiUncheckedCreateWithoutPelatihanInput>
    connectOrCreate?: pegawaiCreateOrConnectWithoutPelatihanInput
    connect?: pegawaiWhereUniqueInput
  }

  export type EnumStatusPelatihanFieldUpdateOperationsInput = {
    set?: $Enums.StatusPelatihan
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type pegawaiUpdateOneWithoutPelatihanNestedInput = {
    create?: XOR<pegawaiCreateWithoutPelatihanInput, pegawaiUncheckedCreateWithoutPelatihanInput>
    connectOrCreate?: pegawaiCreateOrConnectWithoutPelatihanInput
    upsert?: pegawaiUpsertWithoutPelatihanInput
    disconnect?: pegawaiWhereInput | boolean
    delete?: pegawaiWhereInput | boolean
    connect?: pegawaiWhereUniqueInput
    update?: XOR<XOR<pegawaiUpdateToOneWithWhereWithoutPelatihanInput, pegawaiUpdateWithoutPelatihanInput>, pegawaiUncheckedUpdateWithoutPelatihanInput>
  }

  export type pegawaiCreateNestedOneWithoutPengalaman_kerjaInput = {
    create?: XOR<pegawaiCreateWithoutPengalaman_kerjaInput, pegawaiUncheckedCreateWithoutPengalaman_kerjaInput>
    connectOrCreate?: pegawaiCreateOrConnectWithoutPengalaman_kerjaInput
    connect?: pegawaiWhereUniqueInput
  }

  export type pegawaiUpdateOneWithoutPengalaman_kerjaNestedInput = {
    create?: XOR<pegawaiCreateWithoutPengalaman_kerjaInput, pegawaiUncheckedCreateWithoutPengalaman_kerjaInput>
    connectOrCreate?: pegawaiCreateOrConnectWithoutPengalaman_kerjaInput
    upsert?: pegawaiUpsertWithoutPengalaman_kerjaInput
    disconnect?: pegawaiWhereInput | boolean
    delete?: pegawaiWhereInput | boolean
    connect?: pegawaiWhereUniqueInput
    update?: XOR<XOR<pegawaiUpdateToOneWithWhereWithoutPengalaman_kerjaInput, pegawaiUpdateWithoutPengalaman_kerjaInput>, pegawaiUncheckedUpdateWithoutPengalaman_kerjaInput>
  }

  export type SuratTugasCreateperalatan_inspeksiInput = {
    set: string[]
  }

  export type SuratTugasCreatekebutuhan_materialInput = {
    set: string[]
  }

  export type SuratTugasCreatelokasi_pekerjaanInput = {
    set: string[]
  }

  export type PegawaiSuratTugasCreateNestedManyWithoutSuratTugasInput = {
    create?: XOR<PegawaiSuratTugasCreateWithoutSuratTugasInput, PegawaiSuratTugasUncheckedCreateWithoutSuratTugasInput> | PegawaiSuratTugasCreateWithoutSuratTugasInput[] | PegawaiSuratTugasUncheckedCreateWithoutSuratTugasInput[]
    connectOrCreate?: PegawaiSuratTugasCreateOrConnectWithoutSuratTugasInput | PegawaiSuratTugasCreateOrConnectWithoutSuratTugasInput[]
    createMany?: PegawaiSuratTugasCreateManySuratTugasInputEnvelope
    connect?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
  }

  export type PegawaiSuratTugasUncheckedCreateNestedManyWithoutSuratTugasInput = {
    create?: XOR<PegawaiSuratTugasCreateWithoutSuratTugasInput, PegawaiSuratTugasUncheckedCreateWithoutSuratTugasInput> | PegawaiSuratTugasCreateWithoutSuratTugasInput[] | PegawaiSuratTugasUncheckedCreateWithoutSuratTugasInput[]
    connectOrCreate?: PegawaiSuratTugasCreateOrConnectWithoutSuratTugasInput | PegawaiSuratTugasCreateOrConnectWithoutSuratTugasInput[]
    createMany?: PegawaiSuratTugasCreateManySuratTugasInputEnvelope
    connect?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
  }

  export type SuratTugasUpdateperalatan_inspeksiInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SuratTugasUpdatekebutuhan_materialInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SuratTugasUpdatelokasi_pekerjaanInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumStatusSuratTugasFieldUpdateOperationsInput = {
    set?: $Enums.StatusSuratTugas
  }

  export type PegawaiSuratTugasUpdateManyWithoutSuratTugasNestedInput = {
    create?: XOR<PegawaiSuratTugasCreateWithoutSuratTugasInput, PegawaiSuratTugasUncheckedCreateWithoutSuratTugasInput> | PegawaiSuratTugasCreateWithoutSuratTugasInput[] | PegawaiSuratTugasUncheckedCreateWithoutSuratTugasInput[]
    connectOrCreate?: PegawaiSuratTugasCreateOrConnectWithoutSuratTugasInput | PegawaiSuratTugasCreateOrConnectWithoutSuratTugasInput[]
    upsert?: PegawaiSuratTugasUpsertWithWhereUniqueWithoutSuratTugasInput | PegawaiSuratTugasUpsertWithWhereUniqueWithoutSuratTugasInput[]
    createMany?: PegawaiSuratTugasCreateManySuratTugasInputEnvelope
    set?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    disconnect?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    delete?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    connect?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    update?: PegawaiSuratTugasUpdateWithWhereUniqueWithoutSuratTugasInput | PegawaiSuratTugasUpdateWithWhereUniqueWithoutSuratTugasInput[]
    updateMany?: PegawaiSuratTugasUpdateManyWithWhereWithoutSuratTugasInput | PegawaiSuratTugasUpdateManyWithWhereWithoutSuratTugasInput[]
    deleteMany?: PegawaiSuratTugasScalarWhereInput | PegawaiSuratTugasScalarWhereInput[]
  }

  export type PegawaiSuratTugasUncheckedUpdateManyWithoutSuratTugasNestedInput = {
    create?: XOR<PegawaiSuratTugasCreateWithoutSuratTugasInput, PegawaiSuratTugasUncheckedCreateWithoutSuratTugasInput> | PegawaiSuratTugasCreateWithoutSuratTugasInput[] | PegawaiSuratTugasUncheckedCreateWithoutSuratTugasInput[]
    connectOrCreate?: PegawaiSuratTugasCreateOrConnectWithoutSuratTugasInput | PegawaiSuratTugasCreateOrConnectWithoutSuratTugasInput[]
    upsert?: PegawaiSuratTugasUpsertWithWhereUniqueWithoutSuratTugasInput | PegawaiSuratTugasUpsertWithWhereUniqueWithoutSuratTugasInput[]
    createMany?: PegawaiSuratTugasCreateManySuratTugasInputEnvelope
    set?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    disconnect?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    delete?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    connect?: PegawaiSuratTugasWhereUniqueInput | PegawaiSuratTugasWhereUniqueInput[]
    update?: PegawaiSuratTugasUpdateWithWhereUniqueWithoutSuratTugasInput | PegawaiSuratTugasUpdateWithWhereUniqueWithoutSuratTugasInput[]
    updateMany?: PegawaiSuratTugasUpdateManyWithWhereWithoutSuratTugasInput | PegawaiSuratTugasUpdateManyWithWhereWithoutSuratTugasInput[]
    deleteMany?: PegawaiSuratTugasScalarWhereInput | PegawaiSuratTugasScalarWhereInput[]
  }

  export type pegawaiCreateNestedOneWithoutPegawai_surat_tugasInput = {
    create?: XOR<pegawaiCreateWithoutPegawai_surat_tugasInput, pegawaiUncheckedCreateWithoutPegawai_surat_tugasInput>
    connectOrCreate?: pegawaiCreateOrConnectWithoutPegawai_surat_tugasInput
    connect?: pegawaiWhereUniqueInput
  }

  export type SuratTugasCreateNestedOneWithoutPegawai_surat_tugasInput = {
    create?: XOR<SuratTugasCreateWithoutPegawai_surat_tugasInput, SuratTugasUncheckedCreateWithoutPegawai_surat_tugasInput>
    connectOrCreate?: SuratTugasCreateOrConnectWithoutPegawai_surat_tugasInput
    connect?: SuratTugasWhereUniqueInput
  }

  export type pegawaiUpdateOneRequiredWithoutPegawai_surat_tugasNestedInput = {
    create?: XOR<pegawaiCreateWithoutPegawai_surat_tugasInput, pegawaiUncheckedCreateWithoutPegawai_surat_tugasInput>
    connectOrCreate?: pegawaiCreateOrConnectWithoutPegawai_surat_tugasInput
    upsert?: pegawaiUpsertWithoutPegawai_surat_tugasInput
    connect?: pegawaiWhereUniqueInput
    update?: XOR<XOR<pegawaiUpdateToOneWithWhereWithoutPegawai_surat_tugasInput, pegawaiUpdateWithoutPegawai_surat_tugasInput>, pegawaiUncheckedUpdateWithoutPegawai_surat_tugasInput>
  }

  export type SuratTugasUpdateOneRequiredWithoutPegawai_surat_tugasNestedInput = {
    create?: XOR<SuratTugasCreateWithoutPegawai_surat_tugasInput, SuratTugasUncheckedCreateWithoutPegawai_surat_tugasInput>
    connectOrCreate?: SuratTugasCreateOrConnectWithoutPegawai_surat_tugasInput
    upsert?: SuratTugasUpsertWithoutPegawai_surat_tugasInput
    connect?: SuratTugasWhereUniqueInput
    update?: XOR<XOR<SuratTugasUpdateToOneWithWhereWithoutPegawai_surat_tugasInput, SuratTugasUpdateWithoutPegawai_surat_tugasInput>, SuratTugasUncheckedUpdateWithoutPegawai_surat_tugasInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumStatusPelatihanFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusPelatihan | EnumStatusPelatihanFieldRefInput<$PrismaModel>
    in?: $Enums.StatusPelatihan[] | ListEnumStatusPelatihanFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusPelatihan[] | ListEnumStatusPelatihanFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusPelatihanFilter<$PrismaModel> | $Enums.StatusPelatihan
  }

  export type NestedEnumStatusPelatihanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusPelatihan | EnumStatusPelatihanFieldRefInput<$PrismaModel>
    in?: $Enums.StatusPelatihan[] | ListEnumStatusPelatihanFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusPelatihan[] | ListEnumStatusPelatihanFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusPelatihanWithAggregatesFilter<$PrismaModel> | $Enums.StatusPelatihan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusPelatihanFilter<$PrismaModel>
    _max?: NestedEnumStatusPelatihanFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumStatusSuratTugasFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusSuratTugas | EnumStatusSuratTugasFieldRefInput<$PrismaModel>
    in?: $Enums.StatusSuratTugas[] | ListEnumStatusSuratTugasFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusSuratTugas[] | ListEnumStatusSuratTugasFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusSuratTugasFilter<$PrismaModel> | $Enums.StatusSuratTugas
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumStatusSuratTugasWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusSuratTugas | EnumStatusSuratTugasFieldRefInput<$PrismaModel>
    in?: $Enums.StatusSuratTugas[] | ListEnumStatusSuratTugasFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusSuratTugas[] | ListEnumStatusSuratTugasFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusSuratTugasWithAggregatesFilter<$PrismaModel> | $Enums.StatusSuratTugas
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusSuratTugasFilter<$PrismaModel>
    _max?: NestedEnumStatusSuratTugasFilter<$PrismaModel>
  }

  export type PegawaiSuratTugasCreateWithoutPegawaiInput = {
    jabatan?: string | null
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
    suratTugas: SuratTugasCreateNestedOneWithoutPegawai_surat_tugasInput
  }

  export type PegawaiSuratTugasUncheckedCreateWithoutPegawaiInput = {
    id?: number
    suratTugasId: number
    jabatan?: string | null
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
  }

  export type PegawaiSuratTugasCreateOrConnectWithoutPegawaiInput = {
    where: PegawaiSuratTugasWhereUniqueInput
    create: XOR<PegawaiSuratTugasCreateWithoutPegawaiInput, PegawaiSuratTugasUncheckedCreateWithoutPegawaiInput>
  }

  export type PegawaiSuratTugasCreateManyPegawaiInputEnvelope = {
    data: PegawaiSuratTugasCreateManyPegawaiInput | PegawaiSuratTugasCreateManyPegawaiInput[]
    skipDuplicates?: boolean
  }

  export type pelatihanCreateWithoutPegawaiInput = {
    nama_pelatihan?: string | null
    penyelenggara?: string | null
    nomor_sertifikat?: string | null
    file_sertifikat?: string | null
    tanggal_awal?: Date | string | null
    masa_berlaku?: Date | string | null
    status: $Enums.StatusPelatihan
    keterangan_utilisasi?: string | null
    tahun?: number | null
    tanggal_akhir?: Date | string | null
  }

  export type pelatihanUncheckedCreateWithoutPegawaiInput = {
    id_pelatihan?: number
    nama_pelatihan?: string | null
    penyelenggara?: string | null
    nomor_sertifikat?: string | null
    file_sertifikat?: string | null
    tanggal_awal?: Date | string | null
    masa_berlaku?: Date | string | null
    status: $Enums.StatusPelatihan
    keterangan_utilisasi?: string | null
    tahun?: number | null
    tanggal_akhir?: Date | string | null
  }

  export type pelatihanCreateOrConnectWithoutPegawaiInput = {
    where: pelatihanWhereUniqueInput
    create: XOR<pelatihanCreateWithoutPegawaiInput, pelatihanUncheckedCreateWithoutPegawaiInput>
  }

  export type pelatihanCreateManyPegawaiInputEnvelope = {
    data: pelatihanCreateManyPegawaiInput | pelatihanCreateManyPegawaiInput[]
    skipDuplicates?: boolean
  }

  export type pengalaman_kerjaCreateWithoutPegawaiInput = {
    tahun?: number | null
    pengalaman_kerja?: string | null
    perusahaan?: string | null
  }

  export type pengalaman_kerjaUncheckedCreateWithoutPegawaiInput = {
    id_pengalaman?: number
    tahun?: number | null
    pengalaman_kerja?: string | null
    perusahaan?: string | null
  }

  export type pengalaman_kerjaCreateOrConnectWithoutPegawaiInput = {
    where: pengalaman_kerjaWhereUniqueInput
    create: XOR<pengalaman_kerjaCreateWithoutPegawaiInput, pengalaman_kerjaUncheckedCreateWithoutPegawaiInput>
  }

  export type pengalaman_kerjaCreateManyPegawaiInputEnvelope = {
    data: pengalaman_kerjaCreateManyPegawaiInput | pengalaman_kerjaCreateManyPegawaiInput[]
    skipDuplicates?: boolean
  }

  export type PegawaiSuratTugasUpsertWithWhereUniqueWithoutPegawaiInput = {
    where: PegawaiSuratTugasWhereUniqueInput
    update: XOR<PegawaiSuratTugasUpdateWithoutPegawaiInput, PegawaiSuratTugasUncheckedUpdateWithoutPegawaiInput>
    create: XOR<PegawaiSuratTugasCreateWithoutPegawaiInput, PegawaiSuratTugasUncheckedCreateWithoutPegawaiInput>
  }

  export type PegawaiSuratTugasUpdateWithWhereUniqueWithoutPegawaiInput = {
    where: PegawaiSuratTugasWhereUniqueInput
    data: XOR<PegawaiSuratTugasUpdateWithoutPegawaiInput, PegawaiSuratTugasUncheckedUpdateWithoutPegawaiInput>
  }

  export type PegawaiSuratTugasUpdateManyWithWhereWithoutPegawaiInput = {
    where: PegawaiSuratTugasScalarWhereInput
    data: XOR<PegawaiSuratTugasUpdateManyMutationInput, PegawaiSuratTugasUncheckedUpdateManyWithoutPegawaiInput>
  }

  export type PegawaiSuratTugasScalarWhereInput = {
    AND?: PegawaiSuratTugasScalarWhereInput | PegawaiSuratTugasScalarWhereInput[]
    OR?: PegawaiSuratTugasScalarWhereInput[]
    NOT?: PegawaiSuratTugasScalarWhereInput | PegawaiSuratTugasScalarWhereInput[]
    id?: IntFilter<"PegawaiSuratTugas"> | number
    suratTugasId?: IntFilter<"PegawaiSuratTugas"> | number
    pegawaiNup?: StringFilter<"PegawaiSuratTugas"> | string
    jabatan?: StringNullableFilter<"PegawaiSuratTugas"> | string | null
    approved?: BoolFilter<"PegawaiSuratTugas"> | boolean
    approvedBy?: StringNullableFilter<"PegawaiSuratTugas"> | string | null
    approvedAt?: DateTimeNullableFilter<"PegawaiSuratTugas"> | Date | string | null
  }

  export type pelatihanUpsertWithWhereUniqueWithoutPegawaiInput = {
    where: pelatihanWhereUniqueInput
    update: XOR<pelatihanUpdateWithoutPegawaiInput, pelatihanUncheckedUpdateWithoutPegawaiInput>
    create: XOR<pelatihanCreateWithoutPegawaiInput, pelatihanUncheckedCreateWithoutPegawaiInput>
  }

  export type pelatihanUpdateWithWhereUniqueWithoutPegawaiInput = {
    where: pelatihanWhereUniqueInput
    data: XOR<pelatihanUpdateWithoutPegawaiInput, pelatihanUncheckedUpdateWithoutPegawaiInput>
  }

  export type pelatihanUpdateManyWithWhereWithoutPegawaiInput = {
    where: pelatihanScalarWhereInput
    data: XOR<pelatihanUpdateManyMutationInput, pelatihanUncheckedUpdateManyWithoutPegawaiInput>
  }

  export type pelatihanScalarWhereInput = {
    AND?: pelatihanScalarWhereInput | pelatihanScalarWhereInput[]
    OR?: pelatihanScalarWhereInput[]
    NOT?: pelatihanScalarWhereInput | pelatihanScalarWhereInput[]
    id_pelatihan?: IntFilter<"pelatihan"> | number
    nup?: StringNullableFilter<"pelatihan"> | string | null
    nama_pelatihan?: StringNullableFilter<"pelatihan"> | string | null
    penyelenggara?: StringNullableFilter<"pelatihan"> | string | null
    nomor_sertifikat?: StringNullableFilter<"pelatihan"> | string | null
    file_sertifikat?: StringNullableFilter<"pelatihan"> | string | null
    tanggal_awal?: DateTimeNullableFilter<"pelatihan"> | Date | string | null
    masa_berlaku?: DateTimeNullableFilter<"pelatihan"> | Date | string | null
    status?: EnumStatusPelatihanFilter<"pelatihan"> | $Enums.StatusPelatihan
    keterangan_utilisasi?: StringNullableFilter<"pelatihan"> | string | null
    tahun?: IntNullableFilter<"pelatihan"> | number | null
    tanggal_akhir?: DateTimeNullableFilter<"pelatihan"> | Date | string | null
  }

  export type pengalaman_kerjaUpsertWithWhereUniqueWithoutPegawaiInput = {
    where: pengalaman_kerjaWhereUniqueInput
    update: XOR<pengalaman_kerjaUpdateWithoutPegawaiInput, pengalaman_kerjaUncheckedUpdateWithoutPegawaiInput>
    create: XOR<pengalaman_kerjaCreateWithoutPegawaiInput, pengalaman_kerjaUncheckedCreateWithoutPegawaiInput>
  }

  export type pengalaman_kerjaUpdateWithWhereUniqueWithoutPegawaiInput = {
    where: pengalaman_kerjaWhereUniqueInput
    data: XOR<pengalaman_kerjaUpdateWithoutPegawaiInput, pengalaman_kerjaUncheckedUpdateWithoutPegawaiInput>
  }

  export type pengalaman_kerjaUpdateManyWithWhereWithoutPegawaiInput = {
    where: pengalaman_kerjaScalarWhereInput
    data: XOR<pengalaman_kerjaUpdateManyMutationInput, pengalaman_kerjaUncheckedUpdateManyWithoutPegawaiInput>
  }

  export type pengalaman_kerjaScalarWhereInput = {
    AND?: pengalaman_kerjaScalarWhereInput | pengalaman_kerjaScalarWhereInput[]
    OR?: pengalaman_kerjaScalarWhereInput[]
    NOT?: pengalaman_kerjaScalarWhereInput | pengalaman_kerjaScalarWhereInput[]
    id_pengalaman?: IntFilter<"pengalaman_kerja"> | number
    nup?: StringNullableFilter<"pengalaman_kerja"> | string | null
    tahun?: IntNullableFilter<"pengalaman_kerja"> | number | null
    pengalaman_kerja?: StringNullableFilter<"pengalaman_kerja"> | string | null
    perusahaan?: StringNullableFilter<"pengalaman_kerja"> | string | null
  }

  export type pegawaiCreateWithoutPelatihanInput = {
    nup: string
    nama_pegawai: string
    status_pegawai?: string | null
    jabatan?: string | null
    tempat_lahir?: string | null
    tanggal_lahir?: Date | string | null
    alamat?: string | null
    warga_negara?: string | null
    agama?: string | null
    no_telepon?: string | null
    email?: string | null
    password: string
    role?: string | null
    username?: string | null
    id?: number
    nik?: string | null
    pegawai_surat_tugas?: PegawaiSuratTugasCreateNestedManyWithoutPegawaiInput
    pengalaman_kerja?: pengalaman_kerjaCreateNestedManyWithoutPegawaiInput
  }

  export type pegawaiUncheckedCreateWithoutPelatihanInput = {
    nup: string
    nama_pegawai: string
    status_pegawai?: string | null
    jabatan?: string | null
    tempat_lahir?: string | null
    tanggal_lahir?: Date | string | null
    alamat?: string | null
    warga_negara?: string | null
    agama?: string | null
    no_telepon?: string | null
    email?: string | null
    password: string
    role?: string | null
    username?: string | null
    id?: number
    nik?: string | null
    pegawai_surat_tugas?: PegawaiSuratTugasUncheckedCreateNestedManyWithoutPegawaiInput
    pengalaman_kerja?: pengalaman_kerjaUncheckedCreateNestedManyWithoutPegawaiInput
  }

  export type pegawaiCreateOrConnectWithoutPelatihanInput = {
    where: pegawaiWhereUniqueInput
    create: XOR<pegawaiCreateWithoutPelatihanInput, pegawaiUncheckedCreateWithoutPelatihanInput>
  }

  export type pegawaiUpsertWithoutPelatihanInput = {
    update: XOR<pegawaiUpdateWithoutPelatihanInput, pegawaiUncheckedUpdateWithoutPelatihanInput>
    create: XOR<pegawaiCreateWithoutPelatihanInput, pegawaiUncheckedCreateWithoutPelatihanInput>
    where?: pegawaiWhereInput
  }

  export type pegawaiUpdateToOneWithWhereWithoutPelatihanInput = {
    where?: pegawaiWhereInput
    data: XOR<pegawaiUpdateWithoutPelatihanInput, pegawaiUncheckedUpdateWithoutPelatihanInput>
  }

  export type pegawaiUpdateWithoutPelatihanInput = {
    nup?: StringFieldUpdateOperationsInput | string
    nama_pegawai?: StringFieldUpdateOperationsInput | string
    status_pegawai?: NullableStringFieldUpdateOperationsInput | string | null
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    tempat_lahir?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_lahir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    alamat?: NullableStringFieldUpdateOperationsInput | string | null
    warga_negara?: NullableStringFieldUpdateOperationsInput | string | null
    agama?: NullableStringFieldUpdateOperationsInput | string | null
    no_telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: NullableStringFieldUpdateOperationsInput | string | null
    pegawai_surat_tugas?: PegawaiSuratTugasUpdateManyWithoutPegawaiNestedInput
    pengalaman_kerja?: pengalaman_kerjaUpdateManyWithoutPegawaiNestedInput
  }

  export type pegawaiUncheckedUpdateWithoutPelatihanInput = {
    nup?: StringFieldUpdateOperationsInput | string
    nama_pegawai?: StringFieldUpdateOperationsInput | string
    status_pegawai?: NullableStringFieldUpdateOperationsInput | string | null
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    tempat_lahir?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_lahir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    alamat?: NullableStringFieldUpdateOperationsInput | string | null
    warga_negara?: NullableStringFieldUpdateOperationsInput | string | null
    agama?: NullableStringFieldUpdateOperationsInput | string | null
    no_telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    id?: IntFieldUpdateOperationsInput | number
    nik?: NullableStringFieldUpdateOperationsInput | string | null
    pegawai_surat_tugas?: PegawaiSuratTugasUncheckedUpdateManyWithoutPegawaiNestedInput
    pengalaman_kerja?: pengalaman_kerjaUncheckedUpdateManyWithoutPegawaiNestedInput
  }

  export type pegawaiCreateWithoutPengalaman_kerjaInput = {
    nup: string
    nama_pegawai: string
    status_pegawai?: string | null
    jabatan?: string | null
    tempat_lahir?: string | null
    tanggal_lahir?: Date | string | null
    alamat?: string | null
    warga_negara?: string | null
    agama?: string | null
    no_telepon?: string | null
    email?: string | null
    password: string
    role?: string | null
    username?: string | null
    id?: number
    nik?: string | null
    pegawai_surat_tugas?: PegawaiSuratTugasCreateNestedManyWithoutPegawaiInput
    pelatihan?: pelatihanCreateNestedManyWithoutPegawaiInput
  }

  export type pegawaiUncheckedCreateWithoutPengalaman_kerjaInput = {
    nup: string
    nama_pegawai: string
    status_pegawai?: string | null
    jabatan?: string | null
    tempat_lahir?: string | null
    tanggal_lahir?: Date | string | null
    alamat?: string | null
    warga_negara?: string | null
    agama?: string | null
    no_telepon?: string | null
    email?: string | null
    password: string
    role?: string | null
    username?: string | null
    id?: number
    nik?: string | null
    pegawai_surat_tugas?: PegawaiSuratTugasUncheckedCreateNestedManyWithoutPegawaiInput
    pelatihan?: pelatihanUncheckedCreateNestedManyWithoutPegawaiInput
  }

  export type pegawaiCreateOrConnectWithoutPengalaman_kerjaInput = {
    where: pegawaiWhereUniqueInput
    create: XOR<pegawaiCreateWithoutPengalaman_kerjaInput, pegawaiUncheckedCreateWithoutPengalaman_kerjaInput>
  }

  export type pegawaiUpsertWithoutPengalaman_kerjaInput = {
    update: XOR<pegawaiUpdateWithoutPengalaman_kerjaInput, pegawaiUncheckedUpdateWithoutPengalaman_kerjaInput>
    create: XOR<pegawaiCreateWithoutPengalaman_kerjaInput, pegawaiUncheckedCreateWithoutPengalaman_kerjaInput>
    where?: pegawaiWhereInput
  }

  export type pegawaiUpdateToOneWithWhereWithoutPengalaman_kerjaInput = {
    where?: pegawaiWhereInput
    data: XOR<pegawaiUpdateWithoutPengalaman_kerjaInput, pegawaiUncheckedUpdateWithoutPengalaman_kerjaInput>
  }

  export type pegawaiUpdateWithoutPengalaman_kerjaInput = {
    nup?: StringFieldUpdateOperationsInput | string
    nama_pegawai?: StringFieldUpdateOperationsInput | string
    status_pegawai?: NullableStringFieldUpdateOperationsInput | string | null
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    tempat_lahir?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_lahir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    alamat?: NullableStringFieldUpdateOperationsInput | string | null
    warga_negara?: NullableStringFieldUpdateOperationsInput | string | null
    agama?: NullableStringFieldUpdateOperationsInput | string | null
    no_telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: NullableStringFieldUpdateOperationsInput | string | null
    pegawai_surat_tugas?: PegawaiSuratTugasUpdateManyWithoutPegawaiNestedInput
    pelatihan?: pelatihanUpdateManyWithoutPegawaiNestedInput
  }

  export type pegawaiUncheckedUpdateWithoutPengalaman_kerjaInput = {
    nup?: StringFieldUpdateOperationsInput | string
    nama_pegawai?: StringFieldUpdateOperationsInput | string
    status_pegawai?: NullableStringFieldUpdateOperationsInput | string | null
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    tempat_lahir?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_lahir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    alamat?: NullableStringFieldUpdateOperationsInput | string | null
    warga_negara?: NullableStringFieldUpdateOperationsInput | string | null
    agama?: NullableStringFieldUpdateOperationsInput | string | null
    no_telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    id?: IntFieldUpdateOperationsInput | number
    nik?: NullableStringFieldUpdateOperationsInput | string | null
    pegawai_surat_tugas?: PegawaiSuratTugasUncheckedUpdateManyWithoutPegawaiNestedInput
    pelatihan?: pelatihanUncheckedUpdateManyWithoutPegawaiNestedInput
  }

  export type PegawaiSuratTugasCreateWithoutSuratTugasInput = {
    jabatan?: string | null
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
    pegawai: pegawaiCreateNestedOneWithoutPegawai_surat_tugasInput
  }

  export type PegawaiSuratTugasUncheckedCreateWithoutSuratTugasInput = {
    id?: number
    pegawaiNup: string
    jabatan?: string | null
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
  }

  export type PegawaiSuratTugasCreateOrConnectWithoutSuratTugasInput = {
    where: PegawaiSuratTugasWhereUniqueInput
    create: XOR<PegawaiSuratTugasCreateWithoutSuratTugasInput, PegawaiSuratTugasUncheckedCreateWithoutSuratTugasInput>
  }

  export type PegawaiSuratTugasCreateManySuratTugasInputEnvelope = {
    data: PegawaiSuratTugasCreateManySuratTugasInput | PegawaiSuratTugasCreateManySuratTugasInput[]
    skipDuplicates?: boolean
  }

  export type PegawaiSuratTugasUpsertWithWhereUniqueWithoutSuratTugasInput = {
    where: PegawaiSuratTugasWhereUniqueInput
    update: XOR<PegawaiSuratTugasUpdateWithoutSuratTugasInput, PegawaiSuratTugasUncheckedUpdateWithoutSuratTugasInput>
    create: XOR<PegawaiSuratTugasCreateWithoutSuratTugasInput, PegawaiSuratTugasUncheckedCreateWithoutSuratTugasInput>
  }

  export type PegawaiSuratTugasUpdateWithWhereUniqueWithoutSuratTugasInput = {
    where: PegawaiSuratTugasWhereUniqueInput
    data: XOR<PegawaiSuratTugasUpdateWithoutSuratTugasInput, PegawaiSuratTugasUncheckedUpdateWithoutSuratTugasInput>
  }

  export type PegawaiSuratTugasUpdateManyWithWhereWithoutSuratTugasInput = {
    where: PegawaiSuratTugasScalarWhereInput
    data: XOR<PegawaiSuratTugasUpdateManyMutationInput, PegawaiSuratTugasUncheckedUpdateManyWithoutSuratTugasInput>
  }

  export type pegawaiCreateWithoutPegawai_surat_tugasInput = {
    nup: string
    nama_pegawai: string
    status_pegawai?: string | null
    jabatan?: string | null
    tempat_lahir?: string | null
    tanggal_lahir?: Date | string | null
    alamat?: string | null
    warga_negara?: string | null
    agama?: string | null
    no_telepon?: string | null
    email?: string | null
    password: string
    role?: string | null
    username?: string | null
    id?: number
    nik?: string | null
    pelatihan?: pelatihanCreateNestedManyWithoutPegawaiInput
    pengalaman_kerja?: pengalaman_kerjaCreateNestedManyWithoutPegawaiInput
  }

  export type pegawaiUncheckedCreateWithoutPegawai_surat_tugasInput = {
    nup: string
    nama_pegawai: string
    status_pegawai?: string | null
    jabatan?: string | null
    tempat_lahir?: string | null
    tanggal_lahir?: Date | string | null
    alamat?: string | null
    warga_negara?: string | null
    agama?: string | null
    no_telepon?: string | null
    email?: string | null
    password: string
    role?: string | null
    username?: string | null
    id?: number
    nik?: string | null
    pelatihan?: pelatihanUncheckedCreateNestedManyWithoutPegawaiInput
    pengalaman_kerja?: pengalaman_kerjaUncheckedCreateNestedManyWithoutPegawaiInput
  }

  export type pegawaiCreateOrConnectWithoutPegawai_surat_tugasInput = {
    where: pegawaiWhereUniqueInput
    create: XOR<pegawaiCreateWithoutPegawai_surat_tugasInput, pegawaiUncheckedCreateWithoutPegawai_surat_tugasInput>
  }

  export type SuratTugasCreateWithoutPegawai_surat_tugasInput = {
    nomor_surat?: string | null
    klien: string
    pekerjaan: string
    status_pekerjaan?: string | null
    no_service_order?: string | null
    bidang_pekerjaan?: string | null
    peralatan_inspeksi?: SuratTugasCreateperalatan_inspeksiInput | string[]
    kebutuhan_material?: SuratTugasCreatekebutuhan_materialInput | string[]
    lokasi_pekerjaan?: SuratTugasCreatelokasi_pekerjaanInput | string[]
    tanggal_berangkat?: Date | string | null
    tanggal_kembali?: Date | string | null
    transportasi_operasional?: boolean
    transportasi_ditanggung_klien?: boolean
    transportasi_asal_tujuan?: boolean
    transportasi_dinas?: boolean
    tiket?: boolean
    penginapan?: boolean
    keterangan_lain?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    spi?: string | null
    wbs?: string | null
    status?: $Enums.StatusSuratTugas
  }

  export type SuratTugasUncheckedCreateWithoutPegawai_surat_tugasInput = {
    id?: number
    nomor_surat?: string | null
    klien: string
    pekerjaan: string
    status_pekerjaan?: string | null
    no_service_order?: string | null
    bidang_pekerjaan?: string | null
    peralatan_inspeksi?: SuratTugasCreateperalatan_inspeksiInput | string[]
    kebutuhan_material?: SuratTugasCreatekebutuhan_materialInput | string[]
    lokasi_pekerjaan?: SuratTugasCreatelokasi_pekerjaanInput | string[]
    tanggal_berangkat?: Date | string | null
    tanggal_kembali?: Date | string | null
    transportasi_operasional?: boolean
    transportasi_ditanggung_klien?: boolean
    transportasi_asal_tujuan?: boolean
    transportasi_dinas?: boolean
    tiket?: boolean
    penginapan?: boolean
    keterangan_lain?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    spi?: string | null
    wbs?: string | null
    status?: $Enums.StatusSuratTugas
  }

  export type SuratTugasCreateOrConnectWithoutPegawai_surat_tugasInput = {
    where: SuratTugasWhereUniqueInput
    create: XOR<SuratTugasCreateWithoutPegawai_surat_tugasInput, SuratTugasUncheckedCreateWithoutPegawai_surat_tugasInput>
  }

  export type pegawaiUpsertWithoutPegawai_surat_tugasInput = {
    update: XOR<pegawaiUpdateWithoutPegawai_surat_tugasInput, pegawaiUncheckedUpdateWithoutPegawai_surat_tugasInput>
    create: XOR<pegawaiCreateWithoutPegawai_surat_tugasInput, pegawaiUncheckedCreateWithoutPegawai_surat_tugasInput>
    where?: pegawaiWhereInput
  }

  export type pegawaiUpdateToOneWithWhereWithoutPegawai_surat_tugasInput = {
    where?: pegawaiWhereInput
    data: XOR<pegawaiUpdateWithoutPegawai_surat_tugasInput, pegawaiUncheckedUpdateWithoutPegawai_surat_tugasInput>
  }

  export type pegawaiUpdateWithoutPegawai_surat_tugasInput = {
    nup?: StringFieldUpdateOperationsInput | string
    nama_pegawai?: StringFieldUpdateOperationsInput | string
    status_pegawai?: NullableStringFieldUpdateOperationsInput | string | null
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    tempat_lahir?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_lahir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    alamat?: NullableStringFieldUpdateOperationsInput | string | null
    warga_negara?: NullableStringFieldUpdateOperationsInput | string | null
    agama?: NullableStringFieldUpdateOperationsInput | string | null
    no_telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    nik?: NullableStringFieldUpdateOperationsInput | string | null
    pelatihan?: pelatihanUpdateManyWithoutPegawaiNestedInput
    pengalaman_kerja?: pengalaman_kerjaUpdateManyWithoutPegawaiNestedInput
  }

  export type pegawaiUncheckedUpdateWithoutPegawai_surat_tugasInput = {
    nup?: StringFieldUpdateOperationsInput | string
    nama_pegawai?: StringFieldUpdateOperationsInput | string
    status_pegawai?: NullableStringFieldUpdateOperationsInput | string | null
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    tempat_lahir?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_lahir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    alamat?: NullableStringFieldUpdateOperationsInput | string | null
    warga_negara?: NullableStringFieldUpdateOperationsInput | string | null
    agama?: NullableStringFieldUpdateOperationsInput | string | null
    no_telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    id?: IntFieldUpdateOperationsInput | number
    nik?: NullableStringFieldUpdateOperationsInput | string | null
    pelatihan?: pelatihanUncheckedUpdateManyWithoutPegawaiNestedInput
    pengalaman_kerja?: pengalaman_kerjaUncheckedUpdateManyWithoutPegawaiNestedInput
  }

  export type SuratTugasUpsertWithoutPegawai_surat_tugasInput = {
    update: XOR<SuratTugasUpdateWithoutPegawai_surat_tugasInput, SuratTugasUncheckedUpdateWithoutPegawai_surat_tugasInput>
    create: XOR<SuratTugasCreateWithoutPegawai_surat_tugasInput, SuratTugasUncheckedCreateWithoutPegawai_surat_tugasInput>
    where?: SuratTugasWhereInput
  }

  export type SuratTugasUpdateToOneWithWhereWithoutPegawai_surat_tugasInput = {
    where?: SuratTugasWhereInput
    data: XOR<SuratTugasUpdateWithoutPegawai_surat_tugasInput, SuratTugasUncheckedUpdateWithoutPegawai_surat_tugasInput>
  }

  export type SuratTugasUpdateWithoutPegawai_surat_tugasInput = {
    nomor_surat?: NullableStringFieldUpdateOperationsInput | string | null
    klien?: StringFieldUpdateOperationsInput | string
    pekerjaan?: StringFieldUpdateOperationsInput | string
    status_pekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    no_service_order?: NullableStringFieldUpdateOperationsInput | string | null
    bidang_pekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    peralatan_inspeksi?: SuratTugasUpdateperalatan_inspeksiInput | string[]
    kebutuhan_material?: SuratTugasUpdatekebutuhan_materialInput | string[]
    lokasi_pekerjaan?: SuratTugasUpdatelokasi_pekerjaanInput | string[]
    tanggal_berangkat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggal_kembali?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transportasi_operasional?: BoolFieldUpdateOperationsInput | boolean
    transportasi_ditanggung_klien?: BoolFieldUpdateOperationsInput | boolean
    transportasi_asal_tujuan?: BoolFieldUpdateOperationsInput | boolean
    transportasi_dinas?: BoolFieldUpdateOperationsInput | boolean
    tiket?: BoolFieldUpdateOperationsInput | boolean
    penginapan?: BoolFieldUpdateOperationsInput | boolean
    keterangan_lain?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spi?: NullableStringFieldUpdateOperationsInput | string | null
    wbs?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusSuratTugasFieldUpdateOperationsInput | $Enums.StatusSuratTugas
  }

  export type SuratTugasUncheckedUpdateWithoutPegawai_surat_tugasInput = {
    id?: IntFieldUpdateOperationsInput | number
    nomor_surat?: NullableStringFieldUpdateOperationsInput | string | null
    klien?: StringFieldUpdateOperationsInput | string
    pekerjaan?: StringFieldUpdateOperationsInput | string
    status_pekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    no_service_order?: NullableStringFieldUpdateOperationsInput | string | null
    bidang_pekerjaan?: NullableStringFieldUpdateOperationsInput | string | null
    peralatan_inspeksi?: SuratTugasUpdateperalatan_inspeksiInput | string[]
    kebutuhan_material?: SuratTugasUpdatekebutuhan_materialInput | string[]
    lokasi_pekerjaan?: SuratTugasUpdatelokasi_pekerjaanInput | string[]
    tanggal_berangkat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tanggal_kembali?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transportasi_operasional?: BoolFieldUpdateOperationsInput | boolean
    transportasi_ditanggung_klien?: BoolFieldUpdateOperationsInput | boolean
    transportasi_asal_tujuan?: BoolFieldUpdateOperationsInput | boolean
    transportasi_dinas?: BoolFieldUpdateOperationsInput | boolean
    tiket?: BoolFieldUpdateOperationsInput | boolean
    penginapan?: BoolFieldUpdateOperationsInput | boolean
    keterangan_lain?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spi?: NullableStringFieldUpdateOperationsInput | string | null
    wbs?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusSuratTugasFieldUpdateOperationsInput | $Enums.StatusSuratTugas
  }

  export type PegawaiSuratTugasCreateManyPegawaiInput = {
    id?: number
    suratTugasId: number
    jabatan?: string | null
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
  }

  export type pelatihanCreateManyPegawaiInput = {
    id_pelatihan?: number
    nama_pelatihan?: string | null
    penyelenggara?: string | null
    nomor_sertifikat?: string | null
    file_sertifikat?: string | null
    tanggal_awal?: Date | string | null
    masa_berlaku?: Date | string | null
    status: $Enums.StatusPelatihan
    keterangan_utilisasi?: string | null
    tahun?: number | null
    tanggal_akhir?: Date | string | null
  }

  export type pengalaman_kerjaCreateManyPegawaiInput = {
    id_pengalaman?: number
    tahun?: number | null
    pengalaman_kerja?: string | null
    perusahaan?: string | null
  }

  export type PegawaiSuratTugasUpdateWithoutPegawaiInput = {
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suratTugas?: SuratTugasUpdateOneRequiredWithoutPegawai_surat_tugasNestedInput
  }

  export type PegawaiSuratTugasUncheckedUpdateWithoutPegawaiInput = {
    id?: IntFieldUpdateOperationsInput | number
    suratTugasId?: IntFieldUpdateOperationsInput | number
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PegawaiSuratTugasUncheckedUpdateManyWithoutPegawaiInput = {
    id?: IntFieldUpdateOperationsInput | number
    suratTugasId?: IntFieldUpdateOperationsInput | number
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type pelatihanUpdateWithoutPegawaiInput = {
    nama_pelatihan?: NullableStringFieldUpdateOperationsInput | string | null
    penyelenggara?: NullableStringFieldUpdateOperationsInput | string | null
    nomor_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    file_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_awal?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    masa_berlaku?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusPelatihanFieldUpdateOperationsInput | $Enums.StatusPelatihan
    keterangan_utilisasi?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    tanggal_akhir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type pelatihanUncheckedUpdateWithoutPegawaiInput = {
    id_pelatihan?: IntFieldUpdateOperationsInput | number
    nama_pelatihan?: NullableStringFieldUpdateOperationsInput | string | null
    penyelenggara?: NullableStringFieldUpdateOperationsInput | string | null
    nomor_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    file_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_awal?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    masa_berlaku?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusPelatihanFieldUpdateOperationsInput | $Enums.StatusPelatihan
    keterangan_utilisasi?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    tanggal_akhir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type pelatihanUncheckedUpdateManyWithoutPegawaiInput = {
    id_pelatihan?: IntFieldUpdateOperationsInput | number
    nama_pelatihan?: NullableStringFieldUpdateOperationsInput | string | null
    penyelenggara?: NullableStringFieldUpdateOperationsInput | string | null
    nomor_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    file_sertifikat?: NullableStringFieldUpdateOperationsInput | string | null
    tanggal_awal?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    masa_berlaku?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusPelatihanFieldUpdateOperationsInput | $Enums.StatusPelatihan
    keterangan_utilisasi?: NullableStringFieldUpdateOperationsInput | string | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    tanggal_akhir?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type pengalaman_kerjaUpdateWithoutPegawaiInput = {
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    pengalaman_kerja?: NullableStringFieldUpdateOperationsInput | string | null
    perusahaan?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type pengalaman_kerjaUncheckedUpdateWithoutPegawaiInput = {
    id_pengalaman?: IntFieldUpdateOperationsInput | number
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    pengalaman_kerja?: NullableStringFieldUpdateOperationsInput | string | null
    perusahaan?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type pengalaman_kerjaUncheckedUpdateManyWithoutPegawaiInput = {
    id_pengalaman?: IntFieldUpdateOperationsInput | number
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    pengalaman_kerja?: NullableStringFieldUpdateOperationsInput | string | null
    perusahaan?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PegawaiSuratTugasCreateManySuratTugasInput = {
    id?: number
    pegawaiNup: string
    jabatan?: string | null
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
  }

  export type PegawaiSuratTugasUpdateWithoutSuratTugasInput = {
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pegawai?: pegawaiUpdateOneRequiredWithoutPegawai_surat_tugasNestedInput
  }

  export type PegawaiSuratTugasUncheckedUpdateWithoutSuratTugasInput = {
    id?: IntFieldUpdateOperationsInput | number
    pegawaiNup?: StringFieldUpdateOperationsInput | string
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PegawaiSuratTugasUncheckedUpdateManyWithoutSuratTugasInput = {
    id?: IntFieldUpdateOperationsInput | number
    pegawaiNup?: StringFieldUpdateOperationsInput | string
    jabatan?: NullableStringFieldUpdateOperationsInput | string | null
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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