import getEnv from "./env";

// export const BASEURL = getEnv.NEXT_PUBLIC_LOCAL_API_URL;
export const BASEURL = getEnv.NEXT_PUBLIC_LOCAL_API_URL;

// Add error handling for BASEURL
if (!BASEURL) {
  console.error("BASEURL is undefined! Check your environment variables.");
}

console.log("******** BASEURL *********: ", BASEURL);
