import { test, expect } from "@playwright/test";
import fs from "fs";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3002/");
});

test("remove row performance metrics", async ({ page, browser }, testInfo) => {
  await browser.startTracing(page, {
    path: "remove.json",
    screenshots: true,
  });

  await page.getByTestId("generate-btn").click();
  const table = page.locator(".tableList > .row");
  await expect(table).toHaveCount(500);

  await table.nth(4).getByTestId("remove-btn").click();

  const getAllMeasuresJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType("measure"))
  );
  const getAllMeasures = JSON.parse(getAllMeasuresJson);
  const removingRowMeasure =
    getAllMeasures.find((measure) => measure.name === "time--removing-row")
      ?.duration ?? "none";
  console.log(
    `[${testInfo.repeatEachIndex + 1}/1000] Removing Row Duration`,
    removingRowMeasure
  );
  fs.appendFileSync(
    "./test-results/svelte-remove-durations",
    removingRowMeasure.toFixed(1) + "\n"
  );

  await browser.stopTracing();
});
