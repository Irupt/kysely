import {
  ColumnType,
  Generated,
  GeneratedAlways,
  JSONColumnType,
} from '../../dist/cjs'

export interface Pet {
  id: Generated<string>
  name: string
  owner_id: number
  species: 'dog' | 'cat'
}

export interface Toy {
  id: Generated<string>
  price: number
  pet_id: string
}

export interface Movie {
  id: Generated<string>
  stars: number
}

export interface Book {
  id: GeneratedAlways<number>
  name: string
}

export interface Database {
  person: Person
  pet: Pet
  movie: Movie
  'some_schema.movie': Movie
  book: Book
  toy: Toy
  person_metadata: PersonMetadata
  action: Action
}

export type Action =
  | {
      id: GeneratedAlways<string>
      type: 'CALL_WEBHOOK'
      queue_id: null
      callback_url: string
    }
  | {
      id: GeneratedAlways<string>
      type: 'DELETE_FROM_QUEUE'
      queue_id: string
      callback_url: null
    }

export interface Person {
  id: Generated<number>
  first_name: string
  last_name: string | null
  age: number
  gender: 'male' | 'female' | 'other'
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
  // A Column that is generated by the DB and which
  // we never want the user to be able to insert or
  // update.
  modified_at: ColumnType<Date, never, never>
  // A column that cannot be inserted, but can be updated.
  deleted_at: ColumnType<Date | null, never, string | undefined>
}

export interface PersonMetadata {
  id: Generated<number>
  person_id: number
  website: JSONColumnType<{ url: string }>
  nicknames: JSONColumnType<string[]>
  profile: JSONColumnType<{
    auth: {
      roles: string[]
      last_login?: { device: string }
    }
    tags: string[]
  }>
  experience: JSONColumnType<
    {
      establishment: string
    }[]
  >
  schedule: JSONColumnType<{ name: string; time: string }[][][]>
  record: JSONColumnType<Record<string, string>>
  array: JSONColumnType<Array<string>>
}
