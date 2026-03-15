import { spawn } from "node:child_process";

const port = process.env.SMOKE_PORT || "4100";
const baseUrl = `http://127.0.0.1:${port}`;
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const checks = [
  { path: "/", contains: "Months List" },
  { path: "/month", contains: "Back" },
  { path: "/month/March-2026", contains: "Print TR7 out!" },
];

let logs = "";

function appendLog(chunk) {
  logs += chunk.toString();
  if (logs.length > 12000) {
    logs = logs.slice(-12000);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        return;
      }
    } catch (_error) {
      // Server is still starting.
    }
    await sleep(1000);
  }
  throw new Error(`Server did not become ready at ${baseUrl}`);
}

async function assertPage({ path, contains }) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  const html = await response.text();
  if (!html.includes(contains)) {
    throw new Error(`${path} does not include expected text: "${contains}"`);
  }
}

async function shutdown(serverProcess) {
  if (
    !serverProcess ||
    serverProcess.exitCode !== null ||
    serverProcess.signalCode !== null
  ) {
    return;
  }

  serverProcess.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => serverProcess.once("exit", resolve)),
    sleep(5000),
  ]);

  if (serverProcess.exitCode === null && serverProcess.signalCode === null) {
    serverProcess.kill("SIGKILL");
  }
}

const serverProcess = spawn(
  npmCommand,
  ["run", "start", "--", "-p", port],
  {
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  }
);

serverProcess.stdout.on("data", appendLog);
serverProcess.stderr.on("data", appendLog);

try {
  await waitForServer();
  for (const check of checks) {
    await assertPage(check);
  }
  console.log("Smoke test passed.");
} catch (error) {
  console.error("Smoke test failed.");
  console.error(error instanceof Error ? error.message : String(error));
  console.error("Recent server logs:\n", logs);
  process.exitCode = 1;
} finally {
  await shutdown(serverProcess);
}
