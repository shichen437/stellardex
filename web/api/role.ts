import { request } from "@/lib/api";

export async function listRole() {
  return request({
    url: "/role/list",
    method: "get",
  });
}
