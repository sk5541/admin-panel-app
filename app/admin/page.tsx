"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

export default function AdminPage() {
    const [userCount, setUserCount ] = useState(0)
    useEffect(() => {
        getStats()
    }, [])

    async function getStats() {
        const { count } = await supabase
            .from("profiles")
            .select("*", {count: "exact", head: true})

        setUserCount(count || 0)
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>This is the admin panel.</p>
        </div>
    )
}