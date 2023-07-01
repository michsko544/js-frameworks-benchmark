import { test, expect } from "@playwright/test";
import fs from "fs";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test("should render 500 rows by clicking generate button", async ({ page }) => {
  await page.getByTestId("generate-btn").click();

  const table = page.locator(".tableList > .row");

  await expect(table).toHaveCount(500);
});

test("should select row by clicking it", async ({ page }) => {
  await page.getByTestId("generate-btn").click();

  const firstRow = page.locator(".tableList > .row").first();

  const initialColor = await firstRow.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue("background-color");
  });

  await firstRow.click();

  const selectedColor = await firstRow.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue("background-color");
  });

  await expect(selectedColor).not.toBe(initialColor);
});

test("generate render 500 rows performance metrics", async ({
  page,
  browser,
}) => {
  // const fd = fs.openSync("./generate500-durations", "w");

  await browser.startTracing(page, {
    path: "generate500.json",
    screenshots: true,
  });

  await page.getByTestId("generate-btn").click();

  const getAllMarksJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType("mark"))
  );
  const getAllMarks = JSON.parse(getAllMarksJson);
  console.log('window.performance.getEntriesByType("mark")', getAllMarks);

  const getAllMeasuresJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType("measure"))
  );
  const getAllMeasures = JSON.parse(getAllMeasuresJson);
  const rendering500RowsMeasure =
    getAllMeasures.find(
      (measure) => measure.name === "time--rendering-500-rows"
    )?.duration ?? "none";
  console.log("Rendering 500 Rows Duration ", rendering500RowsMeasure);

  await browser.stopTracing();
});
