import express, { Request, Response, Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { registerUser, loginUser, getUserInfo } from "../controllers/authController";
import upload from "../middleware/uploadMiddleware";

const router: Router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);
router.post("/upload-image", upload.single("image"), (
    req: Request,
    res: Response
) => {
    if(!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl: string = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`;
    return res.status(200).json({ imageUrl });
});

export default router;