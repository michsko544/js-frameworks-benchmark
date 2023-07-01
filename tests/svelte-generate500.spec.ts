import { test } from "@playwright/test";
import fs from "fs";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3002/");
});

test("generate render 500 rows performance metrics", async ({
  page,
  browser,
}, testInfo) => {
  await browser.startTracing(page, {
    path: "generate500.json",
    screenshots: true,
  });

  await page.getByTestId("generate-btn").click();

  const getAllMeasuresJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType("measure"))
  );
  const getAllMeasures = JSON.parse(getAllMeasuresJson);
  const rendering500RowsMeasure =
    getAllMeasures.find(
      (measure) => measure.name === "time--rendering-500-rows"
    )?.duration ?? "none";
  console.log(
    `[${testInfo.repeatEachIndex + 1}/1000] Rendering 500 Rows Duration `,
    rendering500RowsMeasure
  );
  fs.appendFileSync(
    "./test-results/svelte-generate500-durations",
    rendering500RowsMeasure.toFixed(1) + "\n"
  );

  await browser.stopTracing();
});
