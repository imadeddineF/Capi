import axios from "axios";
import getEnv from "./env";
import Cookies from "js-cookie";

export const BASE_URL =
	getEnv.ENV === "development"
		? getEnv.NEXT_PUBLIC_LOCAL_API_URL
		: getEnv.NEXT_PUBLIC_HOSTED_API_URL;

export const CustomAxios = async (
	path: string,
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
	data?: any
) => {
	const token = Cookies.get("refresh_token");

	console.log(`request to path: --------> ${BASE_URL}${path}`);

	const res = await axios({
		url: `${BASE_URL}${path}`,
		method,
		data,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		withCredentials: true,
	});
	return res;
};

export const checkServerNetwork = async (err: any) => {
	if (axios.isAxiosError(err)) {
		if (err.code === "ERR_NETWORK" && err.message === "Network Error") {
			console.log("no network connection or no serveur response received");
			return "ERR_NETWORK";
		}
	} else {
		return null;
	}
};
