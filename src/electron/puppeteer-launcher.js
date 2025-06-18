// /src/electron/puppeteer-launcher.js
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

let launchedPage = null; // Expose the page for later control
let launchedBrowser = null;

const launchMeeting = async (meetingUrl) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Your Chrome path
    args: [
      `--app=${meetingUrl}`,
      "--start-fullscreen",
      "--no-sandbox",
      "--disable-infobars", //helps remove some banners
      "--disable-extensions",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled", //  hides automation detection
    ],
    ignoreDefaultArgs: ["--enable-automation"], //  removes automation flag
    userDataDir: "C:/Temp/ChromeProfile",
  });

  const pages = await browser.pages();
  const page = pages[0];

  launchedBrowser = browser; // Save the browser
  launchedPage = page;
  await page.goto(meetingUrl, { waitUntil: "load" });

  // Inject your script
  const script = fs.readFileSync(
    path.join(__dirname, "meeting-preload.js"),
    "utf8"
  );
  await page.evaluate(script);

  return page;
};

const executeControl = async (action) => {
  if (!launchedPage) return;
  await launchedPage.evaluate((action) => {
    executeControl(action);
  }, action);
};

const closeMeeting = async () => {
  if (launchedBrowser) {
    await launchedBrowser.close();
    launchedBrowser = null;
    launchedPage = null;
  }
};

module.exports = { launchMeeting, executeControl,closeMeeting  };
