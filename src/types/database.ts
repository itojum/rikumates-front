import type { Database, Tables, TablesInsert, TablesUpdate, Enums } from './supabase'

// テーブル型のエイリアス
export type Profile = Tables<'profiles'>
export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>

// 列挙型のエイリアス
export type JobHuntType = Enums<'job_hunt'>

// データベース型のエクスポート
export type { Database }

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