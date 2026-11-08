import type { checkAuth } from "../../types/Login";
import { api } from "../api/api";


export async function checkAuth(token:string): Promise<checkAuth> {

  return api("/usuario/checkauth", {
    method: "POST",
    token
  }); 
}