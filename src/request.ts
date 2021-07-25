import requestPromise from "request-promise";
import cheerio from "cheerio";
import { edusoft } from "./configs/edusoft";

const send = (
  method: string,
  uri: string,
  data?: object,
  headers?: object,
  json?: boolean
) => {
  let convertedData: any[] = data ? convertData(data) : [];

  return requestPromise(`${edusoft.host}${uri}`, {
    method: method,
    headers: {
      "content-type": "multipart/form-data",
      ...headers,
    },
    multipart: json
      ? undefined
      : {
          chunked: false,
          data: convertedData,
        },
    json: json ? data : undefined,
    followAllRedirects: true,
    jar: true,
    transform: (body) => (json ? body : cheerio.load(body)),
  });
};

const convertData = (data: object) => {
  let convertedData: any[] = [];

  for (const [key, value] of Object.entries(data)) {
    convertedData.push({
      "Content-Disposition": `form-data; name="${key}"`,
      body: value,
    });
  }

  return convertedData;
};

const get = async (url: string): Promise<any> => {
  return await send("GET", url);
};

const post = async (
  url: string,
  data?: object,
  headers?: object,
  json?: boolean
): Promise<any> => {
  return await send("POST", url, data, headers, json);
};

export default { get, post };
