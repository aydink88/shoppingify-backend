import mongoose from 'mongoose';

const connect = async () => {
  console.log('connecting db');
  await mongoose.connect(process.env.MONGO_TEST_URI);
  await clear();
};

const clear = async () => {
  console.log('dropping db');
  await mongoose.connection.dropDatabase();
  // const collections = mongoose.connection.collections;
  // for (const c in collections) {
  //   await collections[c].deleteMany();
  // }
};

const close = async () => {
  console.log('closing connection');
  await mongoose.connection.close();
};

export { connect, clear, close };
