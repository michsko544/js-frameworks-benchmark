import { test, expect } from "@playwright/test";
import fs from "fs";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3002/");
});

test("select row performance metrics", async ({ page, browser }, testInfo) => {
  await browser.startTracing(page, {
    path: "select.json",
    screenshots: true,
  });

  await page.getByTestId("generate-btn").click();
  const table = page.locator(".tableList > .row");
  await expect(table).toHaveCount(5000);

  await table.nth(4).click();

  const getAllMeasuresJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType("measure"))
  );
  const getAllMeasures = JSON.parse(getAllMeasuresJson);
  const selectingRowMeasure =
    getAllMeasures.find((measure) => measure.name === "time--selecting-row")
      ?.duration ?? "none";
  console.log(
    `[${testInfo.repeatEachIndex + 1}/1000] Selecting Row Duration`,
    selectingRowMeasure
  );
  fs.appendFileSync(
    "./test-results/svelte-select-durations",
    selectingRowMeasure.toFixed(1) + "\n"
  );

  await browser.stopTracing();
});
