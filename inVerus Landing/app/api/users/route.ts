import { createClient } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, display_name, profile_image, tier, credits, created_at, last_active_at')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      count: users?.length || 0,
      users: users || []
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
