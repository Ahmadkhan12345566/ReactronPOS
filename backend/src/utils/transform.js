export const toObjectWithId = (doc) => {
  if (!doc) return null;
  const obj = doc.get ? doc.get({ plain: true }) : { ...doc };
  if (obj.id === undefined && obj._id !== undefined) {
    obj.id = obj._id;
    delete obj._id;
  }
  delete obj.__v;
  return obj;
};

export const toObjectsWithId = (docs) => {
  if (!docs || !Array.isArray(docs)) return [];
  return docs.map(toObjectWithId);
};
