import { NextResponse } from "next/server";
import { get_all_players, add_player } from "@/app/utils/db";

export async function GET() {
    try {
        const players = await get_all_players();
        return NextResponse.json(players);
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Failed to fetch players"}, {status: 500});
    }
}


export async function POST(req) {
    try {
        const { id, alias } = await req.json();
        const result = await add_player(id, alias);
        return NextResponse.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to add player"}, {status: 500});
    }
}