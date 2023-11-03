import { db } from "../db/index.mjs";
import { ObjectId } from "mongodb";

export const getAllProducts = async (req, res) => {
  console.log("testing");
  try {
    // Assuming 'db' is your MongoDB database instance, use 'db.collection' to access the collection.
    const products = db.collection("products"); // Corrected 'collections' to 'collection'
    const data = await products.find({}).toArray();

    if (!data.length) {
      res.status(404).send({ message: "Products Not Found" });
      return;
    }

    res.status(200).send({ message: "All Products fetched", data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message || "Unknown Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const query = { _id: new ObjectId(id) };

    const products = db.collection("products");
    const data = await products.findOne(query);

    if (!data) throw Error("Product Not Found!");

    res.send({ message: "Product found", data });
  } catch (err) {
    res.status(500).send({ message: err.message || "Unknown Error" });
  }
};

export const addProduct = async (req, res) => {
  const { name, description } = req.body;
  const price = Number(req.body.price);

  // Validation
  if (
    !name ||
    !price ||
    !description ||
    isNaN(price) ||
    typeof name !== "string" ||
    typeof description !== "string"
  ) {
    res.status(403).send("parameterMissing");
    return;
  }
  try {
    const products = db.collection("products");
    // console.log("uhuhhuuhu", products);
    const data = await products.insertOne({ name, price, description });

    if (data.acknowledged)
      res.status(201).send({
        message: "New Product Created!",
        id: data.insertedId.toString(),
      });
  } catch (err) {
    res.status(500).send({ message: err.message || "Unknown Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id, name, description } = req.body;
  const price = Number(req.body.price);

  // Validation
  if ((!name && !price && !description) || !id) {
    res.status(403).send("parameterMissing");
    return;
  }

  if (price && isNaN(price)) {
    res.status(403).send("Price missing");
    return;
  }
  if (name && typeof name !== "string") {
    res.status(403).send("NAME  missing");
    return;
  }
  if (description && typeof description !== "string") {
    res.status(403).send("description missing");
    return;
  }

  try {
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: { name, price, description } };
    const products = db.collection("products");
    const data = await products.updateOne(filter, updateDoc);

    if (!data.matchedCount) throw Error("Product Not Found!");

    res.status(201).send({ message: "Product updated" });
  } catch (err) {
    res.status(500).send({ message: err.message || "Unknown Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const products = db.collection("products");
    const query = { _id: new ObjectId(id) };
    const result = await products.deleteOne(query);

    if (!result.deletedCount)
      throw new Error("No documents matched the query. Deleted 0 documents.");

    res.status(201).send({ message: "Successfully deleted one document." });
  } catch (err) {
    res.status(500).send({ message: err.message || "Unknown Error" });
  }
};
