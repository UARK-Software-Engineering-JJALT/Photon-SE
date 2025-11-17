import { NextResponse } from "next/server";
import { get_player, update_player, remove_player } from "../../../utils/db";

export async function GET(req, { params }) {
    const { id } = await params
    try {
        const player = await get_player(id);
        if (!player) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(player);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch player" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = await params
    try {
        const { alias } = await req.json();
        const result = await update_player(id, alias);
        return NextResponse.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params
    try {
        const result = await remove_player(id);
        return NextResponse.json(result.rows[0] || { message: "Deleted" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
    }
}
