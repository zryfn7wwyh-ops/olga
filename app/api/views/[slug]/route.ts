import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { getPostBySlug } from "@/lib/blog";

const STORE_PATH = path.join(process.cwd(), ".data", "blog-views.json");

type ViewsStore = Record<string, number>;

async function readStore(): Promise<ViewsStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as ViewsStore;
  } catch {
    return {};
  }
}

async function writeStore(store: ViewsStore): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store), "utf-8");
}

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const store = await readStore();
  return NextResponse.json({ views: store[slug] ?? 0 });
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { slug } = await params;

  if (!getPostBySlug(slug)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const store = await readStore();
  store[slug] = (store[slug] ?? 0) + 1;
  await writeStore(store);

  return NextResponse.json({ views: store[slug] });
}
