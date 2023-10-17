const fetcher = async (...args: Parameters<typeof fetch>): Promise<any> => {
  const response = await fetch(...args);
  const data = await response.json();
  return data;
};

export default fetcher