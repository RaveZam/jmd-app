import type { ReactElement } from "react";
import { getSessions } from "./services/sessionsService";
import { SessionsClient } from "./components/SessionsClient";

export async function SessionsPage(): Promise<ReactElement> {
  const sessions = await getSessions();
  return <SessionsClient sessions={sessions} />;
}

export default SessionsPage;
