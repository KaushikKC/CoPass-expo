import app from "./app.js";

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`CoPass backend running on port ${PORT}`);
});
