import HttpInterceptor from "./HttpInterceptor";

const Fetcher = async (url: string) => {
  try {
    const { data } = await HttpInterceptor.get(url);
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    throw new Error(error);
  }
};

export default Fetcher;