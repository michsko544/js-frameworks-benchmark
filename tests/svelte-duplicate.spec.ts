import { test, expect } from "@playwright/test";
import fs from "fs";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3002/");
});

test("duplicate row performance metrics", async ({
  page,
  browser,
}, testInfo) => {
  await browser.startTracing(page, {
    path: "duplicate.json",
    screenshots: true,
  });

  await page.getByTestId("generate-btn").click();
  const table = page.locator(".tableList > .row");
  await expect(table).toHaveCount(500);

  await table.nth(4).getByTestId("duplicate-btn").click();

  const getAllMeasuresJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType("measure"))
  );
  const getAllMeasures = JSON.parse(getAllMeasuresJson);
  const duplicatingRowMeasure =
    getAllMeasures.find((measure) => measure.name === "time--duplicating-row")
      ?.duration ?? "none";
  console.log(
    `[${testInfo.repeatEachIndex + 1}/1000] duplicating Row Duration`,
    duplicatingRowMeasure
  );
  fs.appendFileSync(
    "./test-results/svelte-duplicate-durations",
    duplicatingRowMeasure.toFixed(1) + "\n"
  );

  await browser.stopTracing();
});
