import app from "./src/app";

const PORT = app.get("port");
console.log(PORT);

app.listen(PORT, () => {
  console.log(`App running on PORT: ${PORT}`);
});
