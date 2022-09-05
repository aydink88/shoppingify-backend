import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const drop = async () => {
  const conn = mongoose.createConnection(process.env.MONGO_URI);
  // Deletes the entire database
  await conn.dropDatabase();
};

drop()
  .then(() => console.log('database dropped'))
  .catch((reason) => console.log(`failed: ${reason}`))
  .finally(() => {
    process.exit();
  });
