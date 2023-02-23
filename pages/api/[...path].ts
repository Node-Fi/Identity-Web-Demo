import { NextApiRequest, NextApiResponse } from "next";
import axios, { Method } from "axios";
import { NextRequest, NextResponse } from "next/server";

const ENDPOINT = "https://identity.nodefinance.org";

const cookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 8, // 8 hours
  path: "/",
  sameSite: process.env.NODE_ENV ? "Strict" : "Lax",
  secure: process.env.NODE_ENV === "production",
};

export const config = {
  runtime: "experimental-edge",
};

// Quick and dirty way for us to hide API key on client
async function serviceWrapper(req: NextRequest, res: NextResponse) {
  const path = req.url.split("/api/")[1].split("/");

  try {
    const method = (req.method?.toLowerCase() ?? "get") as Method;
    const response = await fetch(
      [ENDPOINT, ...path].map((s) => s.trim()).join("/"),
      {
        ...req,
        method,
        body: req.body ? JSON.stringify(req.body) : undefined,
        headers: {
          ["x-api-key"]: process.env.IDENTITY_API_KEY as string,
        },
      }
    );

    const resp = await response.json();

    if (response.status === 200) {
      return NextResponse.json(resp);
    } else {
      return NextResponse.json(
        { message: resp.message, path },
        {
          status: response.status,
        }
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const jsonError = error.toJSON() as { status: number };

      return NextResponse.json(
        { message: error.message, path },
        {
          status: +(error.status ?? jsonError.status ?? 500),
        }
      );
    }
  }
}

export default serviceWrapper;
