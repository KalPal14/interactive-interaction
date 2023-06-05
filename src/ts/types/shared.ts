export type TId = number | string

export type TMonoObject<T> = {
	[key: string]: T
}

export type TAccessRole = 'guest' | 'userWithoutAccount' | 'userWithAccount' | 'teacher'
