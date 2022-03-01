/*
Copyright 2019-2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { Constant } from "../general/constant";
import { $, browser } from "protractor";
import { DownloadSharePage } from "../page-object/download-share-page";
import { CommonPage } from "../general/commom-page";
import { FunctionUtil } from "../utils/function-util";

describe("verify generate-download-share funtion", () => {
  const filename = "Export_text-test-data_";
  const dirPath = require("path").join(__dirname, "../doc/download");

  let commonPage: CommonPage = new CommonPage();
  let downloadSharePage: DownloadSharePage = new DownloadSharePage();
  let project_name: string = Constant.project_name_text_multiple;
  const PROJECT_TAB = $('.header-nav a[href="/projects"]');
  const COMMUNITY_DATASETS_TAB = $('.header-nav a[href="/datasets"]');

  describe("verify project tab", () => {
    beforeEach((down) => {
      downloadSharePage.reMoveDir(dirPath);
      down();
    });

    it("Generate-new-dataset.", async (done) => {
      await browser.sleep(2000);
      await FunctionUtil.click(PROJECT_TAB);
      await commonPage.waitForGridLoading();
      await commonPage.filterProjectName(project_name);
      await downloadSharePage.clickdownloadProject();
      await downloadSharePage.clickGenerateNewDataset();
      expect(
        await downloadSharePage.verifyDownloadFileExisted(filename, dirPath)
      ).toBe(true);
      done();
    });

    it("Download project.", async (done) => {
      await downloadSharePage.clickdownloadProject();
      await downloadSharePage.clickGenerateNewDataset();
      expect(
        await downloadSharePage.verifyDownloadFileExisted(filename, dirPath)
      ).toBe(true);
      done();
    });

    it("Share project.", async (done) => {
      await downloadSharePage.shareProject(Constant.project_name_text_multiple);
      if (process.env.IN) {
        expect(downloadSharePage.verifySharedStatus()).toEqual("folder");
      } else {
        expect(downloadSharePage.verifySharedStatus()).toEqual("folder-open");
      }
      done();
    });
  });

  describe("verify community-dataset tab", () => {
    beforeEach((down) => {
      downloadSharePage.reMoveDir(dirPath);
      down();
    });

    it("Generate-new-dataset", async (done) => {
      await FunctionUtil.click(COMMUNITY_DATASETS_TAB);
      await commonPage.waitForGridLoading();
      await commonPage.changePageValue(2);
      await commonPage.filterProjectName(project_name);
      await downloadSharePage.clickdownloadProject();
      await downloadSharePage.clickGenerateNewDataset();
      expect(
        await downloadSharePage.verifyDownloadFileExisted(filename, dirPath)
      ).toBe(true);
      done();
    });

    it("Download project", async (done) => {
      await downloadSharePage.clickdownloadProject();
      await downloadSharePage.clickGenerateNewDataset();
      expect(
        await downloadSharePage.verifyDownloadFileExisted(filename, dirPath)
      ).toBe(true);
      done();
    });
  });
});
