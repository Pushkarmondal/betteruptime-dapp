import express from "express";
import { authMiddleWare } from "./middleware";
import { prismaclient } from "db/client";

const app = express();
const PORT = 9008;

app.post("/api/v1/website", authMiddleWare, async (req, res) => {
  try {
    const userId = req.userId!;
    const { url } = req.body;
    const response = await prismaclient.website.create({
      data: {
        userId,
        url,
      },
    });
    res.status(201).json({
      id: response.id,
      url: response.url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/api/v1/website/status", authMiddleWare, async (req, res) => {
  try {
    const websiteId = req.query.websiteId as string;
    const userId = req.userId;
    if(!userId) {
        res.status(403).json({ message: "Unauthorized" });
        return;
    }
    const response = await prismaclient.website.findFirst({
        where: {
            id: websiteId,
            userId,
            disabled: false
        },
        include: {
            websiteTick: true
        }
    })
    if(!response) {
        res.status(404).json({ message: "Website not found" });
        return;
    }
    res.status(200).json({
        website: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/v1/websites", authMiddleWare, async(req, res) => {
    try {
        const userId = req.userId;
        if(!userId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const response = await prismaclient.website.findMany({
            where: {
                userId,
                disabled: false
            }
        })
        res.status(200).json({
            websites: response,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete("/api/v1/website", authMiddleWare, async(req, res) => {
    try {
        const websiteId = req.body.websiteId;
        const userId = req.userId;
        if(!userId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const response = await prismaclient.website.update({
            where: {
                id: websiteId,
                userId
            },
            data: {
                disabled: true
            }
        })
        res.status(200).json({
            website: response,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
  console.log(`Website is running on PORT ${PORT}`);
});
