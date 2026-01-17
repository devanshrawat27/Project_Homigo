const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_url = "mongodb://127.0.0.1:27017/Homigo";

main()
  .then(() => {
    console.log("✅ Mongodb is connected");
  })
  .catch((err) => {
    console.log("❌ Mongodb is not connected", err);
  });

async function main() {
  await mongoose.connect(Mongo_url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("✅ Old listings deleted");

  // ✅ Paste your valid USER ObjectId here (from db.users.find())
  const ownerId = new mongoose.Types.ObjectId("6963ddd4535880f9712aa9ca"); // dev123

  // ✅ add owner to all data
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: ownerId,
  }));

  // ✅ insert into DB
  await Listing.insertMany(initdata.data);
  console.log("✅ Data Imported Successfully");

  process.exit(0);
};

initDB();
