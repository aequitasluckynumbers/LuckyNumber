export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin: {
        Row: {
          access: string[] | null
          country: string | null
          created_at: string | null
          designation: string | null
          email: string | null
          id: string
          name: string | null
          role: string | null
          subrole: string | null
        }
        Insert: {
          access?: string[] | null
          country?: string | null
          created_at?: string | null
          designation?: string | null
          email?: string | null
          id: string
          name?: string | null
          role?: string | null
          subrole?: string | null
        }
        Update: {
          access?: string[] | null
          country?: string | null
          created_at?: string | null
          designation?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string | null
          subrole?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      card: {
        Row: {
          created_at: string | null
          game: string | null
          id: string
          is_winner: boolean
          numbers: number[]
          player: string | null
        }
        Insert: {
          created_at?: string | null
          game?: string | null
          id?: string
          is_winner?: boolean
          numbers: number[]
          player?: string | null
        }
        Update: {
          created_at?: string | null
          game?: string | null
          id?: string
          is_winner?: boolean
          numbers?: number[]
          player?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_game_fkey"
            columns: ["game"]
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_player_fkey"
            columns: ["player"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      game: {
        Row: {
          country: string | null
          created_at: string | null
          duration: number
          episode_no: number
          id: string
          odds: number
          pool: number | null
          prizes: string[] | null
          starts_at: string
          time_arr: number[]
          winning_numbers: number[]
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          duration: number
          episode_no?: number
          id?: string
          odds?: number
          pool?: number | null
          prizes?: string[] | null
          starts_at: string
          time_arr: number[]
          winning_numbers: number[]
        }
        Update: {
          country?: string | null
          created_at?: string | null
          duration?: number
          episode_no?: number
          id?: string
          odds?: number
          pool?: number | null
          prizes?: string[] | null
          starts_at?: string
          time_arr?: number[]
          winning_numbers?: number[]
        }
        Relationships: []
      }
      users: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          dob: string | null
          email: string | null
          fname: string | null
          gender: string | null
          id: string
          is_complete: boolean
          lname: string | null
          phone: string | null
          street: string | null
          zipcode: number | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          fname?: string | null
          gender?: string | null
          id: string
          is_complete?: boolean
          lname?: string | null
          phone?: string | null
          street?: string | null
          zipcode?: number | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          fname?: string | null
          gender?: string | null
          id?: string
          is_complete?: boolean
          lname?: string | null
          phone?: string | null
          street?: string | null
          zipcode?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
