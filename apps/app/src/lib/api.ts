import { createTRPCReact } from "@trpc/react-query";
import {AppRouter} from "@pulseshelf/api";

export const api = createTRPCReact<AppRouter>();