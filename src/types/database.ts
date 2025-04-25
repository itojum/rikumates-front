import type { Database as SupabaseDatabase, Tables, TablesInsert, TablesUpdate, Enums, Json } from './supabase'

// テーブル型のエイリアス
export type Profile = Tables<'profiles'>
export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>

export type Company = Tables<'companies'>
export type CompanyInsert = TablesInsert<'companies'>
export type CompanyUpdate = TablesUpdate<'companies'>

export type Event = Tables<'events'>
export type EventInsert = TablesInsert<'events'>
export type EventUpdate = TablesUpdate<'events'>

export type Todo = Tables<'todos'>
export type TodoInsert = TablesInsert<'todos'>
export type TodoUpdate = TablesUpdate<'todos'>

// 列挙型のエイリアス
export type JobHuntType = Enums<'job_hunt'>

// データベース型のエクスポート
export type Database = SupabaseDatabase
export type { Json }

// ユーティリティ型
export type WithTimestamp<T> = T & {
  created_at: string
  updated_at: string
}

// 定数のエクスポート
export const JOB_HUNT_TYPES = {
  NEW_GRAD: 'new_grad' as const,
  MID_CAREER: 'mid_career' as const,
} as const