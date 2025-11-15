import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

type HTTPRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HTTPRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }
  if (!data.variableName) {
    throw new NonRetriableError(
      "HTTP Request node: No variable name configured"
    );
  }
  if (!data.method) {
    throw new NonRetriableError("HTTP Request node: No method configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context);
    console.log("endpoint", endpoint);
    const method = data.method;

    const options: KyOptions = { method };
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body || "{}")(context);
      let parsedBody: string;

      // Handle case where Handlebars outputs the literal string "undefined"
      const trimmed = resolved.trim();
      if (trimmed === "undefined" || trimmed === "") {
        parsedBody = "{}";
      } else {
        try {
          const parsed = JSON.parse(resolved);
          parsedBody = JSON.stringify(parsed);
        } catch (error) {
          throw new NonRetriableError(
            `HTTP Request node: Invalid JSON in request body: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }

      if (data.body) {
        options.body = parsedBody;
        options.headers = {
          "Content-Type": "application/json",
        };
      }
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json().catch(() => response.text())
      : await response.text();
    const responsePayload = {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });
  return result;
};
