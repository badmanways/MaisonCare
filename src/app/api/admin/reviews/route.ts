import { NextRequest, NextResponse } from "next/server";
import { ReviewStatus, updateDbAsync } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/security";

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = String(body.id || "");
    const status = body.status as ReviewStatus;

    if (!id || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Valid review ID and status are required." },
        { status: 400 }
      );
    }

    await updateDbAsync((db) => {
      const review = db.reviews.find((r) => r.id === id);
      if (review) {
        review.status = status;
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in PATCH /api/admin/reviews:", err);
    return NextResponse.json(
      { error: "Failed to update review status." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required." },
        { status: 400 }
      );
    }

    await updateDbAsync((db) => {
      db.reviews = db.reviews.filter((r) => r.id !== id);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in DELETE /api/admin/reviews:", err);
    return NextResponse.json(
      { error: "Failed to delete review." },
      { status: 500 }
    );
  }
}

