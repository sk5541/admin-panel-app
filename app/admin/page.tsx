"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

export default function AdminPage() {
    const [userCount, setUserCount ] = useState(0)
    useEffect(() => {
        checkAdmin()
        getStats()
    }, [])

    async function checkAdmin() {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user){
            console.log("No user logged in")
            return
        }
        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

        if (!profile?.is_superadmin) {
            alert("You are not allowed to access the admin panel.")
            window.location.href = "/"
        }
    }

    async function getStats() {
        const { count } = await supabase
            .from("profiles")
            .select("*", {count: "exact", head: true})

        setUserCount(count || 0)
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Statistics</h2>
            <p>Total Users: {userCount}</p>
        </div>
    )
}