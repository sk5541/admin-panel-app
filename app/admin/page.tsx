"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
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
            <h2>Statistics</h2>
            <p>Total Users: {userCount}</p>

            <h2>Manage Data</h2>
            <p><Link href="/admin/users">Users</Link></p>
            <p><Link href="/admin/images">Images</Link></p>
            <p><Link href="/admin/terms">Terms</Link></p>
            <p><Link href="/admin/captions">Captions</Link></p>
            <p><Link href="/admin/caption-requests">Captions Requests</Link></p>
            <p><Link href="/admin/caption-examples">Caption Examples</Link></p>
            <p><Link href="/admin/humor-flavors">Humor Flavors</Link></p>
            <p><Link href="/admin/humor-flavor-steps">Humor Flavors Steps</Link></p>
            <p><Link href="/admin/humor-flavor-mix">Humor Flavors Mix</Link></p>
            <p><Link href="/admin/llm-models">LLM Models</Link></p>
            <p><Link href="/admin/llm-providers">LLM Providers</Link></p>
            <p><Link href="/admin/llm-prompt-chains">LLM Prompt Chains</Link></p>
            <p><Link href="/admin/llm-responses">LLM Responses</Link></p>
            <p><Link href="/admin/allowed-signup-domains">Allowed Signup Domains</Link></p>
            <p><Link href="/admin/whitelist-email-addresses">Whitelist Email Addresses</Link></p>
    
        </div>
    )
}