const uniqId = () => {
  const sec = Date.now() * 1000 + Math.random() * 1000;
  const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
  return `${id}${Math.trunc(Math.random() * 100000000)}`;
};

export default uniqId;
