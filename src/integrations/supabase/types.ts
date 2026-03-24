export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      app_config: {
        Row: {
          key: string
          updated_at: string
          value_json: Json | null
        }
        Insert: {
          key: string
          updated_at?: string
          value_json?: Json | null
        }
        Update: {
          key?: string
          updated_at?: string
          value_json?: Json | null
        }
        Relationships: []
      }
      appeals: {
        Row: {
          apology_tokens_awarded: number | null
          appeal_text: string | null
          created_at: string
          id: string
          moderation_event_id: string
          resolution_text: string | null
          resolved_at: string | null
          status: string
          user_id: string
          voice_note_url: string | null
        }
        Insert: {
          apology_tokens_awarded?: number | null
          appeal_text?: string | null
          created_at?: string
          id?: string
          moderation_event_id: string
          resolution_text?: string | null
          resolved_at?: string | null
          status?: string
          user_id: string
          voice_note_url?: string | null
        }
        Update: {
          apology_tokens_awarded?: number | null
          appeal_text?: string | null
          created_at?: string
          id?: string
          moderation_event_id?: string
          resolution_text?: string | null
          resolved_at?: string | null
          status?: string
          user_id?: string
          voice_note_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appeals_moderation_event_id_fkey"
            columns: ["moderation_event_id"]
            isOneToOne: false
            referencedRelation: "moderation_events"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          agora_channel: string | null
          callee_decision: Database["public"]["Enums"]["spark_decision"] | null
          callee_id: string
          caller_decision: Database["public"]["Enums"]["spark_decision"] | null
          caller_id: string
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          is_mutual_spark: boolean | null
          room_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["call_status"] | null
        }
        Insert: {
          agora_channel?: string | null
          callee_decision?: Database["public"]["Enums"]["spark_decision"] | null
          callee_id: string
          caller_decision?: Database["public"]["Enums"]["spark_decision"] | null
          caller_id: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          is_mutual_spark?: boolean | null
          room_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["call_status"] | null
        }
        Update: {
          agora_channel?: string | null
          callee_decision?: Database["public"]["Enums"]["spark_decision"] | null
          callee_id?: string
          caller_decision?: Database["public"]["Enums"]["spark_decision"] | null
          caller_id?: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          is_mutual_spark?: boolean | null
          room_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["call_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          id: string
          match_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      chemistry_replays: {
        Row: {
          call_id: string
          created_at: string
          duration_seconds: number
          id: string
          spark_id: string
          status: string
          user_a: string
          user_b: string
          video_url: string | null
        }
        Insert: {
          call_id: string
          created_at?: string
          duration_seconds?: number
          id?: string
          spark_id: string
          status?: string
          user_a: string
          user_b: string
          video_url?: string | null
        }
        Update: {
          call_id?: string
          created_at?: string
          duration_seconds?: number
          id?: string
          spark_id?: string
          status?: string
          user_a?: string
          user_b?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chemistry_replays_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chemistry_replays_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "my_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chemistry_replays_spark_id_fkey"
            columns: ["spark_id"]
            isOneToOne: false
            referencedRelation: "sparks"
            referencedColumns: ["id"]
          },
        ]
      }
      chemistry_vault_items: {
        Row: {
          call_id: string
          created_at: string
          highlights: Json
          id: string
          partner_user_id: string
          reflection_id: string | null
          title: string | null
          updated_at: string
          user_id: string
          user_notes: string | null
        }
        Insert: {
          call_id: string
          created_at?: string
          highlights?: Json
          id?: string
          partner_user_id: string
          reflection_id?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          user_notes?: string | null
        }
        Update: {
          call_id?: string
          created_at?: string
          highlights?: Json
          id?: string
          partner_user_id?: string
          reflection_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          user_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chemistry_vault_items_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chemistry_vault_items_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "my_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chemistry_vault_items_reflection_id_fkey"
            columns: ["reflection_id"]
            isOneToOne: false
            referencedRelation: "spark_reflections"
            referencedColumns: ["id"]
          },
        ]
      }
      drop_rsvps: {
        Row: {
          created_at: string | null
          drop_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          drop_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          drop_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drop_rsvps_drop_id_fkey"
            columns: ["drop_id"]
            isOneToOne: false
            referencedRelation: "drop_social_proof"
            referencedColumns: ["drop_id"]
          },
          {
            foreignKeyName: "drop_rsvps_drop_id_fkey"
            columns: ["drop_id"]
            isOneToOne: false
            referencedRelation: "drops"
            referencedColumns: ["id"]
          },
        ]
      }
      drop_theme_prompts: {
        Row: {
          id: string
          is_active: boolean
          position: number
          prompt_text: string
          theme_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          position?: number
          prompt_text: string
          theme_id: string
        }
        Update: {
          id?: string
          is_active?: boolean
          position?: number
          prompt_text?: string
          theme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drop_theme_prompts_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "drop_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      drop_themes: {
        Row: {
          accent_color: string
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_seasonal: boolean
          seasonal_end: string | null
          seasonal_start: string | null
          slug: string
          title: string
          vibe: string | null
        }
        Insert: {
          accent_color?: string
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_seasonal?: boolean
          seasonal_end?: string | null
          seasonal_start?: string | null
          slug: string
          title: string
          vibe?: string | null
        }
        Update: {
          accent_color?: string
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_seasonal?: boolean
          seasonal_end?: string | null
          seasonal_start?: string | null
          slug?: string
          title?: string
          vibe?: string | null
        }
        Relationships: []
      }
      drops: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_friendfluence: boolean | null
          max_capacity: number | null
          region: string | null
          room_id: string | null
          scheduled_at: string
          status: string | null
          theme_id: string | null
          timezone: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_friendfluence?: boolean | null
          max_capacity?: number | null
          region?: string | null
          room_id?: string | null
          scheduled_at: string
          status?: string | null
          theme_id?: string | null
          timezone?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_friendfluence?: boolean | null
          max_capacity?: number | null
          region?: string | null
          room_id?: string | null
          scheduled_at?: string
          status?: string | null
          theme_id?: string | null
          timezone?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "drops_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drops_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "drop_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_assignments: {
        Row: {
          assigned_at: string
          experiment_key: string
          user_id: string
          variant_key: string
        }
        Insert: {
          assigned_at?: string
          experiment_key: string
          user_id: string
          variant_key: string
        }
        Update: {
          assigned_at?: string
          experiment_key?: string
          user_id?: string
          variant_key?: string
        }
        Relationships: []
      }
      guardian_alerts: {
        Row: {
          call_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          call_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          call_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardian_alerts_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guardian_alerts_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "my_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          liked_id: string
          liker_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          liked_id: string
          liker_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          liked_id?: string
          liker_id?: string
        }
        Relationships: []
      }
      match_queue: {
        Row: {
          entered_at: string
          gender: string | null
          id: string
          is_warmup: boolean
          match_id: string | null
          matched_at: string | null
          matched_with: string | null
          room_id: string
          seeking_gender: string | null
          status: string
          user_id: string
        }
        Insert: {
          entered_at?: string
          gender?: string | null
          id?: string
          is_warmup?: boolean
          match_id?: string | null
          matched_at?: string | null
          matched_with?: string | null
          room_id?: string
          seeking_gender?: string | null
          status?: string
          user_id: string
        }
        Update: {
          entered_at?: string
          gender?: string | null
          id?: string
          is_warmup?: boolean
          match_id?: string | null
          matched_at?: string | null
          matched_with?: string | null
          room_id?: string
          seeking_gender?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_queue_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          call_id: string | null
          created_at: string | null
          id: string
          is_mutual: boolean | null
          room_id: string | null
          user1_decision: string | null
          user1_id: string
          user1_note: string | null
          user2_decision: string | null
          user2_id: string
          user2_note: string | null
        }
        Insert: {
          call_id?: string | null
          created_at?: string | null
          id?: string
          is_mutual?: boolean | null
          room_id?: string | null
          user1_decision?: string | null
          user1_id: string
          user1_note?: string | null
          user2_decision?: string | null
          user2_id: string
          user2_note?: string | null
        }
        Update: {
          call_id?: string | null
          created_at?: string | null
          id?: string
          is_mutual?: boolean | null
          room_id?: string | null
          user1_decision?: string | null
          user1_id?: string
          user1_note?: string | null
          user2_decision?: string | null
          user2_id?: string
          user2_note?: string | null
        }
        Relationships: []
      }
      matchmaking_queue: {
        Row: {
          call_id: string | null
          drop_id: string | null
          id: string
          joined_at: string
          matched_at: string | null
          room_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          call_id?: string | null
          drop_id?: string | null
          id?: string
          joined_at?: string
          matched_at?: string | null
          room_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          call_id?: string | null
          drop_id?: string | null
          id?: string
          joined_at?: string
          matched_at?: string | null
          room_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matchmaking_queue_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchmaking_queue_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "my_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchmaking_queue_drop_id_fkey"
            columns: ["drop_id"]
            isOneToOne: false
            referencedRelation: "drop_social_proof"
            referencedColumns: ["drop_id"]
          },
          {
            foreignKeyName: "matchmaking_queue_drop_id_fkey"
            columns: ["drop_id"]
            isOneToOne: false
            referencedRelation: "drops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchmaking_queue_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_room_id: string | null
          content: string | null
          created_at: string | null
          from_user: string | null
          id: string
          is_read: boolean | null
          is_voice: boolean | null
          match_id: string | null
          message_text: string | null
          sender_id: string | null
          spark_id: string | null
          voice_url: string | null
        }
        Insert: {
          chat_room_id?: string | null
          content?: string | null
          created_at?: string | null
          from_user?: string | null
          id?: string
          is_read?: boolean | null
          is_voice?: boolean | null
          match_id?: string | null
          message_text?: string | null
          sender_id?: string | null
          spark_id?: string | null
          voice_url?: string | null
        }
        Update: {
          chat_room_id?: string | null
          content?: string | null
          created_at?: string | null
          from_user?: string | null
          id?: string
          is_read?: boolean | null
          is_voice?: boolean | null
          match_id?: string | null
          message_text?: string | null
          sender_id?: string | null
          spark_id?: string | null
          voice_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_spark_id_fkey"
            columns: ["spark_id"]
            isOneToOne: false
            referencedRelation: "sparks"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_events: {
        Row: {
          action_taken: string
          ai_reasoning: string | null
          call_id: string | null
          category: string
          clip_expires_at: string | null
          clip_url: string | null
          confidence: number
          created_at: string
          id: string
          match_id: string | null
          offender_id: string
          review_outcome: string | null
          reviewed: boolean
          reviewed_at: string | null
          reviewed_by: string | null
          tier: number
          victim_id: string | null
        }
        Insert: {
          action_taken?: string
          ai_reasoning?: string | null
          call_id?: string | null
          category: string
          clip_expires_at?: string | null
          clip_url?: string | null
          confidence?: number
          created_at?: string
          id?: string
          match_id?: string | null
          offender_id: string
          review_outcome?: string | null
          reviewed?: boolean
          reviewed_at?: string | null
          reviewed_by?: string | null
          tier?: number
          victim_id?: string | null
        }
        Update: {
          action_taken?: string
          ai_reasoning?: string | null
          call_id?: string | null
          category?: string
          clip_expires_at?: string | null
          clip_url?: string | null
          confidence?: number
          created_at?: string
          id?: string
          match_id?: string | null
          offender_id?: string
          review_outcome?: string | null
          reviewed?: boolean
          reviewed_at?: string | null
          reviewed_by?: string | null
          tier?: number
          victim_id?: string | null
        }
        Relationships: []
      }
      moderation_flags: {
        Row: {
          action_taken: Database["public"]["Enums"]["moderation_action"] | null
          ai_confidence: number | null
          call_id: string | null
          clip_url: string | null
          created_at: string
          flagged_user_id: string
          id: string
          reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          action_taken?: Database["public"]["Enums"]["moderation_action"] | null
          ai_confidence?: number | null
          call_id?: string | null
          clip_url?: string | null
          created_at?: string
          flagged_user_id: string
          id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          action_taken?: Database["public"]["Enums"]["moderation_action"] | null
          ai_confidence?: number | null
          call_id?: string | null
          clip_url?: string | null
          created_at?: string
          flagged_user_id?: string
          id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_flags_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_flags_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "my_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_stats: {
        Row: {
          appeals_filed: number
          appeals_overturned: number
          avg_latency_ms: number
          date: string
          false_positive_rate: number
          id: string
          safe_exits: number
          tier0_actions: number
          tier1_warnings: number
          total_calls: number
          updated_at: string
          violation_free_calls: number
        }
        Insert: {
          appeals_filed?: number
          appeals_overturned?: number
          avg_latency_ms?: number
          date?: string
          false_positive_rate?: number
          id?: string
          safe_exits?: number
          tier0_actions?: number
          tier1_warnings?: number
          total_calls?: number
          updated_at?: string
          violation_free_calls?: number
        }
        Update: {
          appeals_filed?: number
          appeals_overturned?: number
          avg_latency_ms?: number
          date?: string
          false_positive_rate?: number
          id?: string
          safe_exits?: number
          tier0_actions?: number
          tier1_warnings?: number
          total_calls?: number
          updated_at?: string
          violation_free_calls?: number
        }
        Relationships: []
      }
      notification_deliveries: {
        Row: {
          channel: string
          dedupe_key: string | null
          id: string
          metadata: Json
          sent_at: string
          template_key: string
          user_id: string
        }
        Insert: {
          channel: string
          dedupe_key?: string | null
          id?: string
          metadata?: Json
          sent_at?: string
          template_key: string
          user_id: string
        }
        Update: {
          channel?: string
          dedupe_key?: string | null
          id?: string
          metadata?: Json
          sent_at?: string
          template_key?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          email_enabled: boolean
          push_enabled: boolean
          quiet_hours: Json
          sms_enabled: boolean
          transactional_only: boolean
          updated_at: string
          user_id: string
          weekly_cap: number
        }
        Insert: {
          email_enabled?: boolean
          push_enabled?: boolean
          quiet_hours?: Json
          sms_enabled?: boolean
          transactional_only?: boolean
          updated_at?: string
          user_id: string
          weekly_cap?: number
        }
        Update: {
          email_enabled?: boolean
          push_enabled?: boolean
          quiet_hours?: Json
          sms_enabled?: boolean
          transactional_only?: boolean
          updated_at?: string
          user_id?: string
          weekly_cap?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      platform_stats: {
        Row: {
          active_users: number | null
          ai_accuracy: number | null
          appeals_total: number | null
          appeals_upheld: number | null
          created_at: string
          gender_balance: Json | null
          id: string
          moderation_flags_count: number | null
          stat_date: string
          total_calls: number | null
          total_sparks: number | null
        }
        Insert: {
          active_users?: number | null
          ai_accuracy?: number | null
          appeals_total?: number | null
          appeals_upheld?: number | null
          created_at?: string
          gender_balance?: Json | null
          id?: string
          moderation_flags_count?: number | null
          stat_date?: string
          total_calls?: number | null
          total_sparks?: number | null
        }
        Update: {
          active_users?: number | null
          ai_accuracy?: number | null
          appeals_total?: number | null
          appeals_upheld?: number | null
          created_at?: string
          gender_balance?: Json | null
          id?: string
          moderation_flags_count?: number | null
          stat_date?: string
          total_calls?: number | null
          total_sparks?: number | null
        }
        Relationships: []
      }
      post_call_feedback: {
        Row: {
          call_id: string
          created_at: string
          free_text: string | null
          id: string
          rating: number | null
          reason_codes: string[]
          user_id: string
        }
        Insert: {
          call_id: string
          created_at?: string
          free_text?: string | null
          id?: string
          rating?: number | null
          reason_codes?: string[]
          user_id: string
        }
        Update: {
          call_id?: string
          created_at?: string
          free_text?: string | null
          id?: string
          rating?: number | null
          reason_codes?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_call_feedback_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      preferences: {
        Row: {
          age_range: unknown
          created_at: string | null
          distance_km: number | null
          gender_prefs: string[] | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age_range?: unknown
          created_at?: string | null
          distance_km?: number | null
          gender_prefs?: string[] | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age_range?: unknown
          created_at?: string | null
          distance_km?: number | null
          gender_prefs?: string[] | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      product_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          properties: Json
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          properties?: Json
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          properties?: Json
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number
          avatar_emoji: string | null
          avatar_url: string | null
          banned: boolean | null
          bio: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          display_name: string | null
          first_call_at: string | null
          first_lobby_seen_at: string | null
          first_mutual_spark_at: string | null
          first_rsvp_at: string | null
          gender: string
          government_id_status: string | null
          government_id_url: string | null
          handle: string | null
          id: string
          intro_video_url: string | null
          is_active: boolean | null
          location: unknown
          looking_for: string[] | null
          name: string
          onboarding_variant: string | null
          phone_number: string | null
          photos: string[] | null
          seeking_gender: string | null
          selfie_url: string | null
          subscription_expires_at: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          token_balance: number
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
          verification_video_url: string | null
          verified: boolean | null
          verified_phone: boolean
          warmup_calls_remaining: number | null
        }
        Insert: {
          age: number
          avatar_emoji?: string | null
          avatar_url?: string | null
          banned?: boolean | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          first_call_at?: string | null
          first_lobby_seen_at?: string | null
          first_mutual_spark_at?: string | null
          first_rsvp_at?: string | null
          gender: string
          government_id_status?: string | null
          government_id_url?: string | null
          handle?: string | null
          id: string
          intro_video_url?: string | null
          is_active?: boolean | null
          location?: unknown
          looking_for?: string[] | null
          name: string
          onboarding_variant?: string | null
          phone_number?: string | null
          photos?: string[] | null
          seeking_gender?: string | null
          selfie_url?: string | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          token_balance?: number
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          verification_video_url?: string | null
          verified?: boolean | null
          verified_phone?: boolean
          warmup_calls_remaining?: number | null
        }
        Update: {
          age?: number
          avatar_emoji?: string | null
          avatar_url?: string | null
          banned?: boolean | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          first_call_at?: string | null
          first_lobby_seen_at?: string | null
          first_mutual_spark_at?: string | null
          first_rsvp_at?: string | null
          gender?: string
          government_id_status?: string | null
          government_id_url?: string | null
          handle?: string | null
          id?: string
          intro_video_url?: string | null
          is_active?: boolean | null
          location?: unknown
          looking_for?: string[] | null
          name?: string
          onboarding_variant?: string | null
          phone_number?: string | null
          photos?: string[] | null
          seeking_gender?: string | null
          selfie_url?: string | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          token_balance?: number
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          verification_video_url?: string | null
          verified?: boolean | null
          verified_phone?: boolean
          warmup_calls_remaining?: number | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          attempts: number | null
          id: string
          user_id: string
          window_start: string | null
        }
        Insert: {
          action: string
          attempts?: number | null
          id?: string
          user_id: string
          window_start?: string | null
        }
        Update: {
          action?: string
          attempts?: number | null
          id?: string
          user_id?: string
          window_start?: string | null
        }
        Relationships: []
      }
      referral_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          id: string
          invite_code: string
          invitee_user_id: string | null
          inviter_user_id: string
          status: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invite_code: string
          invitee_user_id?: string | null
          inviter_user_id: string
          status?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invite_code?: string
          invitee_user_id?: string | null
          inviter_user_id?: string
          status?: string
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          granted_at: string
          id: string
          referral_id: string
          reward_type: string
          reward_value: number
          user_id: string
        }
        Insert: {
          granted_at?: string
          id?: string
          referral_id: string
          reward_type: string
          reward_value?: number
          user_id: string
        }
        Update: {
          granted_at?: string
          id?: string
          referral_id?: string
          reward_type?: string
          reward_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referral_invites"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          details: string | null
          id: string
          reason: string
          reported_date_id: string | null
          reported_user_id: string | null
          reporter_id: string
          status: Database["public"]["Enums"]["report_status"] | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          reason: string
          reported_date_id?: string | null
          reported_user_id?: string | null
          reporter_id: string
          status?: Database["public"]["Enums"]["report_status"] | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          reason?: string
          reported_date_id?: string | null
          reported_user_id?: string | null
          reporter_id?: string
          status?: Database["public"]["Enums"]["report_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_date_id_fkey"
            columns: ["reported_date_id"]
            isOneToOne: false
            referencedRelation: "verity_dates"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      runtime_alert_events: {
        Row: {
          created_at: string
          details: Json | null
          event_source: string
          event_type: string
          id: number
          severity: string
          status_code: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_source: string
          event_type: string
          id?: number
          severity?: string
          status_code?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_source?: string
          event_type?: string
          id?: number
          severity?: string
          status_code?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      selfie_verification_attempts: {
        Row: {
          attempted_at: string
          id: string
          user_id: string
        }
        Insert: {
          attempted_at?: string
          id?: string
          user_id: string
        }
        Update: {
          attempted_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      spark_reflections: {
        Row: {
          ai_reflection: string | null
          call_id: string
          created_at: string
          feeling_score: number | null
          id: string
          liked_text: string | null
          next_time_text: string | null
          user_id: string
        }
        Insert: {
          ai_reflection?: string | null
          call_id: string
          created_at?: string
          feeling_score?: number | null
          id?: string
          liked_text?: string | null
          next_time_text?: string | null
          user_id: string
        }
        Update: {
          ai_reflection?: string | null
          call_id?: string
          created_at?: string
          feeling_score?: number | null
          id?: string
          liked_text?: string | null
          next_time_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spark_reflections_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spark_reflections_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "my_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      sparks: {
        Row: {
          ai_insight: string | null
          call_id: string
          created_at: string
          expires_at: string | null
          id: string
          is_archived: boolean | null
          user_a: string
          user_b: string
          voice_intro_a: string | null
          voice_intro_b: string | null
        }
        Insert: {
          ai_insight?: string | null
          call_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_archived?: boolean | null
          user_a: string
          user_b: string
          voice_intro_a?: string | null
          voice_intro_b?: string | null
        }
        Update: {
          ai_insight?: string | null
          call_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_archived?: boolean | null
          user_a?: string
          user_b?: string
          voice_intro_a?: string | null
          voice_intro_b?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sparks_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sparks_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "my_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      stripe_events: {
        Row: {
          created_at: string
          error: string | null
          event_id: string
          event_type: string
          payload: Json | null
          processed_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_id: string
          event_type: string
          payload?: Json | null
          processed_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          error?: string | null
          event_id?: string
          event_type?: string
          payload?: Json | null
          processed_at?: string | null
          status?: string
        }
        Relationships: []
      }
      stripe_processed_events: {
        Row: {
          event_id: string
          processed_at: string
        }
        Insert: {
          event_id: string
          processed_at?: string
        }
        Update: {
          event_id?: string
          processed_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          anonymized_name: string
          approved_by: string | null
          author_user_id: string | null
          city: string | null
          created_at: string
          id: string
          is_approved: boolean
          published_at: string | null
          story_text: string
          tags: string[]
        }
        Insert: {
          anonymized_name: string
          approved_by?: string | null
          author_user_id?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          published_at?: string | null
          story_text: string
          tags?: string[]
        }
        Update: {
          anonymized_name?: string
          approved_by?: string | null
          author_user_id?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          published_at?: string | null
          story_text?: string
          tags?: string[]
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          answers: Json
          created_at: string
          id: string
          score: number | null
          survey_key: string
          user_id: string | null
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: string
          score?: number | null
          survey_key: string
          user_id?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          score?: number | null
          survey_key?: string
          user_id?: string | null
        }
        Relationships: []
      }
      token_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_bans: {
        Row: {
          ban_type: string
          created_at: string
          expires_at: string | null
          id: string
          lifted_at: string | null
          moderation_event_id: string | null
          reason: string
          user_id: string
        }
        Insert: {
          ban_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          lifted_at?: string | null
          moderation_event_id?: string | null
          reason: string
          user_id: string
        }
        Update: {
          ban_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          lifted_at?: string | null
          moderation_event_id?: string | null
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bans_moderation_event_id_fkey"
            columns: ["moderation_event_id"]
            isOneToOne: false
            referencedRelation: "moderation_events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      user_payment_info: {
        Row: {
          created_at: string
          id: string
          stripe_customer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_tokens: {
        Row: {
          balance: number
          created_at: string
          free_entries_remaining: number
          free_entries_reset_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          free_entries_remaining?: number
          free_entries_reset_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          free_entries_remaining?: number
          free_entries_reset_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_trust: {
        Row: {
          age_verified: boolean
          created_at: string
          id: string
          onboarding_complete: boolean
          onboarding_step: number
          phone_verified: boolean
          preferences: Json | null
          safety_pledge_accepted: boolean
          selfie_verified: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          age_verified?: boolean
          created_at?: string
          id?: string
          onboarding_complete?: boolean
          onboarding_step?: number
          phone_verified?: boolean
          preferences?: Json | null
          safety_pledge_accepted?: boolean
          selfie_verified?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          age_verified?: boolean
          created_at?: string
          id?: string
          onboarding_complete?: boolean
          onboarding_step?: number
          phone_verified?: boolean
          preferences?: Json | null
          safety_pledge_accepted?: boolean
          selfie_verified?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verification_signals: {
        Row: {
          metadata: Json
          signal_key: string
          status: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          metadata?: Json
          signal_key: string
          status?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          metadata?: Json
          signal_key?: string
          status?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      verity_dates: {
        Row: {
          created_at: string | null
          daily_room_url: string | null
          ended_at: string | null
          id: string
          match_id: string
          recipient_feedback:
            | Database["public"]["Enums"]["date_feedback"]
            | null
          recipient_id: string
          requester_feedback:
            | Database["public"]["Enums"]["date_feedback"]
            | null
          requester_id: string
          scheduled_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["date_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          daily_room_url?: string | null
          ended_at?: string | null
          id?: string
          match_id: string
          recipient_feedback?:
            | Database["public"]["Enums"]["date_feedback"]
            | null
          recipient_id: string
          requester_feedback?:
            | Database["public"]["Enums"]["date_feedback"]
            | null
          requester_id: string
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["date_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          daily_room_url?: string | null
          ended_at?: string | null
          id?: string
          match_id?: string
          recipient_feedback?:
            | Database["public"]["Enums"]["date_feedback"]
            | null
          recipient_id?: string
          requester_feedback?:
            | Database["public"]["Enums"]["date_feedback"]
            | null
          requester_id?: string
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["date_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verity_dates_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          city: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          referral_source: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          referral_source?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          referral_source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      activation_funnel: {
        Row: {
          cohort_day: string | null
          first_call: number | null
          first_mutual_spark: number | null
          first_rsvp: number | null
          saw_lobby: number | null
          signups: number | null
        }
        Relationships: []
      }
      drop_social_proof: {
        Row: {
          drop_id: string | null
          last_rsvp_at: string | null
          max_capacity: number | null
          rsvp_count: number | null
          spots_remaining: number | null
          theme_id: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drops_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "drop_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      my_calls: {
        Row: {
          agora_channel: string | null
          callee_decision: Database["public"]["Enums"]["spark_decision"] | null
          callee_id: string | null
          caller_decision: Database["public"]["Enums"]["spark_decision"] | null
          caller_id: string | null
          created_at: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string | null
          is_mutual_spark: boolean | null
          recording_resource_id: string | null
          recording_sid: string | null
          recording_url: string | null
          room_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["call_status"] | null
        }
        Insert: {
          agora_channel?: string | null
          callee_decision?: Database["public"]["Enums"]["spark_decision"] | null
          callee_id?: string | null
          caller_decision?: Database["public"]["Enums"]["spark_decision"] | null
          caller_id?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string | null
          is_mutual_spark?: boolean | null
          recording_resource_id?: string | null
          recording_sid?: string | null
          recording_url?: string | null
          room_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["call_status"] | null
        }
        Update: {
          agora_channel?: string | null
          callee_decision?: Database["public"]["Enums"]["spark_decision"] | null
          callee_id?: string | null
          caller_decision?: Database["public"]["Enums"]["spark_decision"] | null
          caller_id?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string | null
          is_mutual_spark?: boolean | null
          recording_resource_id?: string | null
          recording_sid?: string | null
          recording_url?: string | null
          room_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["call_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      my_chemistry_replays: {
        Row: {
          call_id: string | null
          created_at: string | null
          duration_seconds: number | null
          id: string | null
          spark_id: string | null
          status: string | null
          user_a: string | null
          user_b: string | null
          video_url: string | null
        }
        Insert: {
          call_id?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string | null
          spark_id?: string | null
          status?: string | null
          user_a?: string | null
          user_b?: string | null
          video_url?: string | null
        }
        Update: {
          call_id?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string | null
          spark_id?: string | null
          status?: string | null
          user_a?: string | null
          user_b?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chemistry_replays_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chemistry_replays_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "my_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chemistry_replays_spark_id_fkey"
            columns: ["spark_id"]
            isOneToOne: false
            referencedRelation: "sparks"
            referencedColumns: ["id"]
          },
        ]
      }
      my_messages: {
        Row: {
          chat_room_id: string | null
          content: string | null
          created_at: string | null
          from_user: string | null
          id: string | null
          is_read: boolean | null
          is_voice: boolean | null
          match_id: string | null
          message_text: string | null
          sender_id: string | null
          spark_id: string | null
          voice_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_spark_id_fkey"
            columns: ["spark_id"]
            isOneToOne: false
            referencedRelation: "sparks"
            referencedColumns: ["id"]
          },
        ]
      }
      my_moderation_flags: {
        Row: {
          action_taken: Database["public"]["Enums"]["moderation_action"] | null
          ai_confidence: number | null
          created_at: string | null
          id: string | null
          reason: string | null
          reviewed_at: string | null
        }
        Insert: {
          action_taken?: Database["public"]["Enums"]["moderation_action"] | null
          ai_confidence?: number | null
          created_at?: string | null
          id?: string | null
          reason?: string | null
          reviewed_at?: string | null
        }
        Update: {
          action_taken?: Database["public"]["Enums"]["moderation_action"] | null
          ai_confidence?: number | null
          created_at?: string | null
          id?: string | null
          reason?: string | null
          reviewed_at?: string | null
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          id: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      add_tokens: {
        Args: { p_amount: number; p_user_id: string }
        Returns: undefined
      }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      check_notification_cap: { Args: { p_user_id: string }; Returns: boolean }
      claim_match_candidate: {
        Args: { p_drop_id: string; p_user_id: string }
        Returns: {
          candidate_queue_id: string
          candidate_user_id: string
        }[]
      }
      deduct_tokens: {
        Args: { p_cost: number; p_user_id: string }
        Returns: undefined
      }
      delete_my_account: { Args: never; Returns: undefined }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_drop_rsvp_count: { Args: { _drop_id: string }; Returns: number }
      get_public_drop_schedule: {
        Args: never
        Returns: {
          description: string
          duration_minutes: number
          id: string
          is_friendfluence: boolean
          max_capacity: number
          room_id: string
          room_name: string
          rsvp_count: number
          scheduled_at: string
          status: string
          timezone: string
          title: string
        }[]
      }
      get_spark_partner_profile: {
        Args: { _partner_user_id: string }
        Returns: {
          avatar_url: string
          display_name: string
          user_id: string
        }[]
      }
      get_vault_secret: { Args: { secret_name: string }; Returns: string }
      gettransactionid: { Args: never; Returns: unknown }
      has_role:
        | { Args: { _role: string; _user_id: string }; Returns: boolean }
        | { Args: { required_role: string }; Returns: boolean }
      increment_user_tokens: {
        Args: {
          p_delta: number
          p_description?: string
          p_type: string
          p_user_id: string
        }
        Returns: number
      }
      is_chat_participant: { Args: { _chat_room_id: string }; Returns: boolean }
      is_match_participant: { Args: { _match_id: string }; Returns: boolean }
      is_spark_member: {
        Args: { _spark_id: string; _user_id: string }
        Returns: boolean
      }
      is_user_blocked: { Args: { target_user_id: string }; Returns: boolean }
      log_runtime_alert_event: {
        Args: {
          p_details?: Json
          p_event_source: string
          p_event_type: string
          p_severity?: string
          p_status_code?: number
          p_user_id?: string
        }
        Returns: undefined
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      rpc_cancel_matchmaking: { Args: { p_queue_id?: string }; Returns: Json }
      rpc_enter_matchmaking: {
        Args: { p_is_warmup?: boolean; p_room_id: string }
        Returns: Json
      }
      rpc_submit_match_decision: {
        Args: { p_decision: string; p_match_id: string; p_note?: string }
        Returns: Json
      }
      shares_spark_with: {
        Args: { _profile_user_id: string; _viewer_id: string }
        Returns: boolean
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      submit_call_decision: {
        Args: {
          p_call_id: string
          p_decision: Database["public"]["Enums"]["spark_decision"]
        }
        Returns: undefined
      }
      unlockrows: { Args: { "": string }; Returns: number }
      update_my_profile: {
        Args: {
          p_avatar_url?: string
          p_bio?: string
          p_city?: string
          p_display_name?: string
          p_gender?: string
          p_handle?: string
        }
        Returns: undefined
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      appeal_status: "pending" | "upheld" | "denied"
      call_status: "waiting" | "active" | "completed" | "cancelled"
      date_feedback: "yes" | "maybe" | "no"
      date_status:
        | "pending"
        | "accepted"
        | "in_progress"
        | "completed"
        | "cancelled"
      moderation_action: "ban" | "warn" | "clear"
      notification_type:
        | "match"
        | "like"
        | "date_request"
        | "date_accepted"
        | "message"
      report_status: "pending" | "under_review" | "resolved" | "dismissed"
      spark_decision: "spark" | "pass"
      subscription_tier: "free" | "pass_monthly" | "pass_annual"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      appeal_status: ["pending", "upheld", "denied"],
      call_status: ["waiting", "active", "completed", "cancelled"],
      date_feedback: ["yes", "maybe", "no"],
      date_status: [
        "pending",
        "accepted",
        "in_progress",
        "completed",
        "cancelled",
      ],
      moderation_action: ["ban", "warn", "clear"],
      notification_type: [
        "match",
        "like",
        "date_request",
        "date_accepted",
        "message",
      ],
      report_status: ["pending", "under_review", "resolved", "dismissed"],
      spark_decision: ["spark", "pass"],
      subscription_tier: ["free", "pass_monthly", "pass_annual"],
    },
  },
} as const
