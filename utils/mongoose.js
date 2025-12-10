// ReactronPOS/backend/src/utils/mongoose.js
export const toObjectWithId = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

export const toObjectsWithId = (docs) => {
  if (!docs || !Array.isArray(docs)) return [];
  return docs.map(toObjectWithId);
};
