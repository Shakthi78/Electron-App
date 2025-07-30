// /src/electron/puppeteer-launcher.js
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

let launchedPage = null; // Expose the page for later control
let launchedBrowser = null;

function getChromeExecutablePath() {
  const possiblePaths = [
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  ];

  for (const chromePath of possiblePaths) {
    if (fs.existsSync(chromePath)) {
      return chromePath;
    }
  }

  return null; // or throw an error if preferred
}

const executablePath = getChromeExecutablePath()

const launchMeeting = async (meetingUrl) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: executablePath, // Your Chrome path
    args: [
      `--app=${meetingUrl}`,
      "--start-fullscreen",
      "--disable-infobars",
      "--disable-extensions",
      "--disable-dev-shm-usage",
    ],
    ignoreDefaultArgs: ["--enable-automation"],
    userDataDir: "C:/Temp/OneRoomChromeProfile", // Use consistent profile path
  });

  const pages = await browser.pages();
  const page = pages[0];

  launchedBrowser = browser; // Save the browser
  launchedPage = page;
  await page.goto(meetingUrl, { waitUntil: "load" });

  let isDev = true

  const preloadPath = isDev
  ? path.join(__dirname, 'meeting-preload.js')
  : path.join(process.resourcesPath, "src", "electron", 'meeting-preload.js');

  page.on("framenavigated", async (frame) => {
    if (frame === page.mainFrame()) {
      try {
        const script = fs.readFileSync(
          preloadPath,
          "utf8"
        );
        await page.evaluate(script);
        console.log("🔁 Re-injecting preload script after navigation");
      } catch (err) {
        console.warn("⚠️ Failed to re-inject script:", err.message);
      }
    }
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
  );

  // Inject your script
  // await page.evaluate(async () => {
  //   const name = localStorage.getItem("userEmail") || "Guest User";

  //   const tryInjectName = () => {
  //     const input = document.querySelector('.fui-Input__input');
  //     if (!input) {
  //       console.log("⏳ Waiting for name input...");
  //       return setTimeout(tryInjectName, 500);
  //     }

  //     // Use native setter to properly trigger React’s internal state updates
  //     const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  //     nativeInputValueSetter?.call(input, name);

  //     // Dispatch events that React listens to
  //     input.dispatchEvent(new Event('input', { bubbles: true }));
  //     input.dispatchEvent(new Event('change', { bubbles: true }));
  //     input.dispatchEvent(new Event('blur', { bubbles: true }));

  //     console.log("✅ Injected name:", name);

  //     const joinBtn = document.querySelector('[data-tid=prejoin-join-button]');
  //     if (joinBtn) {
  //       setTimeout(() => joinBtn.click(), 500);
  //     }
  //   };

  //   tryInjectName();
  // });

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

const launchTeamsMeeting = async (meetingUrl, meetingId, passcode) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: executablePath,
    args: [
      `--app=${meetingUrl}`,
      "--start-fullscreen",
      "--disable-infobars",
      "--disable-extensions",
      "--disable-dev-shm-usage",
    ],
    ignoreDefaultArgs: ["--enable-automation"],
    userDataDir: "C:/Temp/OneRoomChromeProfile",
  });

  const pages = await browser.pages();
  const page = pages[0];

  launchedBrowser = browser;
  launchedPage = page;

  // Wait for the page to fully load
  await page.goto(meetingUrl, { waitUntil: "load" });

  let isDev = true

 const preloadPath = isDev
  ? path.join(__dirname, 'meeting-preload.js')
  : path.join(process.resourcesPath, "src", "electron", 'meeting-preload.js');

  page.on("framenavigated", async (frame) => {
    if (frame === page.mainFrame()) {
      try {
        const script = fs.readFileSync(
          preloadPath,
          "utf8"
        );
        await page.evaluate(script);
        console.log("🔁 Re-injecting preload script after navigation");
      } catch (err) {
        console.warn("⚠️ Failed to re-inject script:", err.message);
      }
    }
  });

  // Fill the meeting details
  await page.evaluate(
    async({ meetingId, passcode }) => {
      const tryInject = () => {
        const inputs = document.querySelectorAll(".form-row input");
        if (inputs.length < 2) {
          console.log("Waiting for inputs...");
          return setTimeout(tryInject, 500);
        }

        const [meetingIdInput, passcodeInput] = inputs;
        meetingIdInput.value = meetingId;
        passcodeInput.value = passcode;

        meetingIdInput.dispatchEvent(new Event("input", { bubbles: true }));
        passcodeInput.dispatchEvent(new Event("input", { bubbles: true }));

        const joinBtn = document.querySelector('button[type="submit"]');
        if (joinBtn) {
          setTimeout(() => joinBtn.click(), 500);
        } else {
          console.warn("Join button not found");
        }
      };

      tryInject();
    },
    { meetingId, passcode } // Pass values into the page context
  );

  return page;
};


module.exports = { launchMeeting, executeControl,closeMeeting, launchTeamsMeeting  };
