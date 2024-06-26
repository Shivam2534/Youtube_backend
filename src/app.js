import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import multer from "multer";
// const upload = multer();

const app = express();
// app.use(upload.array());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    // this is for , when data is coming from "form"
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    // this is for , when data is coming from "url"
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("Public")); // when we need to store files/imgs/pdfs in locall machine we can put them inside public folder

app.use(cookieParser()); // so that we can do CRUD operations over cookies, also it give access of cookies to the req

// just for checking
// app.get('/', (req,res)=>{
//     res.send("Good to go...")
// })

// router imports
import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import playlistRouter from "./routes/playlist.route.js";
import commentRouter from "./routes/Comment.route.js";
import tweetRouter from "./routes/Tweet.route.js";
import SubscribtionRouter from "./routes/Subscribtion.route.js";
import likeRouter from "./routes/like.route.js";

// route declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscribtions", SubscribtionRouter);
app.use("/api/v1/likes", likeRouter);

app.get("/", (req, res) => {
  res.send("Good to go...");
});

export { app };
