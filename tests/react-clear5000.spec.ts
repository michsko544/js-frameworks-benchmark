import { test, expect } from "@playwright/test";
import fs from "fs";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3001/");
});

test("clear 5000 rows performance metrics", async ({
  page,
  browser,
}, testInfo) => {
  await browser.startTracing(page, {
    path: "clear5000.json",
    screenshots: true,
  });

  await page.getByTestId("generate-btn").click();
  const table = page.locator(".tableList > .row");
  await expect(table).toHaveCount(5000);

  await page.getByTestId("clear-btn").click();

  const getAllMeasuresJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType("measure"))
  );
  const getAllMeasures = JSON.parse(getAllMeasuresJson);
  const clearing5000RowsMeasure =
    getAllMeasures.find(
      (measure) => measure.name === "time--clearing-5000-rows"
    )?.duration ?? "none";
  console.log(
    `[${testInfo.repeatEachIndex + 1}/1000] Clearing 5000 Rows Duration `,
    clearing5000RowsMeasure
  );
  fs.appendFileSync(
    "./test-results/react-clear5000-durations",
    clearing5000RowsMeasure.toFixed(1) + "\n"
  );

  await browser.stopTracing();
});
