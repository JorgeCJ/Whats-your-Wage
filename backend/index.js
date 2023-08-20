const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/programmers", async (req, res) => {
  try {
    const programmersSnapshot = await db.collection("programmers").get();
    const programmers = programmersSnapshot.docs.map((doc) => doc.data());
    res.json(programmers);
  } catch (error) {
    console.error("Error fetching programmers:", error);
    res.status(500).json({ message: "Error fetching programmers" });
  }
});

app.post("/programmers", async (req, res) => {
  const newProgrammer = req.body;

  try {
    const newProgrammerRef = await db.collection("programmers").add(newProgrammer);
    const createdProgrammer = await newProgrammerRef.get();
    res.status(201).json(createdProgrammer.data());
  } catch (error) {
    console.error("Error inserting programmer:", error);
    res.status(500).json({ message: "Error inserting programmer" });
  }
});

app.delete("/programmers/:id", async (req, res) => {
  const programmerId = req.params.id;

  try {
    const programmerRef = db.collection("programmers").doc(programmerId);
    const programmerDoc = await programmerRef.get();

    if (!programmerDoc.exists) {
      res.status(404).json({ message: "Programmer not found" });
    } else {
      await programmerRef.delete();
      res.status(200).json({ message: "Programmer deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting programmer:", error);
    res.status(500).json({ message: "Error deleting programmer" });
  }
});

//app.listen(() => console.log(`Server is running on Vercel`));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`));