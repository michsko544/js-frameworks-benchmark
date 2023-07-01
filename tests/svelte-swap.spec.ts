import { test, expect } from "@playwright/test";
import fs from "fs";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3002/");
});

test("swap rows performance metrics", async ({ page, browser }, testInfo) => {
  await browser.startTracing(page, {
    path: "swap.json",
    screenshots: true,
  });

  await page.getByTestId("generate-btn").click();
  const table = page.locator(".tableList > .row");
  await expect(table).toHaveCount(500);

  await page.getByTestId("swap-btn").click();

  const getAllMeasuresJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType("measure"))
  );
  const getAllMeasures = JSON.parse(getAllMeasuresJson);
  const swappingRowMeasure =
    getAllMeasures.find((measure) => measure.name === "time--swapping-rows")
      ?.duration ?? "none";
  console.log(
    `[${testInfo.repeatEachIndex + 1}/1000] Swapping Rows Duration`,
    swappingRowMeasure
  );
  fs.appendFileSync(
    "./test-results/svelte-swap-durations",
    swappingRowMeasure.toFixed(1) + "\n"
  );

  await browser.stopTracing();
});
