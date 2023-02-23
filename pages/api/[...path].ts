import { NextApiRequest, NextApiResponse } from "next";
import axios, { Method } from "axios";

const ENDPOINT = "https://identity.nodefinance.org";

const cookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 8, // 8 hours
  path: "/",
  sameSite: process.env.NODE_ENV ? "Strict" : "Lax",
  secure: process.env.NODE_ENV === "production",
};

// Quick and dirty way for us to hide API key on client
async function serviceWrapper(req: NextApiRequest, res: NextApiResponse) {
  const { path: _path, ...params } = req.query;
  const path = !_path ? [] : Array.isArray(_path) ? _path : [_path];

  try {
    const method = (req.method?.toLowerCase() ?? "get") as Method;
    const resp = await axios.request({
      ...req,
      url: [ENDPOINT, ...path].map((s) => s.trim()).join("/"),
      method,
      params,
      data: req.body,
      headers: {
        ["x-api-key"]: process.env.IDENTITY_API_KEY,
      },
    });

    res.send(resp?.data);
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      res.status(+(error.code ?? 500)).json({ message: error.message });
    }
  }
}

export default serviceWrapper;
